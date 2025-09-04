import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../../../core/src/components/BaseComponent';
import { AgentConfigProps, AgentConfigVariants, AgentConfigSizes, AgentConfigStates, AgentConfigDisplayMode, AgentConfigEditMode, AgentConfigValidationLevel, AgentConfigEvent, AgentConfigValidationError, AgentConfigField, AgentConfigSection, AgentConfigHistory, AgentConfigChange, AgentConfigDiff, AgentConfigExport, AgentConfigImport, AgentConfigStats } from './AgentConfig.types';
import { AgentConfigStyles } from './AgentConfig.styles';
import { validateComponent, ValidationResult } from '../../../../core/src/validation/component-validator';

export class AgentConfig implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: AgentConfigProps;
  private validationResult: ValidationResult;
  private headerElement?: Widgets.BoxElement;
  private contentElement?: Widgets.BoxElement;
  private validationElement?: Widgets.BoxElement;
  private helpElement?: Widgets.BoxElement;
  private statsElement?: Widgets.BoxElement;
  private controlElement?: Widgets.BoxElement;
  private currentConfig: any;
  private originalConfig: any;
  private validationErrors: AgentConfigValidationError[] = [];
  private configHistory: AgentConfigHistory[] = [];
  private saveTimer?: NodeJS.Timeout;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(props: AgentConfigProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('AgentConfig', props);
    
    if (!this.validationResult.success) {
      console.error('❌ AgentConfig validation failed:', this.validationResult.errors);
      throw new Error(`AgentConfig validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ AgentConfig warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    this.currentConfig = { ...this.props.config };
    this.originalConfig = { ...this.props.config };
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: AgentConfigStyles.getContainerStyle(
        this.props.variant,
        this.props.size,
        this.props.state,
        this.props.displayMode || 'form',
        this.props.theme
      ),
    });

    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;

    this.initializeComponents();
    this.setupEventListeners();
    this.startSaveTimer();
    this.validateConfig();
    this.updateDisplay();
  }

  private initializeComponents(): void {
    this.createHeader();
    this.createContent();
    
    if (this.props.showValidation) {
      this.createValidation();
    }
    
    if (this.props.showHelp) {
      this.createHelp();
    }
    
    this.createStats();
    this.createControls();
  }

  private createHeader(): void {
    this.headerElement = this.el.children[0] as Widgets.BoxElement || this.el;
    
    const headerStyle = AgentConfigStyles.getHeaderStyle(
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

  private createValidation(): void {
    this.validationElement = this.el.children[2] as Widgets.BoxElement;
    if (!this.validationElement) {
      this.validationElement = this.el;
    }

    const validationStyle = AgentConfigStyles.getValidationStyle(this.props.variant, 'info', this.theme);
    this.validationElement.style = validationStyle;
  }

  private createHelp(): void {
    this.helpElement = this.el.children[3] as Widgets.BoxElement;
    if (!this.helpElement) {
      this.helpElement = this.el;
    }

    const helpStyle = AgentConfigStyles.getHelpStyle(this.props.variant, this.theme);
    this.helpElement.style = helpStyle;
  }

  private createStats(): void {
    this.statsElement = this.el.children[4] as Widgets.BoxElement;
    if (!this.statsElement) {
      this.statsElement = this.el;
    }

    const statsStyle = AgentConfigStyles.getStatsStyle(this.props.variant, this.theme);
    this.statsElement.style = statsStyle;
  }

  private createControls(): void {
    this.controlElement = this.el.children[5] as Widgets.BoxElement;
    if (!this.controlElement) {
      this.controlElement = this.el;
    }

    const controlStyle = AgentConfigStyles.getControlStyle(this.props.variant, this.props.state, this.theme);
    this.controlElement.style = controlStyle;
  }

  private getContentStyle(): any {
    const displayMode = this.props.displayMode || 'form';
    
    switch (displayMode) {
      case 'form':
        return AgentConfigStyles.getFormStyle(this.props.variant, this.theme);
      case 'json':
        return AgentConfigStyles.getJsonStyle(this.props.variant, this.theme);
      case 'yaml':
        return AgentConfigStyles.getYamlStyle(this.props.variant, this.theme);
      case 'table':
        return AgentConfigStyles.getTableStyle(this.props.variant, this.theme);
      case 'tree':
        return AgentConfigStyles.getTreeStyle(this.props.variant, this.theme);
      default:
        return AgentConfigStyles.getFormStyle(this.props.variant, this.theme);
    }
  }

  private updateDisplay(): void {
    this.updateHeader();
    this.updateContent();
    this.updateValidation();
    this.updateHelp();
    this.updateStats();
    this.updateControls();
  }

  private updateHeader(): void {
    if (!this.headerElement) return;

    const title = `Configuration${this.currentConfig.name ? ` - ${this.currentConfig.name}` : ''}`;
    this.headerElement.setContent(title);
  }

  private updateContent(): void {
    if (!this.contentElement) return;

    const content = this.renderContent();
    this.contentElement.setContent(content);
  }

  private renderContent(): string {
    const displayMode = this.props.displayMode || 'form';
    
    switch (displayMode) {
      case 'form':
        return this.renderFormView();
      case 'json':
        return this.renderJsonView();
      case 'yaml':
        return this.renderYamlView();
      case 'table':
        return this.renderTableView();
      case 'tree':
        return this.renderTreeView();
      default:
        return this.renderFormView();
    }
  }

  private renderFormView(): string {
    const sections = this.getConfigSections();
    return sections.map(section => this.renderSection(section)).join('\n\n');
  }

  private renderSection(section: AgentConfigSection): string {
    const header = `┌─ ${section.title} ${'─'.repeat(Math.max(0, 30 - section.title.length))}┐`;
    const fields = section.fields.map(field => this.renderField(field)).join('\n');
    const footer = `└${'─'.repeat(32)}┘`;
    
    return [header, fields, footer].join('\n');
  }

  private renderField(field: AgentConfigField): string {
    const required = field.required ? '*' : ' ';
    const label = `${required} ${field.label}:`;
    const value = this.formatFieldValue(field);
    const error = this.getFieldError(field.key);
    const errorText = error ? ` (${error.message})` : '';
    
    return `│ ${label.padEnd(20)} │ ${value}${errorText}`;
  }

  private formatFieldValue(field: AgentConfigField): string {
    const value = this.currentConfig[field.key];
    
    switch (field.type) {
      case 'string':
        return `"${value || ''}"`;
      case 'number':
        return value?.toString() || '0';
      case 'boolean':
        return value ? 'true' : 'false';
      case 'array':
        return Array.isArray(value) ? `[${value.length} items]` : '[]';
      case 'object':
        return typeof value === 'object' ? '{...}' : '{}';
      case 'select':
        return value || '';
      case 'textarea':
        return value ? `"${value.substring(0, 20)}..."` : '""';
      default:
        return value?.toString() || '';
    }
  }

  private renderJsonView(): string {
    try {
      return JSON.stringify(this.currentConfig, null, 2);
    } catch (error) {
      return `Error formatting JSON: ${error}`;
    }
  }

  private renderYamlView(): string {
    return this.jsonToYaml(this.currentConfig);
  }

  private jsonToYaml(obj: any, indent: number = 0): string {
    const spaces = '  '.repeat(indent);
    
    if (typeof obj === 'string') {
      return `${spaces}"${obj}"`;
    } else if (typeof obj === 'number' || typeof obj === 'boolean') {
      return `${spaces}${obj}`;
    } else if (Array.isArray(obj)) {
      if (obj.length === 0) return `${spaces}[]`;
      return obj.map(item => `${spaces}- ${this.jsonToYaml(item, indent + 1)}`).join('\n');
    } else if (typeof obj === 'object' && obj !== null) {
      const entries = Object.entries(obj);
      if (entries.length === 0) return `${spaces}{}`;
      return entries.map(([key, value]) => 
        `${spaces}${key}: ${this.jsonToYaml(value, indent + 1)}`
      ).join('\n');
    }
    
    return `${spaces}null`;
  }

  private renderTableView(): string {
    const fields = this.getConfigFields();
    const headers = ['Field', 'Type', 'Value', 'Required'];
    const headerRow = `┌${headers.map(h => '─'.repeat(15)).join('┬')}┐\n│${headers.map(h => h.padEnd(15)).join('│')}│\n├${headers.map(h => '─'.repeat(15)).join('┼')}┤`;
    
    const rows = fields.map(field => {
      const cells = [
        field.key,
        field.type,
        this.formatFieldValue(field),
        field.required ? 'Yes' : 'No'
      ];
      return `│${cells.map(c => c.padEnd(15)).join('│')}│`;
    });

    const footer = `└${headers.map(h => '─'.repeat(15)).join('┴')}┘`;
    
    return [headerRow, ...rows, footer].join('\n');
  }

  private renderTreeView(): string {
    return this.renderObjectTree(this.currentConfig, '', 0);
  }

  private renderObjectTree(obj: any, key: string, depth: number): string {
    const indent = '  '.repeat(depth);
    const prefix = depth === 0 ? '' : '├─ ';
    
    if (typeof obj === 'string') {
      return `${indent}${prefix}${key}: "${obj}"`;
    } else if (typeof obj === 'number' || typeof obj === 'boolean') {
      return `${indent}${prefix}${key}: ${obj}`;
    } else if (Array.isArray(obj)) {
      const header = `${indent}${prefix}${key}: [${obj.length} items]`;
      const items = obj.map((item, index) => 
        this.renderObjectTree(item, `[${index}]`, depth + 1)
      );
      return [header, ...items].join('\n');
    } else if (typeof obj === 'object' && obj !== null) {
      const header = `${indent}${prefix}${key}: {${Object.keys(obj).length} properties}`;
      const properties = Object.entries(obj).map(([k, v]) => 
        this.renderObjectTree(v, k, depth + 1)
      );
      return [header, ...properties].join('\n');
    }
    
    return `${indent}${prefix}${key}: null`;
  }

  private updateValidation(): void {
    if (!this.validationElement || !this.props.showValidation) return;

    const errorCount = this.validationErrors.filter(e => e.level === 'error').length;
    const warningCount = this.validationErrors.filter(e => e.level === 'warning').length;
    
    const validationText = `Validation: ${errorCount} errors, ${warningCount} warnings`;
    this.validationElement.setContent(validationText);
  }

  private updateHelp(): void {
    if (!this.helpElement || !this.props.showHelp) return;

    const helpText = 'Help: Use arrow keys to navigate, Enter to edit, Esc to cancel, Ctrl+S to save';
    this.helpElement.setContent(helpText);
  }

  private updateStats(): void {
    if (!this.statsElement) return;

    const stats = this.getStats();
    const statsText = `Fields: ${stats.totalFields} | Required: ${stats.requiredFields} | Errors: ${stats.validationErrors} | History: ${stats.historyCount}`;
    this.statsElement.setContent(statsText);
  }

  private updateControls(): void {
    if (!this.controlElement) return;

    const controls = [
      `Mode: ${this.props.displayMode}`,
      `Edit: ${this.props.editMode}`,
      `Validation: ${this.props.validationLevel}`,
      `Auto-save: ${this.props.autoSave ? 'ON' : 'OFF'}`
    ].join(' | ');

    this.controlElement.setContent(controls);
  }

  private getConfigSections(): AgentConfigSection[] {
    return [
      {
        title: 'Basic Information',
        fields: [
          { key: 'id', label: 'ID', type: 'string', value: this.currentConfig.id, required: true },
          { key: 'name', label: 'Name', type: 'string', value: this.currentConfig.name, required: true },
          { key: 'type', label: 'Type', type: 'select', value: this.currentConfig.type, required: true, options: ['chat', 'code', 'data', 'web', 'file', 'custom'] },
          { key: 'description', label: 'Description', type: 'textarea', value: this.currentConfig.description },
          { key: 'version', label: 'Version', type: 'string', value: this.currentConfig.version },
          { key: 'author', label: 'Author', type: 'string', value: this.currentConfig.author },
        ]
      },
      {
        title: 'Configuration',
        fields: [
          { key: 'capabilities', label: 'Capabilities', type: 'array', value: this.currentConfig.capabilities },
          { key: 'settings', label: 'Settings', type: 'object', value: this.currentConfig.settings },
          { key: 'dependencies', label: 'Dependencies', type: 'array', value: this.currentConfig.dependencies },
          { key: 'timeout', label: 'Timeout', type: 'number', value: this.currentConfig.timeout, min: 0 },
          { key: 'retryCount', label: 'Retry Count', type: 'number', value: this.currentConfig.retryCount, min: 0 },
          { key: 'priority', label: 'Priority', type: 'select', value: this.currentConfig.priority, options: ['low', 'normal', 'high', 'critical'] },
        ]
      }
    ];
  }

  private getConfigFields(): AgentConfigField[] {
    const sections = this.getConfigSections();
    return sections.flatMap(section => section.fields);
  }

  private getFieldError(fieldKey: string): AgentConfigValidationError | undefined {
    return this.validationErrors.find(error => error.field === fieldKey);
  }

  private validateConfig(): void {
    this.validationErrors = [];
    const fields = this.getConfigFields();
    
    fields.forEach(field => {
      const value = this.currentConfig[field.key];
      
      // Required field validation
      if (field.required && (value === undefined || value === null || value === '')) {
        this.validationErrors.push({
          field: field.key,
          message: 'This field is required',
          level: 'error',
          value,
        });
      }
      
      // Type validation
      if (value !== undefined && value !== null) {
        switch (field.type) {
          case 'number':
            if (typeof value !== 'number' || isNaN(value)) {
              this.validationErrors.push({
                field: field.key,
                message: 'Must be a valid number',
                level: 'error',
                value,
              });
            } else if (field.min !== undefined && value < field.min) {
              this.validationErrors.push({
                field: field.key,
                message: `Must be at least ${field.min}`,
                level: 'error',
                value,
                expected: field.min,
              });
            } else if (field.max !== undefined && value > field.max) {
              this.validationErrors.push({
                field: field.key,
                message: `Must be at most ${field.max}`,
                level: 'error',
                value,
                expected: field.max,
              });
            }
            break;
          case 'boolean':
            if (typeof value !== 'boolean') {
              this.validationErrors.push({
                field: field.key,
                message: 'Must be true or false',
                level: 'error',
                value,
              });
            }
            break;
          case 'array':
            if (!Array.isArray(value)) {
              this.validationErrors.push({
                field: field.key,
                message: 'Must be an array',
                level: 'error',
                value,
              });
            }
            break;
          case 'object':
            if (typeof value !== 'object' || value === null || Array.isArray(value)) {
              this.validationErrors.push({
                field: field.key,
                message: 'Must be an object',
                level: 'error',
                value,
              });
            }
            break;
        }
      }
      
      // Custom validation
      if (field.validation) {
        const customErrors = field.validation(value);
        this.validationErrors.push(...customErrors);
      }
    });
    
    this.emitEvent('config_validate', { config: this.currentConfig, errors: this.validationErrors });
    this.props.onConfigValidate?.(this.currentConfig, this.validationErrors);
  }

  private getStats(): AgentConfigStats {
    const fields = this.getConfigFields();
    const totalFields = fields.length;
    const requiredFields = fields.filter(f => f.required).length;
    const optionalFields = totalFields - requiredFields;
    const validationErrors = this.validationErrors.filter(e => e.level === 'error').length;
    const validationWarnings = this.validationErrors.filter(e => e.level === 'warning').length;
    const lastModified = new Date();
    const lastValidated = new Date();
    const historyCount = this.configHistory.length;

    return {
      totalFields,
      requiredFields,
      optionalFields,
      validationErrors,
      validationWarnings,
      lastModified,
      lastValidated,
      historyCount,
    };
  }

  private setupEventListeners(): void {
    if (this.props.keys) {
      this.el.key(['d', 'D'], () => this.cycleDisplayMode());
      this.el.key(['e', 'E'], () => this.cycleEditMode());
      this.el.key(['v', 'V'], () => this.cycleValidationLevel());
      this.el.key(['s', 'S'], () => this.saveConfig());
      this.el.key(['r', 'R'], () => this.resetConfig());
      this.el.key(['x', 'X'], () => this.exportConfig());
      this.el.key(['i', 'I'], () => this.importConfig());
    }

    if (this.props.mouse) {
      this.el.on('click', () => this.el.focus());
    }
  }

  private startSaveTimer(): void {
    if (this.props.autoSave && this.props.saveInterval && this.props.saveInterval > 0) {
      this.saveTimer = setInterval(() => {
        this.saveConfig();
      }, this.props.saveInterval);
    }
  }

  private emitEvent(type: string, data: any): void {
    const event: AgentConfigEvent = {
      type: type as any,
      data,
      timestamp: new Date()
    };

    const listeners = this.eventListeners.get(type) || [];
    listeners.forEach(listener => listener(event));
  }

  // Control methods
  private cycleDisplayMode(): void {
    const displayModes: AgentConfigDisplayMode[] = ['form', 'json', 'yaml', 'table', 'tree'];
    const currentIndex = displayModes.indexOf(this.props.displayMode || 'form');
    const nextIndex = (currentIndex + 1) % displayModes.length;
    this.props.displayMode = displayModes[nextIndex];
    
    this.emitEvent('display_mode_change', this.props.displayMode);
    this.updateDisplay();
  }

  private cycleEditMode(): void {
    const editModes: AgentConfigEditMode[] = ['readonly', 'editable', 'validation', 'live'];
    const currentIndex = editModes.indexOf(this.props.editMode || 'readonly');
    const nextIndex = (currentIndex + 1) % editModes.length;
    this.props.editMode = editModes[nextIndex];
    
    this.emitEvent('edit_mode_change', this.props.editMode);
    this.updateDisplay();
  }

  private cycleValidationLevel(): void {
    const validationLevels: AgentConfigValidationLevel[] = ['none', 'basic', 'strict', 'custom'];
    const currentIndex = validationLevels.indexOf(this.props.validationLevel || 'basic');
    const nextIndex = (currentIndex + 1) % validationLevels.length;
    this.props.validationLevel = validationLevels[nextIndex];
    
    this.validateConfig();
    this.updateDisplay();
  }

  private saveConfig(): void {
    this.emitEvent('config_save', this.currentConfig);
    this.props.onConfigSave?.(this.currentConfig);
    this.updateDisplay();
  }

  private resetConfig(): void {
    this.currentConfig = { ...this.originalConfig };
    this.emitEvent('config_reset', this.currentConfig);
    this.props.onConfigReset?.(this.currentConfig);
    this.validateConfig();
    this.updateDisplay();
  }

  private exportConfig(): void {
    const exportData: AgentConfigExport = {
      format: 'json',
      config: this.currentConfig,
      timestamp: new Date(),
      version: this.currentConfig.version,
    };
    
    this.emitEvent('config_export', exportData);
    this.props.onConfigExport?.(this.currentConfig, 'json');
  }

  private importConfig(): void {
    // Implementation for importing config
    this.emitEvent('config_import', {});
    this.props.onConfigImport?.(this.currentConfig);
  }

  // Public methods
  setVariant(variant: AgentConfigVariants): void {
    this.props.variant = variant;
    this.updateDisplay();
  }

  setSize(size: AgentConfigSizes): void {
    this.props.size = size;
    this.updateDisplay();
  }

  setState(state: AgentConfigStates): void {
    this.props.state = state;
    this.updateDisplay();
  }

  getConfig(): any {
    return {
      variant: this.props.variant,
      size: this.props.size,
      state: this.props.state,
      displayMode: this.props.displayMode,
      editMode: this.props.editMode,
      validationLevel: this.props.validationLevel,
      config: this.currentConfig,
      stats: this.getStats(),
    };
  }

  update(props: Partial<AgentConfigProps>): void {
    Object.assign(this.props, props);
    if (props.config) {
      this.currentConfig = { ...props.config };
    }
    this.validateConfig();
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

  // Config management
  updateConfig(config: any): void {
    this.currentConfig = { ...config };
    this.emitEvent('config_change', this.currentConfig);
    this.props.onConfigChange?.(this.currentConfig);
    this.validateConfig();
    this.updateDisplay();
  }

  getCurrentConfig(): any {
    return { ...this.currentConfig };
  }

  getOriginalConfig(): any {
    return { ...this.originalConfig };
  }

  // Validation management
  getValidationErrors(): AgentConfigValidationError[] {
    return [...this.validationErrors];
  }

  clearValidationErrors(): void {
    this.validationErrors = [];
    this.updateDisplay();
  }

  // History management
  addToHistory(comment?: string): void {
    const historyEntry: AgentConfigHistory = {
      timestamp: new Date(),
      config: { ...this.currentConfig },
      changes: this.getConfigChanges(),
      comment,
    };
    
    this.configHistory.push(historyEntry);
  }

  private getConfigChanges(): AgentConfigChange[] {
    const changes: AgentConfigChange[] = [];
    const fields = this.getConfigFields();
    
    fields.forEach(field => {
      const oldValue = this.originalConfig[field.key];
      const newValue = this.currentConfig[field.key];
      
      if (oldValue !== newValue) {
        changes.push({
          field: field.key,
          oldValue,
          newValue,
          type: oldValue === undefined ? 'add' : newValue === undefined ? 'remove' : 'modify',
        });
      }
    });
    
    return changes;
  }

  // Cleanup
  cleanup(): void {
    if (this.saveTimer) {
      clearInterval(this.saveTimer);
    }
    this.eventListeners.clear();
    this.destroy();
  }
}