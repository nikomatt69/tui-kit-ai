// Component registry with blessed-based TUI components
export const COMPONENTS = {
  // Layout Components
  box: {
    name: "Box",
    description: "Basic container component with styling options",
    path: "box.ts",
    dependencies: ["blessed"],
    template: generateBoxComponent,
  },
  stack: {
    name: "Stack",
    description: "Vertical or horizontal stack layout",
    path: "stack.ts", 
    dependencies: ["blessed"],
    template: generateStackComponent,
  },
  grid: {
    name: "Grid",
    description: "Grid layout system",
    path: "grid.ts",
    dependencies: ["blessed"],
    template: generateGridComponent,
  },
  flex: {
    name: "Flex",
    description: "Flexible layout container",
    path: "flex.ts",
    dependencies: ["blessed"],
    template: generateFlexComponent,
  },

  // Input Components
  button: {
    name: "Button",
    description: "Interactive button with various styles",
    path: "button.ts",
    dependencies: ["blessed"],
    template: generateButtonComponent,
  },
  input: {
    name: "Input",
    description: "Text input field",
    path: "input.ts",
    dependencies: ["blessed"],
    template: generateInputComponent,
  },
  textarea: {
    name: "Textarea",
    description: "Multi-line text input",
    path: "textarea.ts",
    dependencies: ["blessed"],
    template: generateTextareaComponent,
  },
  select: {
    name: "Select",
    description: "Dropdown selection component",
    path: "select.ts",
    dependencies: ["blessed"],
    template: generateSelectComponent,
  },
  checkbox: {
    name: "Checkbox",
    description: "Checkbox input component",
    path: "checkbox.ts",
    dependencies: ["blessed"],
    template: generateCheckboxComponent,
  },
  radio: {
    name: "Radio",
    description: "Radio button input component",
    path: "radio.ts",
    dependencies: ["blessed"],
    template: generateRadioComponent,
  },

  // Display Components
  text: {
    name: "Text",
    description: "Text display component with styling",
    path: "text.ts",
    dependencies: ["blessed"],
    template: generateTextComponent,
  },
  list: {
    name: "List",
    description: "Scrollable list component",
    path: "list.ts",
    dependencies: ["blessed"],
    template: generateListComponent,
  },
  table: {
    name: "Table",
    description: "Data table component",
    path: "table.ts",
    dependencies: ["blessed"],
    template: generateTableComponent,
  },
  progress: {
    name: "Progress",
    description: "Progress bar component",
    path: "progress.ts",
    dependencies: ["blessed"],
    template: generateProgressComponent,
  },
  loading: {
    name: "Loading",
    description: "Loading spinner component",
    path: "loading.ts",
    dependencies: ["blessed"],
    template: generateLoadingComponent,
  },

  // Navigation Components
  menu: {
    name: "Menu",
    description: "Navigation menu component",
    path: "menu.ts",
    dependencies: ["blessed"],
    template: generateMenuComponent,
  },
  tabs: {
    name: "Tabs",
    description: "Tab navigation component",
    path: "tabs.ts",
    dependencies: ["blessed"],
    template: generateTabsComponent,
  },
  breadcrumb: {
    name: "Breadcrumb",
    description: "Breadcrumb navigation component",
    path: "breadcrumb.ts",
    dependencies: ["blessed"],
    template: generateBreadcrumbComponent,
  },

  // Feedback Components
  alert: {
    name: "Alert",
    description: "Alert notification component",
    path: "alert.ts",
    dependencies: ["blessed"],
    template: generateAlertComponent,
  },
  modal: {
    name: "Modal",
    description: "Modal dialog component",
    path: "modal.ts",
    dependencies: ["blessed"],
    template: generateModalComponent,
  },
  tooltip: {
    name: "Tooltip",
    description: "Tooltip component",
    path: "tooltip.ts",
    dependencies: ["blessed"],
    template: generateTooltipComponent,
  },
  notification: {
    name: "Notification",
    description: "Notification toast component",
    path: "notification.ts",
    dependencies: ["blessed"],
    template: generateNotificationComponent,
  },

  // Data Components
  chart: {
    name: "Chart",
    description: "Simple chart component",
    path: "chart.ts",
    dependencies: ["blessed"],
    template: generateChartComponent,
  },
  tree: {
    name: "Tree",
    description: "Tree view component",
    path: "tree.ts",
    dependencies: ["blessed"],
    template: generateTreeComponent,
  },
  calendar: {
    name: "Calendar",
    description: "Calendar component",
    path: "calendar.ts",
    dependencies: ["blessed"],
    template: generateCalendarComponent,
  },
};

// Component template generators
function generateBoxComponent() {
  return `import { Box } from 'blessed';
import { ComponentProps } from '../types';

export interface BoxProps extends ComponentProps {
  children?: React.ReactNode;
  padding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  margin?: number | { top?: number; right?: number; bottom?: number; left?: number };
  border?: boolean | { type?: string; fg?: string; bg?: string };
  style?: {
    fg?: string;
    bg?: string;
    border?: { fg?: string; bg?: string };
    focus?: { fg?: string; bg?: string };
  };
}

export function BoxComponent(props: BoxProps) {
  const {
    children,
    padding = 0,
    margin = 0,
    border = false,
    style = {},
    ...rest
  } = props;

  const boxOptions = {
    padding,
    margin,
    border,
    style: {
      fg: 'white',
      bg: 'black',
      ...style,
    },
    ...rest,
  };

  return Box(boxOptions);
}

export default BoxComponent;
`;
}

function generateStackComponent() {
  return `import { Box } from 'blessed';
import { ComponentProps } from '../types';

export interface StackProps extends ComponentProps {
  children?: React.ReactNode;
  direction?: 'vertical' | 'horizontal';
  spacing?: number;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
}

export function StackComponent(props: StackProps) {
  const {
    children,
    direction = 'vertical',
    spacing = 1,
    align = 'start',
    justify = 'start',
    ...rest
  } = props;

  const stackOptions = {
    ...rest,
  };

  return Box(stackOptions);
}

export default StackComponent;
`;
}

function generateGridComponent() {
  return `import { Box } from 'blessed';
import { ComponentProps } from '../types';

export interface GridProps extends ComponentProps {
  children?: React.ReactNode;
  columns?: number;
  rows?: number;
  gap?: number;
}

export function GridComponent(props: GridProps) {
  const {
    children,
    columns = 1,
    rows = 1,
    gap = 1,
    ...rest
  } = props;

  const gridOptions = {
    ...rest,
  };

  return Box(gridOptions);
}

export default GridComponent;
`;
}

function generateFlexComponent() {
  return `import { Box } from 'blessed';
import { ComponentProps } from '../types';

export interface FlexProps extends ComponentProps {
  children?: React.ReactNode;
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
}

export function FlexComponent(props: FlexProps) {
  const {
    children,
    direction = 'row',
    wrap = 'nowrap',
    align = 'start',
    justify = 'start',
    ...rest
  } = props;

  const flexOptions = {
    ...rest,
  };

  return Box(flexOptions);
}

export default FlexComponent;
`;
}

function generateButtonComponent() {
  return `import { Button } from 'blessed';
import { ComponentProps } from '../types';

export interface ButtonProps extends ComponentProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
}

export function ButtonComponent(props: ButtonProps) {
  const {
    children = 'Button',
    variant = 'primary',
    size = 'md',
    disabled = false,
    onClick,
    ...rest
  } = props;

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return { fg: 'white', bg: 'blue' };
      case 'secondary':
        return { fg: 'white', bg: 'gray' };
      case 'danger':
        return { fg: 'white', bg: 'red' };
      case 'ghost':
        return { fg: 'blue', bg: 'black' };
      default:
        return { fg: 'white', bg: 'blue' };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { height: 1, padding: { left: 1, right: 1 } };
      case 'md':
        return { height: 3, padding: { left: 2, right: 2 } };
      case 'lg':
        return { height: 5, padding: { left: 3, right: 3 } };
      default:
        return { height: 3, padding: { left: 2, right: 2 } };
    }
  };

  const buttonOptions = {
    content: children,
    ...getSizeStyles(),
    style: {
      ...getVariantStyles(),
      focus: { fg: 'white', bg: 'lightblue' },
    },
    mouse: true,
    keys: true,
    ...rest,
  };

  const button = Button(buttonOptions);

  if (onClick) {
    button.on('press', onClick);
  }

  return button;
}

export default ButtonComponent;
`;
}

function generateInputComponent() {
  return `import { Textbox } from 'blessed';
import { ComponentProps } from '../types';

export interface InputProps extends ComponentProps {
  placeholder?: string;
  value?: string;
  type?: 'text' | 'password' | 'number';
  disabled?: boolean;
  onChange?: (value: string) => void;
  onEnter?: (value: string) => void;
}

export function InputComponent(props: InputProps) {
  const {
    placeholder = '',
    value = '',
    type = 'text',
    disabled = false,
    onChange,
    onEnter,
    ...rest
  } = props;

  const inputOptions = {
    content: value,
    placeholder,
    inputOnFocus: true,
    style: {
      fg: 'white',
      bg: 'black',
      focus: { fg: 'white', bg: 'blue' },
    },
    border: { type: 'line' },
    ...rest,
  };

  const input = Textbox(inputOptions);

  if (onChange) {
    input.on('input', () => {
      onChange(input.getValue());
    });
  }

  if (onEnter) {
    input.on('submit', () => {
      onEnter(input.getValue());
    });
  }

  return input;
}

export default InputComponent;
`;
}

function generateTextareaComponent() {
  return `import { Textarea } from 'blessed';
import { ComponentProps } from '../types';

export interface TextareaProps extends ComponentProps {
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

export function TextareaComponent(props: TextareaProps) {
  const {
    placeholder = '',
    value = '',
    disabled = false,
    onChange,
    ...rest
  } = props;

  const textareaOptions = {
    content: value,
    placeholder,
    inputOnFocus: true,
    style: {
      fg: 'white',
      bg: 'black',
      focus: { fg: 'white', bg: 'blue' },
    },
    border: { type: 'line' },
    ...rest,
  };

  const textarea = Textarea(textareaOptions);

  if (onChange) {
    textarea.on('input', () => {
      onChange(textarea.getValue());
    });
  }

  return textarea;
}

export default TextareaComponent;
`;
}

function generateSelectComponent() {
  return `import { List } from 'blessed';
import { ComponentProps } from '../types';

export interface SelectProps extends ComponentProps {
  options: string[];
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

export function SelectComponent(props: SelectProps) {
  const {
    options = [],
    value,
    placeholder = 'Select an option...',
    disabled = false,
    onChange,
    ...rest
  } = props;

  const selectOptions = {
    items: options,
    keys: true,
    vi: true,
    mouse: true,
    style: {
      fg: 'white',
      bg: 'black',
      focus: { fg: 'white', bg: 'blue' },
    },
    border: { type: 'line' },
    ...rest,
  };

  const select = List(selectOptions);

  if (onChange) {
    select.on('select', (item) => {
      onChange(item.content);
    });
  }

  return select;
}

export default SelectComponent;
`;
}

function generateCheckboxComponent() {
  return `import { Checkbox } from 'blessed';
import { ComponentProps } from '../types';

export interface CheckboxProps extends ComponentProps {
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

export function CheckboxComponent(props: CheckboxProps) {
  const {
    label = 'Checkbox',
    checked = false,
    disabled = false,
    onChange,
    ...rest
  } = props;

  const checkboxOptions = {
    content: \`[\${checked ? 'x' : ' '}] \${label}\`,
    checked,
    style: {
      fg: 'white',
      bg: 'black',
      focus: { fg: 'white', bg: 'blue' },
    },
    mouse: true,
    keys: true,
    ...rest,
  };

  const checkbox = Checkbox(checkboxOptions);

  if (onChange) {
    checkbox.on('check', () => {
      onChange(true);
    });
    checkbox.on('uncheck', () => {
      onChange(false);
    });
  }

  return checkbox;
}

export default CheckboxComponent;
`;
}

function generateRadioComponent() {
  return `import { RadioButton } from 'blessed';
import { ComponentProps } from '../types';

export interface RadioProps extends ComponentProps {
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

export function RadioComponent(props: RadioProps) {
  const {
    label = 'Radio',
    checked = false,
    disabled = false,
    onChange,
    ...rest
  } = props;

  const radioOptions = {
    content: \`(\${checked ? '*' : ' '}) \${label}\`,
    checked,
    style: {
      fg: 'white',
      bg: 'black',
      focus: { fg: 'white', bg: 'blue' },
    },
    mouse: true,
    keys: true,
    ...rest,
  };

  const radio = RadioButton(radioOptions);

  if (onChange) {
    radio.on('check', () => {
      onChange(true);
    });
    radio.on('uncheck', () => {
      onChange(false);
    });
  }

  return radio;
}

export default RadioComponent;
`;
}

function generateTextComponent() {
  return `import { Text } from 'blessed';
import { ComponentProps } from '../types';

export interface TextProps extends ComponentProps {
  children?: React.ReactNode;
  variant?: 'body' | 'heading' | 'caption' | 'code';
  align?: 'left' | 'center' | 'right';
  wrap?: boolean;
}

export function TextComponent(props: TextProps) {
  const {
    children = '',
    variant = 'body',
    align = 'left',
    wrap = true,
    ...rest
  } = props;

  const getVariantStyles = () => {
    switch (variant) {
      case 'heading':
        return { fg: 'white', bold: true };
      case 'caption':
        return { fg: 'gray' };
      case 'code':
        return { fg: 'green', bg: 'black' };
      default:
        return { fg: 'white' };
    }
  };

  const textOptions = {
    content: children,
    align,
    wrap,
    style: getVariantStyles(),
    ...rest,
  };

  return Text(textOptions);
}

export default TextComponent;
`;
}

function generateListComponent() {
  return `import { List } from 'blessed';
import { ComponentProps } from '../types';

export interface ListProps extends ComponentProps {
  items: string[];
  selected?: number;
  multiSelect?: boolean;
  onChange?: (selected: string | string[]) => void;
}

export function ListComponent(props: ListProps) {
  const {
    items = [],
    selected = 0,
    multiSelect = false,
    onChange,
    ...rest
  } = props;

  const listOptions = {
    items,
    selected,
    keys: true,
    vi: true,
    mouse: true,
    style: {
      fg: 'white',
      bg: 'black',
      focus: { fg: 'white', bg: 'blue' },
      selected: { fg: 'white', bg: 'lightblue' },
    },
    border: { type: 'line' },
    ...rest,
  };

  const list = List(listOptions);

  if (onChange) {
    list.on('select', (item) => {
      if (multiSelect) {
        // Handle multi-select logic
        onChange(list.selected);
      } else {
        onChange(item.content);
      }
    });
  }

  return list;
}

export default ListComponent;
`;
}

function generateTableComponent() {
  return `import { Table } from 'blessed';
import { ComponentProps } from '../types';

export interface TableProps extends ComponentProps {
  data: string[][];
  headers?: string[];
  sortable?: boolean;
  onSort?: (column: number, direction: 'asc' | 'desc') => void;
}

export function TableComponent(props: TableProps) {
  const {
    data = [],
    headers = [],
    sortable = false,
    onSort,
    ...rest
  } = props;

  const tableOptions = {
    data: headers.length > 0 ? [headers, ...data] : data,
    keys: true,
    vi: true,
    mouse: true,
    style: {
      fg: 'white',
      bg: 'black',
      focus: { fg: 'white', bg: 'blue' },
      header: { fg: 'white', bg: 'gray', bold: true },
    },
    border: { type: 'line' },
    ...rest,
  };

  const table = Table(tableOptions);

  if (sortable && onSort) {
    table.on('header', (column) => {
      // Handle sorting logic
      onSort(column, 'asc');
    });
  }

  return table;
}

export default TableComponent;
`;
}

function generateProgressComponent() {
  return `import { ProgressBar } from 'blessed';
import { ComponentProps } from '../types';

export interface ProgressProps extends ComponentProps {
  value?: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
}

export function ProgressComponent(props: ProgressProps) {
  const {
    value = 0,
    max = 100,
    label = '',
    showPercentage = true,
    ...rest
  } = props;

  const percentage = Math.round((value / max) * 100);
  const displayLabel = showPercentage 
    ? \`\${label} \${percentage}%\`.trim()
    : label;

  const progressOptions = {
    value,
    max,
    label: displayLabel,
    style: {
      fg: 'white',
      bg: 'black',
      bar: { fg: 'green', bg: 'black' },
    },
    border: { type: 'line' },
    ...rest,
  };

  return ProgressBar(progressOptions);
}

export default ProgressComponent;
`;
}

function generateLoadingComponent() {
  return `import { Box } from 'blessed';
import { ComponentProps } from '../types';

export interface LoadingProps extends ComponentProps {
  text?: string;
  spinner?: string[];
  speed?: number;
}

export function LoadingComponent(props: LoadingProps) {
  const {
    text = 'Loading...',
    spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
    speed = 100,
    ...rest
  } = props;

  const loadingOptions = {
    content: \`\${spinner[0]} \${text}\`,
    style: {
      fg: 'white',
      bg: 'black',
    },
    ...rest,
  };

  const loading = Box(loadingOptions);
  let spinnerIndex = 0;

  const interval = setInterval(() => {
    spinnerIndex = (spinnerIndex + 1) % spinner.length;
    loading.setContent(\`\${spinner[spinnerIndex]} \${text}\`);
  }, speed);

  // Clean up interval when component is destroyed
  loading.on('destroy', () => {
    clearInterval(interval);
  });

  return loading;
}

export default LoadingComponent;
`;
}

function generateMenuComponent() {
  return `import { List } from 'blessed';
import { ComponentProps } from '../types';

export interface MenuProps extends ComponentProps {
  items: Array<{ label: string; value: string; shortcut?: string }>;
  onSelect?: (item: { label: string; value: string; shortcut?: string }) => void;
}

export function MenuComponent(props: MenuProps) {
  const {
    items = [],
    onSelect,
    ...rest
  } = props;

  const menuItems = items.map(item => 
    \`\${item.label}\${item.shortcut ? \` (${item.shortcut})\` : ''}\`
  );

  const menuOptions = {
    items: menuItems,
    keys: true,
    vi: true,
    mouse: true,
    style: {
      fg: 'white',
      bg: 'black',
      focus: { fg: 'white', bg: 'blue' },
      selected: { fg: 'white', bg: 'lightblue' },
    },
    border: { type: 'line' },
    ...rest,
  };

  const menu = List(menuOptions);

  if (onSelect) {
    menu.on('select', (item, index) => {
      onSelect(items[index]);
    });
  }

  return menu;
}

export default MenuComponent;
`;
}

function generateTabsComponent() {
  return `import { Box, List } from 'blessed';
import { ComponentProps } from '../types';

export interface TabsProps extends ComponentProps {
  tabs: Array<{ label: string; content: string }>;
  activeTab?: number;
  onTabChange?: (index: number, tab: { label: string; content: string }) => void;
}

export function TabsComponent(props: TabsProps) {
  const {
    tabs = [],
    activeTab = 0,
    onTabChange,
    ...rest
  } = props;

  const tabLabels = tabs.map(tab => tab.label);

  const tabsOptions = {
    items: tabLabels,
    keys: true,
    vi: true,
    mouse: true,
    style: {
      fg: 'white',
      bg: 'black',
      focus: { fg: 'white', bg: 'blue' },
      selected: { fg: 'white', bg: 'lightblue' },
    },
    border: { type: 'line' },
    ...rest,
  };

  const tabsList = List(tabsOptions);
  const contentBox = Box({
    top: 3,
    content: tabs[activeTab]?.content || '',
    style: { fg: 'white', bg: 'black' },
    border: { type: 'line' },
  });

  if (onTabChange) {
    tabsList.on('select', (item, index) => {
      contentBox.setContent(tabs[index].content);
      onTabChange(index, tabs[index]);
    });
  }

  return Box({
    children: [tabsList, contentBox],
  });
}

export default TabsComponent;
`;
}

function generateBreadcrumbComponent() {
  return `import { Box } from 'blessed';
import { ComponentProps } from '../types';

export interface BreadcrumbProps extends ComponentProps {
  items: string[];
  separator?: string;
  onItemClick?: (index: number, item: string) => void;
}

export function BreadcrumbComponent(props: BreadcrumbProps) {
  const {
    items = [],
    separator = ' > ',
    onItemClick,
    ...rest
  } = props;

  const breadcrumbText = items.join(separator);

  const breadcrumbOptions = {
    content: breadcrumbText,
    style: {
      fg: 'white',
      bg: 'black',
    },
    ...rest,
  };

  return Box(breadcrumbOptions);
}

export default BreadcrumbComponent;
`;
}

function generateAlertComponent() {
  return `import { Box } from 'blessed';
import { ComponentProps } from '../types';

export interface AlertProps extends ComponentProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  closable?: boolean;
  onClose?: () => void;
}

export function AlertComponent(props: AlertProps) {
  const {
    type = 'info',
    title,
    message,
    closable = true,
    onClose,
    ...rest
  } = props;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return { fg: 'green', bg: 'black' };
      case 'warning':
        return { fg: 'yellow', bg: 'black' };
      case 'error':
        return { fg: 'red', bg: 'black' };
      default:
        return { fg: 'blue', bg: 'black' };
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'error':
        return '✗';
      default:
        return 'ℹ';
    }
  };

  const content = title 
    ? \`\${getTypeIcon()} \${title}\\n\${message}\`
    : \`\${getTypeIcon()} \${message}\`;

  const alertOptions = {
    content,
    style: {
      ...getTypeStyles(),
      border: { fg: getTypeStyles().fg },
    },
    border: { type: 'line' },
    ...rest,
  };

  const alert = Box(alertOptions);

  if (closable && onClose) {
    alert.key(['escape', 'q'], onClose);
  }

  return alert;
}

export default AlertComponent;
`;
}

function generateModalComponent() {
  return `import { Box } from 'blessed';
import { ComponentProps } from '../types';

export interface ModalProps extends ComponentProps {
  title?: string;
  children?: React.ReactNode;
  closable?: boolean;
  onClose?: () => void;
}

export function ModalComponent(props: ModalProps) {
  const {
    title,
    children,
    closable = true,
    onClose,
    ...rest
  } = props;

  const modalOptions = {
    content: children || '',
    style: {
      fg: 'white',
      bg: 'black',
      border: { fg: 'white' },
    },
    border: { type: 'line' },
    shadow: true,
    ...rest,
  };

  const modal = Box(modalOptions);

  if (closable && onClose) {
    modal.key(['escape', 'q'], onClose);
  }

  return modal;
}

export default ModalComponent;
`;
}

function generateTooltipComponent() {
  return `import { Box } from 'blessed';
import { ComponentProps } from '../types';

export interface TooltipProps extends ComponentProps {
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  show?: boolean;
}

export function TooltipComponent(props: TooltipProps) {
  const {
    text,
    position = 'top',
    show = false,
    ...rest
  } = props;

  if (!show) return null;

  const tooltipOptions = {
    content: text,
    style: {
      fg: 'white',
      bg: 'black',
      border: { fg: 'white' },
    },
    border: { type: 'line' },
    shadow: true,
    ...rest,
  };

  return Box(tooltipOptions);
}

export default TooltipComponent;
`;
}

function generateNotificationComponent() {
  return `import { Box } from 'blessed';
import { ComponentProps } from '../types';

export interface NotificationProps extends ComponentProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  duration?: number;
  onClose?: () => void;
}

export function NotificationComponent(props: NotificationProps) {
  const {
    type = 'info',
    title,
    message,
    duration = 3000,
    onClose,
    ...rest
  } = props;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return { fg: 'green', bg: 'black' };
      case 'warning':
        return { fg: 'yellow', bg: 'black' };
      case 'error':
        return { fg: 'red', bg: 'black' };
      default:
        return { fg: 'blue', bg: 'black' };
    }
  };

  const content = title 
    ? \`\${title}\\n\${message}\`
    : message;

  const notificationOptions = {
    content,
    style: {
      ...getTypeStyles(),
      border: { fg: getTypeStyles().fg },
    },
    border: { type: 'line' },
    shadow: true,
    ...rest,
  };

  const notification = Box(notificationOptions);

  // Auto-close after duration
  if (duration > 0) {
    setTimeout(() => {
      if (onClose) onClose();
    }, duration);
  }

  return notification;
}

export default NotificationComponent;
`;
}

function generateChartComponent() {
  return `import { Box } from 'blessed';
import { ComponentProps } from '../types';

export interface ChartProps extends ComponentProps {
  data: number[];
  type?: 'bar' | 'line' | 'pie';
  labels?: string[];
  maxValue?: number;
}

export function ChartComponent(props: ChartProps) {
  const {
    data = [],
    type = 'bar',
    labels = [],
    maxValue,
    ...rest
  } = props;

  const max = maxValue || Math.max(...data);
  const chartHeight = 10;

  let chartContent = '';

  if (type === 'bar') {
    data.forEach((value, index) => {
      const barHeight = Math.round((value / max) * chartHeight);
      const bar = '█'.repeat(barHeight);
      const label = labels[index] || \`\${index + 1}\`;
      chartContent += \`\${label}: \${bar} \${value}\\n\`;
    });
  } else if (type === 'line') {
    // Simple line chart representation
    chartContent = data.map((value, index) => {
      const label = labels[index] || \`\${index + 1}\`;
      return \`\${label}: \${value}\`;
    }).join('\\n');
  }

  const chartOptions = {
    content: chartContent,
    style: {
      fg: 'white',
      bg: 'black',
    },
    border: { type: 'line' },
    ...rest,
  };

  return Box(chartOptions);
}

export default ChartComponent;
`;
}

function generateTreeComponent() {
  return `import { Tree } from 'blessed';
import { ComponentProps } from '../types';

export interface TreeNode {
  text: string;
  children?: TreeNode[];
  expanded?: boolean;
}

export interface TreeProps extends ComponentProps {
  data: TreeNode[];
  onSelect?: (node: TreeNode) => void;
}

export function TreeComponent(props: TreeProps) {
  const {
    data = [],
    onSelect,
    ...rest
  } = props;

  const treeOptions = {
    data,
    keys: true,
    vi: true,
    mouse: true,
    style: {
      fg: 'white',
      bg: 'black',
      focus: { fg: 'white', bg: 'blue' },
      selected: { fg: 'white', bg: 'lightblue' },
    },
    border: { type: 'line' },
    ...rest,
  };

  const tree = Tree(treeOptions);

  if (onSelect) {
    tree.on('select', (node) => {
      onSelect(node);
    });
  }

  return tree;
}

export default TreeComponent;
`;
}

function generateCalendarComponent() {
  return `import { Box } from 'blessed';
import { ComponentProps } from '../types';

export interface CalendarProps extends ComponentProps {
  date?: Date;
  onDateSelect?: (date: Date) => void;
}

export function CalendarComponent(props: CalendarProps) {
  const {
    date = new Date(),
    onDateSelect,
    ...rest
  } = props;

  const year = date.getFullYear();
  const month = date.getMonth();
  const today = new Date();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  let calendarContent = \`\${monthNames[month]} \${year}\\n\`;
  calendarContent += 'Su Mo Tu We Th Fr Sa\\n';

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    calendarContent += '   ';
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = year === today.getFullYear() && 
                   month === today.getMonth() && 
                   day === today.getDate();
    
    const dayStr = isToday ? \`[\${day.toString().padStart(2)}]\` : day.toString().padStart(2);
    calendarContent += \`\${dayStr} \`;
    
    if ((firstDay + day) % 7 === 0) {
      calendarContent += '\\n';
    }
  }

  const calendarOptions = {
    content: calendarContent,
    style: {
      fg: 'white',
      bg: 'black',
    },
    border: { type: 'line' },
    ...rest,
  };

  return Box(calendarOptions);
}

export default CalendarComponent;
`;
}