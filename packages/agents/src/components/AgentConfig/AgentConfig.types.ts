import { Widgets } from 'blessed';
import { BaseProps, ComponentVariant, ComponentSize, ComponentState } from '../../../../core/src/components/BaseComponent';
import { AgentConfig as AgentConfigType } from '../Agent/Agent.types';

export type AgentConfigDisplayMode = 'form' | 'json' | 'yaml' | 'table' | 'tree';
export type AgentConfigEditMode = 'readonly' | 'editable' | 'validation' | 'live';
export type AgentConfigValidationLevel = 'none' | 'basic' | 'strict' | 'custom';

export interface AgentConfigProps extends BaseProps {
  config: AgentConfigType;
  displayMode?: AgentConfigDisplayMode;
  editMode?: AgentConfigEditMode;
  validationLevel?: AgentConfigValidationLevel;
  showValidation?: boolean;
  showHelp?: boolean;
  showExamples?: boolean;
  showHistory?: boolean;
  showDiff?: boolean;
  autoSave?: boolean;
  saveInterval?: number;
  onConfigChange?: (config: AgentConfigType) => void;
  onConfigSave?: (config: AgentConfigType) => void;
  onConfigValidate?: (config: AgentConfigType, errors: AgentConfigValidationError[]) => void;
  onConfigReset?: (config: AgentConfigType) => void;
  onConfigExport?: (config: AgentConfigType, format: string) => void;
  onConfigImport?: (config: AgentConfigType) => void;
}

export type AgentConfigVariants = ComponentVariant;
export type AgentConfigSizes = ComponentSize;
export type AgentConfigStates = ComponentState;

export interface AgentConfigEvent {
  type: 'config_change' | 'config_save' | 'config_validate' | 'config_reset' | 'config_export' | 'config_import' | 'display_mode_change' | 'edit_mode_change';
  data: any;
  timestamp: Date;
}

export interface AgentConfigValidationError {
  field: string;
  message: string;
  level: 'error' | 'warning' | 'info';
  value?: any;
  expected?: any;
}

export interface AgentConfigField {
  key: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'select' | 'textarea';
  value: any;
  required?: boolean;
  description?: string;
  options?: string[];
  min?: number;
  max?: number;
  pattern?: string;
  validation?: (value: any) => AgentConfigValidationError[];
}

export interface AgentConfigSection {
  title: string;
  fields: AgentConfigField[];
  collapsible?: boolean;
  collapsed?: boolean;
}

export interface AgentConfigHistory {
  timestamp: Date;
  config: AgentConfigType;
  changes: AgentConfigChange[];
  user?: string;
  comment?: string;
}

export interface AgentConfigChange {
  field: string;
  oldValue: any;
  newValue: any;
  type: 'add' | 'remove' | 'modify';
}

export interface AgentConfigDiff {
  field: string;
  oldValue: any;
  newValue: any;
  type: 'added' | 'removed' | 'modified' | 'unchanged';
}

export interface AgentConfigExport {
  format: 'json' | 'yaml' | 'toml' | 'ini';
  config: AgentConfigType;
  timestamp: Date;
  version?: string;
}

export interface AgentConfigImport {
  format: 'json' | 'yaml' | 'toml' | 'ini';
  data: string;
  config?: AgentConfigType;
  errors?: AgentConfigValidationError[];
}

export interface AgentConfigStats {
  totalFields: number;
  requiredFields: number;
  optionalFields: number;
  validationErrors: number;
  validationWarnings: number;
  lastModified: Date;
  lastValidated: Date;
  historyCount: number;
}