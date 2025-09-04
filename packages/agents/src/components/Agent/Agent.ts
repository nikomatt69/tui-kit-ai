import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../../../core/src/components/BaseComponent';
import { AgentProps, AgentVariants, AgentSizes, AgentStates, AgentStatus, AgentEvent, AgentLog, AgentTask, AgentMetrics } from './Agent.types';
import { AgentStyles } from './Agent.styles';
import { validateComponent, ValidationResult } from '../../../../core/src/validation/component-validator';

export class Agent implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: AgentProps;
  private validationResult: ValidationResult;
  private headerElement?: Widgets.BoxElement;
  private contentElement?: Widgets.BoxElement;
  private statusElement?: Widgets.BoxElement;
  private metricsElement?: Widgets.BoxElement;
  private logsElement?: Widgets.BoxElement;
  private tasksElement?: Widgets.BoxElement;
  private controlButtons?: Widgets.BoxElement;
  private currentStatus: AgentStatus;
  private logs: AgentLog[] = [];
  private tasks: AgentTask[] = [];
  private metrics: AgentMetrics;
  private refreshTimer?: NodeJS.Timeout;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(props: AgentProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('Agent', props);
    
    if (!this.validationResult.success) {
      console.error('❌ Agent validation failed:', this.validationResult.errors);
      throw new Error(`Agent validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ Agent warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    this.currentStatus = this.props.status || 'idle';
    
    // Initialize metrics
    this.metrics = this.props.metrics || {
      totalRuns: 0,
      successfulRuns: 0,
      failedRuns: 0,
      averageExecutionTime: 0,
      memoryUsage: 0,
      cpuUsage: 0,
      errorRate: 0,
      uptime: 0,
    };

    // Initialize logs and tasks
    this.logs = this.props.logs || [];
    this.tasks = this.props.tasks || [];
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: AgentStyles.getContainerStyle(
        this.props.variant,
        this.props.size,
        this.props.state,
        this.currentStatus,
        this.props.theme
      ),
    });

    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;

    this.initializeComponents();
    this.setupEventListeners();
    this.startRefreshTimer();
  }

  private initializeComponents(): void {
    this.createHeader();
    this.createContent();
    this.createStatusIndicator();
    
    if (this.props.showMetrics) {
      this.createMetrics();
    }
    
    if (this.props.showLogs) {
      this.createLogs();
    }
    
    if (this.props.showTasks) {
      this.createTasks();
    }
    
    this.createControlButtons();
    this.updateDisplay();
  }

  private createHeader(): void {
    this.headerElement = this.el.children[0] as Widgets.BoxElement || this.el;
    
    const headerStyle = AgentStyles.getHeaderStyle(
      this.props.variant,
      this.props.size,
      this.theme
    );

    this.headerElement.style = headerStyle;
  }

  private createContent(): void {
    this.contentElement = this.el.children[1] as Widgets.BoxElement || this.el;
    
    const contentStyle = AgentStyles.getContentStyle(
      this.props.variant,
      this.props.size,
      this.theme
    );

    this.contentElement.style = contentStyle;
  }

  private createStatusIndicator(): void {
    if (!this.headerElement) return;

    this.statusElement = this.headerElement.children[0] as Widgets.BoxElement;
    if (!this.statusElement) {
      this.statusElement = this.headerElement;
    }

    const statusStyle = AgentStyles.getStatusStyle(this.currentStatus, this.theme);
    this.statusElement.style = statusStyle;
  }

  private createMetrics(): void {
    if (!this.contentElement) return;

    this.metricsElement = this.contentElement.children[0] as Widgets.BoxElement;
    if (!this.metricsElement) {
      this.metricsElement = this.contentElement;
    }

    const metricsStyle = AgentStyles.getMetricsStyle(this.props.variant, this.theme);
    this.metricsElement.style = metricsStyle;
  }

  private createLogs(): void {
    if (!this.contentElement) return;

    this.logsElement = this.contentElement.children[1] as Widgets.BoxElement;
    if (!this.logsElement) {
      this.logsElement = this.contentElement;
    }

    const logsStyle = AgentStyles.getLogsStyle(this.props.variant, this.theme);
    this.logsElement.style = logsStyle;
  }

  private createTasks(): void {
    if (!this.contentElement) return;

    this.tasksElement = this.contentElement.children[2] as Widgets.BoxElement;
    if (!this.tasksElement) {
      this.tasksElement = this.contentElement;
    }

    const tasksStyle = AgentStyles.getTasksStyle(this.props.variant, this.theme);
    this.tasksElement.style = tasksStyle;
  }

  private createControlButtons(): void {
    if (!this.headerElement) return;

    this.controlButtons = this.headerElement.children[1] as Widgets.BoxElement;
    if (!this.controlButtons) {
      this.controlButtons = this.headerElement;
    }

    const buttonStyle = AgentStyles.getButtonStyle(this.props.variant, this.props.state, this.theme);
    this.controlButtons.style = buttonStyle;
  }

  private updateDisplay(): void {
    this.updateHeader();
    this.updateStatus();
    this.updateMetrics();
    this.updateLogs();
    this.updateTasks();
    this.updateControlButtons();
  }

  private updateHeader(): void {
    if (!this.headerElement) return;

    const title = `${this.props.config.name} (${this.props.config.type})`;
    this.headerElement.setContent(title);
  }

  private updateStatus(): void {
    if (!this.statusElement) return;

    const statusText = `Status: ${this.currentStatus.toUpperCase()}`;
    this.statusElement.setContent(statusText);
  }

  private updateMetrics(): void {
    if (!this.metricsElement || !this.props.showMetrics) return;

    const metricsText = [
      `Runs: ${this.metrics.totalRuns} (${this.metrics.successfulRuns}✓ ${this.metrics.failedRuns}✗)`,
      `Avg Time: ${this.metrics.averageExecutionTime}ms`,
      `Memory: ${this.metrics.memoryUsage}MB`,
      `CPU: ${this.metrics.cpuUsage}%`,
      `Error Rate: ${this.metrics.errorRate}%`,
      `Uptime: ${this.metrics.uptime}s`
    ].join(' | ');

    this.metricsElement.setContent(metricsText);
  }

  private updateLogs(): void {
    if (!this.logsElement || !this.props.showLogs) return;

    const maxLogs = this.props.maxLogs || 10;
    const recentLogs = this.logs.slice(-maxLogs);
    
    const logsText = recentLogs.map(log => 
      `[${log.timestamp.toISOString()}] ${log.level.toUpperCase()}: ${log.message}`
    ).join('\n');

    this.logsElement.setContent(logsText);
    
    if (this.props.autoScroll) {
      this.logsElement.setScrollPerc(100);
    }
  }

  private updateTasks(): void {
    if (!this.tasksElement || !this.props.showTasks) return;

    const activeTasks = this.tasks.filter(task => 
      task.status === 'pending' || task.status === 'running'
    );
    
    const tasksText = activeTasks.map(task => 
      `[${task.id}] ${task.type}: ${task.status}`
    ).join('\n');

    this.tasksElement.setContent(tasksText || 'No active tasks');
  }

  private updateControlButtons(): void {
    if (!this.controlButtons) return;

    const buttons = [];
    
    if (this.currentStatus === 'idle' || this.currentStatus === 'stopped') {
      buttons.push('[START]');
    }
    
    if (this.currentStatus === 'running') {
      buttons.push('[STOP]', '[PAUSE]');
    }
    
    if (this.currentStatus === 'paused') {
      buttons.push('[RESUME]', '[STOP]');
    }

    this.controlButtons.setContent(buttons.join(' '));
  }

  private setupEventListeners(): void {
    if (this.props.keys) {
      this.el.key(['s', 'S'], () => this.start());
      this.el.key(['t', 'T'], () => this.stop());
      this.el.key(['p', 'P'], () => this.pause());
      this.el.key(['r', 'R'], () => this.resume());
    }

    if (this.props.mouse) {
      this.el.on('click', () => this.el.focus());
    }
  }

  private startRefreshTimer(): void {
    if (this.props.refreshInterval && this.props.refreshInterval > 0) {
      this.refreshTimer = setInterval(() => {
        this.updateDisplay();
      }, this.props.refreshInterval);
    }
  }

  private emitEvent(type: string, data: any): void {
    const event: AgentEvent = {
      type: type as any,
      data,
      timestamp: new Date()
    };

    const listeners = this.eventListeners.get(type) || [];
    listeners.forEach(listener => listener(event));
  }

  // Public methods
  setVariant(variant: AgentVariants): void {
    this.props.variant = variant;
    this.updateDisplay();
  }

  setSize(size: AgentSizes): void {
    this.props.size = size;
    this.updateDisplay();
  }

  setState(state: AgentStates): void {
    this.props.state = state;
    this.updateDisplay();
  }

  getConfig(): any {
    return {
      variant: this.props.variant,
      size: this.props.size,
      state: this.props.state,
      status: this.currentStatus,
      config: this.props.config,
      metrics: this.metrics,
      logs: this.logs,
      tasks: this.tasks,
    };
  }

  update(props: Partial<AgentProps>): void {
    Object.assign(this.props, props);
    this.updateDisplay();
  }

  // Agent control methods
  start(): void {
    if (this.currentStatus === 'idle' || this.currentStatus === 'stopped') {
      this.currentStatus = 'running';
      this.emitEvent('start', { agentId: this.props.config.id });
      this.props.onStart?.();
      this.updateDisplay();
    }
  }

  stop(): void {
    if (this.currentStatus === 'running' || this.currentStatus === 'paused') {
      this.currentStatus = 'stopped';
      this.emitEvent('stop', { agentId: this.props.config.id });
      this.props.onStop?.();
      this.updateDisplay();
    }
  }

  pause(): void {
    if (this.currentStatus === 'running') {
      this.currentStatus = 'paused';
      this.emitEvent('pause', { agentId: this.props.config.id });
      this.props.onPause?.();
      this.updateDisplay();
    }
  }

  resume(): void {
    if (this.currentStatus === 'paused') {
      this.currentStatus = 'running';
      this.emitEvent('resume', { agentId: this.props.config.id });
      this.props.onResume?.();
      this.updateDisplay();
    }
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

  // Log management
  addLog(log: Omit<AgentLog, 'id' | 'timestamp' | 'agentId'>): void {
    const newLog: AgentLog = {
      ...log,
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      agentId: this.props.config.id,
    };

    this.logs.push(newLog);
    
    // Keep only the last maxLogs entries
    if (this.props.maxLogs && this.logs.length > this.props.maxLogs) {
      this.logs = this.logs.slice(-this.props.maxLogs);
    }

    this.emitEvent('log_add', newLog);
    this.updateDisplay();
  }

  // Task management
  addTask(task: Omit<AgentTask, 'id' | 'createdAt' | 'agentId'>): void {
    const newTask: AgentTask = {
      ...task,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      agentId: this.props.config.id,
    };

    this.tasks.push(newTask);
    this.emitEvent('task_add', newTask);
    this.updateDisplay();
  }

  completeTask(taskId: string, result?: any): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = 'completed';
      task.completedAt = new Date();
      task.result = result;
      
      this.emitEvent('task_complete', task);
      this.props.onTaskComplete?.(task);
      this.updateDisplay();
    }
  }

  failTask(taskId: string, error: string): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = 'failed';
      task.completedAt = new Date();
      task.error = error;
      
      this.emitEvent('task_fail', task);
      this.updateDisplay();
    }
  }

  // Metrics management
  updateMetrics(metrics: Partial<AgentMetrics>): void {
    this.metrics = { ...this.metrics, ...metrics };
    this.emitEvent('metrics_update', this.metrics);
    this.updateDisplay();
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