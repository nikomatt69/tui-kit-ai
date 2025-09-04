import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../../../core/src/components/BaseComponent';
import { AgentDashboardProps, AgentDashboardVariants, AgentDashboardSizes, AgentDashboardStates, AgentDashboardLayout, AgentDashboardViewMode, AgentDashboardRefreshMode, AgentDashboardEvent, AgentDashboardAlert, AgentDashboardNotification, AgentDashboardStats, AgentDashboardLayoutConfig, AgentDashboardViewConfig, AgentDashboardExport } from './AgentDashboard.types';
import { AgentDashboardStyles } from './AgentDashboard.styles';
import { validateComponent, ValidationResult } from '../../../../core/src/validation/component-validator';

export class AgentDashboard implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: AgentDashboardProps;
  private validationResult: ValidationResult;
  private headerElement?: Widgets.BoxElement;
  private contentElement?: Widgets.BoxElement;
  private statsElement?: Widgets.BoxElement;
  private controlElement?: Widgets.BoxElement;
  private refreshIndicator?: Widgets.BoxElement;
  private selectedAgentId?: string;
  private alerts: AgentDashboardAlert[] = [];
  private notifications: AgentDashboardNotification[] = [];
  private refreshTimer?: NodeJS.Timeout;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(props: AgentDashboardProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('AgentDashboard', props);
    
    if (!this.validationResult.success) {
      console.error('❌ AgentDashboard validation failed:', this.validationResult.errors);
      throw new Error(`AgentDashboard validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ AgentDashboard warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    this.selectedAgentId = this.props.selectedAgentId;
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: AgentDashboardStyles.getContainerStyle(
        this.props.variant,
        this.props.size,
        this.props.state,
        this.props.layout || 'grid',
        this.props.theme
      ),
    });

    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;

    this.initializeComponents();
    this.setupEventListeners();
    this.startRefreshTimer();
    this.updateDisplay();
  }

  private initializeComponents(): void {
    this.createHeader();
    this.createContent();
    this.createStats();
    this.createControls();
    this.createRefreshIndicator();
  }

  private createHeader(): void {
    this.headerElement = this.el.children[0] as Widgets.BoxElement || this.el;
    
    const headerStyle = AgentDashboardStyles.getHeaderStyle(
      this.props.variant,
      this.props.size,
      this.theme
    );

    this.headerElement.style = headerStyle;
  }

  private createContent(): void {
    this.contentElement = this.el.children[1] as Widgets.BoxElement || this.el;
    
    const contentStyle = this.getContentStyle();
    this.contentElement.style = contentStyle;
  }

  private createStats(): void {
    this.statsElement = this.el.children[2] as Widgets.BoxElement;
    if (!this.statsElement) {
      this.statsElement = this.el;
    }

    const statsStyle = AgentDashboardStyles.getStatsStyle(this.props.variant, this.theme);
    this.statsElement.style = statsStyle;
  }

  private createControls(): void {
    this.controlElement = this.el.children[3] as Widgets.BoxElement;
    if (!this.controlElement) {
      this.controlElement = this.el;
    }

    const controlStyle = AgentDashboardStyles.getControlStyle(this.props.variant, this.props.state, this.theme);
    this.controlElement.style = controlStyle;
  }

  private createRefreshIndicator(): void {
    this.refreshIndicator = this.el.children[4] as Widgets.BoxElement;
    if (!this.refreshIndicator) {
      this.refreshIndicator = this.el;
    }

    const refreshStyle = AgentDashboardStyles.getRefreshIndicatorStyle(
      this.props.variant,
      this.props.refreshMode || 'manual',
      this.theme
    );
    this.refreshIndicator.style = refreshStyle;
  }

  private getContentStyle(): any {
    const layout = this.props.layout || 'grid';
    
    switch (layout) {
      case 'grid':
        return AgentDashboardStyles.getGridStyle(this.props.variant, this.theme);
      case 'rows':
        return AgentDashboardStyles.getPanelStyle(this.props.variant, this.props.size, this.theme);
      case 'columns':
        return AgentDashboardStyles.getPanelStyle(this.props.variant, this.props.size, this.theme);
      case 'tabs':
        return AgentDashboardStyles.getPanelStyle(this.props.variant, this.props.size, this.theme);
      case 'split':
        return AgentDashboardStyles.getPanelStyle(this.props.variant, this.props.size, this.theme);
      default:
        return AgentDashboardStyles.getGridStyle(this.props.variant, this.theme);
    }
  }

  private updateDisplay(): void {
    this.updateHeader();
    this.updateContent();
    this.updateStats();
    this.updateControls();
    this.updateRefreshIndicator();
  }

  private updateHeader(): void {
    if (!this.headerElement) return;

    const title = `Agent Dashboard - ${this.props.agents.length} agents`;
    this.headerElement.setContent(title);
  }

  private updateContent(): void {
    if (!this.contentElement) return;

    const content = this.renderContent();
    this.contentElement.setContent(content);
  }

  private renderContent(): string {
    const viewMode = this.props.viewMode || 'overview';
    const layout = this.props.layout || 'grid';
    
    switch (viewMode) {
      case 'overview':
        return this.renderOverview();
      case 'detailed':
        return this.renderDetailed();
      case 'monitoring':
        return this.renderMonitoring();
      case 'management':
        return this.renderManagement();
      default:
        return this.renderOverview();
    }
  }

  private renderOverview(): string {
    const stats = this.getStats();
    const layout = this.props.layout || 'grid';
    
    if (layout === 'grid') {
      return this.renderGridOverview();
    } else if (layout === 'tabs') {
      return this.renderTabOverview();
    } else {
      return this.renderPanelOverview();
    }
  }

  private renderGridOverview(): string {
    const stats = this.getStats();
    const agents = this.props.agents.slice(0, this.props.maxAgents || 6);
    
    const grid = [
      '┌─ System Status ──────────────────────────────────────────────────────────┐',
      `│ Total Agents: ${stats.totalAgents.toString().padEnd(8)} │ Active: ${stats.activeAgents.toString().padEnd(8)} │ Idle: ${stats.idleAgents.toString().padEnd(8)} │ Errors: ${stats.errorAgents.toString().padEnd(8)} │`,
      '├─────────────────────────────────────────────────────────────────────────┤',
      `│ System Load: ${stats.systemLoad.toFixed(1).padEnd(8)} │ Memory: ${stats.memoryUsage.toFixed(1).padEnd(8)} │ CPU: ${stats.cpuUsage.toFixed(1).padEnd(8)} │ Uptime: ${stats.uptime.toFixed(0).padEnd(8)} │`,
      '└─────────────────────────────────────────────────────────────────────────┘',
      '',
      '┌─ Agent Status ───────────────────────────────────────────────────────────┐',
      ...agents.map(agent => {
        const status = agent.status;
        const statusIcon = this.getStatusIcon(status);
        const name = agent.config.name.padEnd(20);
        const type = agent.config.type.padEnd(10);
        const runs = agent.metrics?.totalRuns || 0;
        const success = agent.metrics?.successfulRuns || 0;
        const failed = agent.metrics?.failedRuns || 0;
        
        return `│ ${statusIcon} ${name} │ ${type} │ Runs: ${runs.toString().padEnd(4)} │ Success: ${success.toString().padEnd(4)} │ Failed: ${failed.toString().padEnd(4)} │`;
      }),
      '└─────────────────────────────────────────────────────────────────────────┘'
    ];
    
    return grid.join('\n');
  }

  private renderTabOverview(): string {
    const tabs = ['Overview', 'Agents', 'Metrics', 'Logs', 'Alerts'];
    const activeTab = 0; // This would be managed by state
    
    const tabBar = tabs.map((tab, index) => 
      index === activeTab ? `[${tab}]` : ` ${tab} `
    ).join(' | ');
    
    const content = this.renderGridOverview();
    
    return [tabBar, '', content].join('\n');
  }

  private renderPanelOverview(): string {
    const stats = this.getStats();
    
    return [
      '┌─ Dashboard Overview ─────────────────────────────────────────────────────┐',
      `│ Agents: ${stats.totalAgents} total, ${stats.activeAgents} active, ${stats.idleAgents} idle, ${stats.errorAgents} errors`,
      `│ Tasks: ${stats.totalTasks} total, ${stats.completedTasks} completed, ${stats.failedTasks} failed`,
      `│ System: Load ${stats.systemLoad.toFixed(1)}%, Memory ${stats.memoryUsage.toFixed(1)}MB, CPU ${stats.cpuUsage.toFixed(1)}%`,
      `│ Uptime: ${stats.uptime.toFixed(0)}s`,
      '└─────────────────────────────────────────────────────────────────────────┘',
      '',
      '┌─ Recent Activity ────────────────────────────────────────────────────────┐',
      ...this.props.agents.slice(0, 5).map(agent => {
        const status = agent.status;
        const statusIcon = this.getStatusIcon(status);
        const name = agent.config.name;
        const lastRun = agent.metrics?.lastRunTime ? 
          new Date(agent.metrics.lastRunTime).toLocaleTimeString() : 'Never';
        
        return `│ ${statusIcon} ${name.padEnd(25)} │ Last run: ${lastRun.padEnd(15)} │`;
      }),
      '└─────────────────────────────────────────────────────────────────────────┘'
    ].join('\n');
  }

  private renderDetailed(): string {
    const selectedAgent = this.props.agents.find(a => a.config.id === this.selectedAgentId);
    
    if (!selectedAgent) {
      return 'No agent selected. Use the agent list to select an agent.';
    }
    
    const agent = selectedAgent;
    const metrics = agent.metrics;
    
    return [
      '┌─ Agent Details ──────────────────────────────────────────────────────────┐',
      `│ Name: ${agent.config.name}`,
      `│ Type: ${agent.config.type}`,
      `│ Status: ${agent.status}`,
      `│ Description: ${agent.config.description || 'No description'}`,
      `│ Version: ${agent.config.version || 'Unknown'}`,
      `│ Author: ${agent.config.author || 'Unknown'}`,
      '├─────────────────────────────────────────────────────────────────────────┤',
      '│ Metrics:',
      `│   Total Runs: ${metrics?.totalRuns || 0}`,
      `│   Successful: ${metrics?.successfulRuns || 0}`,
      `│   Failed: ${metrics?.failedRuns || 0}`,
      `│   Average Time: ${metrics?.averageExecutionTime || 0}ms`,
      `│   Memory Usage: ${metrics?.memoryUsage || 0}MB`,
      `│   CPU Usage: ${metrics?.cpuUsage || 0}%`,
      `│   Error Rate: ${metrics?.errorRate || 0}%`,
      `│   Uptime: ${metrics?.uptime || 0}s`,
      '├─────────────────────────────────────────────────────────────────────────┤',
      '│ Capabilities:',
      ...agent.config.capabilities.map(cap => `│   - ${cap}`),
      '└─────────────────────────────────────────────────────────────────────────┘'
    ].join('\n');
  }

  private renderMonitoring(): string {
    const stats = this.getStats();
    const alerts = this.alerts.slice(0, 5);
    const notifications = this.notifications.slice(0, 5);
    
    return [
      '┌─ System Monitoring ──────────────────────────────────────────────────────┐',
      `│ System Load: ${stats.systemLoad.toFixed(1)}%`,
      `│ Memory Usage: ${stats.memoryUsage.toFixed(1)}MB`,
      `│ CPU Usage: ${stats.cpuUsage.toFixed(1)}%`,
      `│ Uptime: ${stats.uptime.toFixed(0)}s`,
      '├─────────────────────────────────────────────────────────────────────────┤',
      '│ Active Alerts:',
      ...alerts.map(alert => {
        const icon = this.getAlertIcon(alert.type);
        const time = alert.timestamp.toLocaleTimeString();
        return `│ ${icon} ${alert.title.padEnd(30)} │ ${time.padEnd(15)} │`;
      }),
      '├─────────────────────────────────────────────────────────────────────────┤',
      '│ Recent Notifications:',
      ...notifications.map(notification => {
        const icon = this.getNotificationIcon(notification.type);
        const time = notification.timestamp.toLocaleTimeString();
        const read = notification.read ? '✓' : '○';
        return `│ ${icon} ${read} ${notification.title.padEnd(25)} │ ${time.padEnd(15)} │`;
      }),
      '└─────────────────────────────────────────────────────────────────────────┘'
    ].join('\n');
  }

  private renderManagement(): string {
    const stats = this.getStats();
    
    return [
      '┌─ Agent Management ───────────────────────────────────────────────────────┐',
      `│ Total Agents: ${stats.totalAgents}`,
      `│ Active Agents: ${stats.activeAgents}`,
      `│ Idle Agents: ${stats.idleAgents}`,
      `│ Error Agents: ${stats.errorAgents}`,
      '├─────────────────────────────────────────────────────────────────────────┤',
      '│ Agent Controls:',
      '│   [S] Start Agent    [T] Stop Agent    [P] Pause Agent    [R] Resume Agent',
      '│   [C] Configure      [L] View Logs     [M] View Metrics   [D] Delete Agent',
      '├─────────────────────────────────────────────────────────────────────────┤',
      '│ System Controls:',
      '│   [R] Refresh        [E] Export        [I] Import         [Q] Quit',
      '└─────────────────────────────────────────────────────────────────────────┘'
    ].join('\n');
  }

  private getStatusIcon(status: string): string {
    const icons = {
      idle: '○',
      running: '●',
      paused: '◐',
      error: '✗',
      completed: '✓',
      stopped: '■',
    };
    return icons[status as keyof typeof icons] || '○';
  }

  private getAlertIcon(type: string): string {
    const icons = {
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌',
      success: '✅',
    };
    return icons[type as keyof typeof icons] || 'ℹ️';
  }

  private getNotificationIcon(type: string): string {
    const icons = {
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌',
      success: '✅',
    };
    return icons[type as keyof typeof icons] || 'ℹ️';
  }

  private updateStats(): void {
    if (!this.statsElement) return;

    const stats = this.getStats();
    const statsText = `Agents: ${stats.totalAgents} | Active: ${stats.activeAgents} | Tasks: ${stats.totalTasks} | Load: ${stats.systemLoad.toFixed(1)}% | Memory: ${stats.memoryUsage.toFixed(1)}MB`;
    this.statsElement.setContent(statsText);
  }

  private updateControls(): void {
    if (!this.controlElement) return;

    const controls = [
      `Layout: ${this.props.layout}`,
      `View: ${this.props.viewMode}`,
      `Refresh: ${this.props.refreshMode}`,
      `Selected: ${this.selectedAgentId || 'none'}`
    ].join(' | ');

    this.controlElement.setContent(controls);
  }

  private updateRefreshIndicator(): void {
    if (!this.refreshIndicator) return;

    const refreshMode = this.props.refreshMode || 'manual';
    const indicator = refreshMode === 'manual' ? '●' : refreshMode === 'auto' ? '◐' : '●';
    const text = `Refresh: ${indicator} ${refreshMode}`;
    
    this.refreshIndicator.setContent(text);
  }

  private getStats(): AgentDashboardStats {
    const totalAgents = this.props.agents.length;
    const activeAgents = this.props.agents.filter(a => a.status === 'running').length;
    const idleAgents = this.props.agents.filter(a => a.status === 'idle').length;
    const errorAgents = this.props.agents.filter(a => a.status === 'error').length;
    
    const totalTasks = this.props.agents.reduce((sum, agent) => 
      sum + (agent.metrics?.totalRuns || 0), 0);
    const completedTasks = this.props.agents.reduce((sum, agent) => 
      sum + (agent.metrics?.successfulRuns || 0), 0);
    const failedTasks = this.props.agents.reduce((sum, agent) => 
      sum + (agent.metrics?.failedRuns || 0), 0);
    
    const systemLoad = this.props.agents.reduce((sum, agent) => 
      sum + (agent.metrics?.cpuUsage || 0), 0) / totalAgents;
    const memoryUsage = this.props.agents.reduce((sum, agent) => 
      sum + (agent.metrics?.memoryUsage || 0), 0);
    const cpuUsage = this.props.agents.reduce((sum, agent) => 
      sum + (agent.metrics?.cpuUsage || 0), 0);
    const uptime = this.props.agents.reduce((sum, agent) => 
      sum + (agent.metrics?.uptime || 0), 0);

    return {
      totalAgents,
      activeAgents,
      idleAgents,
      errorAgents,
      totalTasks,
      completedTasks,
      failedTasks,
      systemLoad,
      memoryUsage,
      cpuUsage,
      uptime,
    };
  }

  private setupEventListeners(): void {
    if (this.props.keys) {
      this.el.key(['l', 'L'], () => this.cycleLayout());
      this.el.key(['v', 'V'], () => this.cycleViewMode());
      this.el.key(['r', 'R'], () => this.cycleRefreshMode());
      this.el.key(['s', 'S'], () => this.startSelectedAgent());
      this.el.key(['t', 'T'], () => this.stopSelectedAgent());
      this.el.key(['p', 'P'], () => this.pauseSelectedAgent());
      this.el.key(['u', 'U'], () => this.resumeSelectedAgent());
      this.el.key(['c', 'C'], () => this.configureSelectedAgent());
      this.el.key(['f', 'F'], () => this.refresh());
    }

    if (this.props.mouse) {
      this.el.on('click', () => this.el.focus());
    }
  }

  private startRefreshTimer(): void {
    const refreshMode = this.props.refreshMode || 'manual';
    const interval = this.props.refreshInterval || 5000;
    
    if (refreshMode === 'auto' || refreshMode === 'realtime') {
      this.refreshTimer = setInterval(() => {
        this.refresh();
      }, interval);
    }
  }

  private emitEvent(type: string, data: any): void {
    const event: AgentDashboardEvent = {
      type: type as any,
      data,
      timestamp: new Date()
    };

    const listeners = this.eventListeners.get(type) || [];
    listeners.forEach(listener => listener(event));
  }

  // Control methods
  private cycleLayout(): void {
    const layouts: AgentDashboardLayout[] = ['grid', 'rows', 'columns', 'tabs', 'split'];
    const currentIndex = layouts.indexOf(this.props.layout || 'grid');
    const nextIndex = (currentIndex + 1) % layouts.length;
    this.props.layout = layouts[nextIndex];
    
    this.emitEvent('layout_change', this.props.layout);
    this.props.onLayoutChange?.(this.props.layout);
    this.updateDisplay();
  }

  private cycleViewMode(): void {
    const viewModes: AgentDashboardViewMode[] = ['overview', 'detailed', 'monitoring', 'management'];
    const currentIndex = viewModes.indexOf(this.props.viewMode || 'overview');
    const nextIndex = (currentIndex + 1) % viewModes.length;
    this.props.viewMode = viewModes[nextIndex];
    
    this.emitEvent('view_mode_change', this.props.viewMode);
    this.props.onViewModeChange?.(this.props.viewMode);
    this.updateDisplay();
  }

  private cycleRefreshMode(): void {
    const refreshModes: AgentDashboardRefreshMode[] = ['manual', 'auto', 'realtime'];
    const currentIndex = refreshModes.indexOf(this.props.refreshMode || 'manual');
    const nextIndex = (currentIndex + 1) % refreshModes.length;
    this.props.refreshMode = refreshModes[nextIndex];
    
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
    this.startRefreshTimer();
    this.updateDisplay();
  }

  private startSelectedAgent(): void {
    if (this.selectedAgentId) {
      this.emitEvent('agent_start', this.selectedAgentId);
      this.props.onAgentStart?.(this.selectedAgentId);
    }
  }

  private stopSelectedAgent(): void {
    if (this.selectedAgentId) {
      this.emitEvent('agent_stop', this.selectedAgentId);
      this.props.onAgentStop?.(this.selectedAgentId);
    }
  }

  private pauseSelectedAgent(): void {
    if (this.selectedAgentId) {
      this.emitEvent('agent_pause', this.selectedAgentId);
      this.props.onAgentPause?.(this.selectedAgentId);
    }
  }

  private resumeSelectedAgent(): void {
    if (this.selectedAgentId) {
      this.emitEvent('agent_resume', this.selectedAgentId);
      this.props.onAgentResume?.(this.selectedAgentId);
    }
  }

  private configureSelectedAgent(): void {
    if (this.selectedAgentId) {
      this.emitEvent('agent_configure', this.selectedAgentId);
      this.props.onAgentConfigure?.(this.selectedAgentId);
    }
  }

  private refresh(): void {
    this.emitEvent('refresh', { timestamp: new Date() });
    this.props.onRefresh?.();
    this.updateDisplay();
  }

  // Public methods
  setVariant(variant: AgentDashboardVariants): void {
    this.props.variant = variant;
    this.updateDisplay();
  }

  setSize(size: AgentDashboardSizes): void {
    this.props.size = size;
    this.updateDisplay();
  }

  setState(state: AgentDashboardStates): void {
    this.props.state = state;
    this.updateDisplay();
  }

  getConfig(): any {
    return {
      variant: this.props.variant,
      size: this.props.size,
      state: this.props.state,
      layout: this.props.layout,
      viewMode: this.props.viewMode,
      refreshMode: this.props.refreshMode,
      selectedAgentId: this.selectedAgentId,
      stats: this.getStats(),
    };
  }

  update(props: Partial<AgentDashboardProps>): void {
    Object.assign(this.props, props);
    if (props.selectedAgentId !== undefined) {
      this.selectedAgentId = props.selectedAgentId;
    }
    this.updateDisplay();
  }

  // Event handling
  on(event: string, listener: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(listener);
  }

  off(event: string, listener: Function): void {
    const listeners = this.eventListeners.get(event) || [];
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }

  // Agent management
  selectAgent(agentId: string): void {
    this.selectedAgentId = agentId;
    this.emitEvent('agent_select', agentId);
    this.props.onAgentSelect?.(agentId);
    this.updateDisplay();
  }

  getSelectedAgent(): any {
    return this.props.agents.find(a => a.config.id === this.selectedAgentId);
  }

  // Alert management
  addAlert(alert: AgentDashboardAlert): void {
    this.alerts.push(alert);
    this.emitEvent('alert', alert);
    this.updateDisplay();
  }

  removeAlert(alertId: string): void {
    this.alerts = this.alerts.filter(alert => alert.id !== alertId);
    this.updateDisplay();
  }

  acknowledgeAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      this.updateDisplay();
    }
  }

  // Notification management
  addNotification(notification: AgentDashboardNotification): void {
    this.notifications.push(notification);
    this.emitEvent('notification', notification);
    this.updateDisplay();
  }

  removeNotification(notificationId: string): void {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.updateDisplay();
  }

  markNotificationRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.updateDisplay();
    }
  }

  // Export functionality
  exportDashboard(format: 'json' | 'yaml' | 'html' | 'pdf'): AgentDashboardExport {
    const exportData: AgentDashboardExport = {
      format,
      data: {
        agents: this.props.agents,
        stats: this.getStats(),
        alerts: this.alerts,
        notifications: this.notifications,
        layout: {
          layout: this.props.layout || 'grid',
          panels: []
        }
      },
      timestamp: new Date(),
    };

    return exportData;
  }

  // Cleanup
  cleanup(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
    this.eventListeners.clear();
    this.destroy();
  }
}