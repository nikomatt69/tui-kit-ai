import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { TableProps, TableVariants, TableSizes, TableStates } from './Table.types';
import { TableStyles } from './Table.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export interface TableColumn {
  id: string;
  label: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  formatter?: (value: any) => string;
}

export interface TableRow {
  id: string;
  data: Record<string, any>;
  selected?: boolean;
  highlighted?: boolean;
  metadata?: Record<string, any>;
}

export class Table implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: TableProps;
  private validationResult: ValidationResult;
  private columns: TableColumn[] = [];
  private rows: TableRow[] = [];
  private selectedRows: Set<string> = new Set();
  private focusedRowIndex: number = -1;
  private focusedColumnIndex: number = -1;
  private sortColumn: string | null = null;
  private sortDirection: 'asc' | 'desc' = 'asc';

  constructor(props: TableProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('Table', props);
    
    if (!this.validationResult.success) {
      console.error('❌ Table validation failed:', this.validationResult.errors);
      throw new Error(`Table validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ Table warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    this.columns = this.props.columns || [];
    this.rows = this.props.rows || [];
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: TableStyles.getStyle(this.props),
      content: this.renderTable(),
      align: 'left',
      valign: 'top',
      scrollable: true,
      alwaysScroll: true,
    });
    
    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;
    
    this.setupEventHandlers();
  }
  
  private setupEventHandlers() {
    // Handle focus events
    this.el.on('focus', () => {
      this.setState('focus');
    });

    this.el.on('blur', () => {
      this.setState('default');
    });

    // Handle key events
    this.el.on('keydown', (event: any) => {
      this.handleKeyDown(event);
    });

    // Handle mouse events
    this.el.on('mouseover', () => {
      this.setState('hover');
    });

    this.el.on('mouseout', () => {
      this.setState('default');
    });

    // Handle click events
    if (this.props.clickable) {
      this.el.on('click', (event: any) => {
        this.handleClick(event);
      });
    }

    // Handle scroll events
    this.el.on('scroll', (event: any) => {
      this.handleScroll(event);
    });
  }

  private handleKeyDown(event: any) {
    switch (event.key) {
      case 'up':
      case 'k':
        this.focusPreviousRow();
        break;
      case 'down':
      case 'j':
        this.focusNextRow();
        break;
      case 'left':
      case 'h':
        this.focusPreviousColumn();
        break;
      case 'right':
      case 'l':
        this.focusNextColumn();
        break;
      case 'enter':
      case 'space':
        this.toggleRowSelection();
        break;
      case 'a':
        if (event.ctrl) {
          this.selectAllRows();
        }
        break;
      case 'escape':
        this.clearSelection();
        break;
      case 'home':
        this.focusFirstRow();
        break;
      case 'end':
        this.focusLastRow();
        break;
    }

    if (this.props.onKeyDown) {
      this.props.onKeyDown({
        type: 'keydown',
        target: this.el,
        key: event.key,
        ctrl: event.ctrl,
        shift: event.shift,
        alt: event.alt,
      });
    }
  }

  private handleClick(event: any) {
    if (this.props.onClick) {
      this.props.onClick({
        type: 'click',
        target: this.el,
        columns: this.columns,
        rows: this.rows,
        selectedRows: Array.from(this.selectedRows),
        focusedRowIndex: this.focusedRowIndex,
        focusedColumnIndex: this.focusedColumnIndex,
      });
    }
  }

  private handleScroll(event: any) {
    if (this.props.onScroll) {
      this.props.onScroll({
        type: 'scroll',
        target: this.el,
        scrollPosition: event.scrollPosition,
        maxScroll: event.maxScroll,
      });
    }
  }

  private renderTable(): string {
    if (this.columns.length === 0) {
      return this.props.emptyMessage || 'No columns defined';
    }

    let content = '';
    
    // Title
    if (this.props.title) {
      content += `${this.props.title}\n`;
    }
    
    // Header
    if (this.props.showHeader) {
      content += this.renderHeader();
      content += '\n';
    }
    
    // Separator
    if (this.props.showSeparators) {
      content += this.renderSeparator();
      content += '\n';
    }
    
    // Rows
    if (this.rows.length === 0) {
      content += this.props.noDataMessage || 'No data available';
    } else {
      this.rows.forEach((row, index) => {
        content += this.renderRow(row, index);
        if (index < this.rows.length - 1) {
          content += '\n';
        }
      });
    }
    
    return content;
  }

  private renderHeader(): string {
    let header = '';
    
    this.columns.forEach((column, index) => {
      const isFocused = index === this.focusedColumnIndex;
      const isSortable = column.sortable;
      const isSorted = this.sortColumn === column.id;
      
      let columnHeader = '';
      
      // Column label
      if (isFocused) {
        columnHeader += `_${column.label}_`;
      } else {
        columnHeader += column.label;
      }
      
      // Sort indicator
      if (isSortable && isSorted) {
        columnHeader += this.sortDirection === 'asc' ? ' ↑' : ' ↓';
      } else if (isSortable) {
        columnHeader += ' ↕';
      }
      
      // Width padding
      const width = column.width || this.props.defaultColumnWidth || 15;
      const padding = Math.max(0, width - columnHeader.length);
      columnHeader += ' '.repeat(padding);
      
      header += columnHeader;
      
      // Column separator
      if (index < this.columns.length - 1) {
        header += ' | ';
      }
    });
    
    return header;
  }

  private renderSeparator(): string {
    let separator = '';
    
    this.columns.forEach((column, index) => {
      const width = column.width || this.props.defaultColumnWidth || 15;
      separator += '-'.repeat(width);
      
      if (index < this.columns.length - 1) {
        separator += '-+-';
      }
    });
    
    return separator;
  }

  private renderRow(row: TableRow, rowIndex: number): string {
    let rowContent = '';
    
    this.columns.forEach((column, colIndex) => {
      const isFocused = rowIndex === this.focusedRowIndex && colIndex === this.focusedColumnIndex;
      const isSelected = this.selectedRows.has(row.id);
      const isHighlighted = row.highlighted;
      
      let cellContent = '';
      
      // Cell value
      const value = row.data[column.id];
      let displayValue = '';
      
      if (column.formatter) {
        displayValue = column.formatter(value);
      } else {
        displayValue = value !== undefined && value !== null ? String(value) : '';
      }
      
      // Apply row styling
      if (isSelected) {
        displayValue = `[${displayValue}]`;
      } else if (isHighlighted) {
        displayValue = `*${displayValue}*`;
      }
      
      if (isFocused) {
        displayValue = `>${displayValue}<`;
      }
      
      // Width padding
      const width = column.width || this.props.defaultColumnWidth || 15;
      const padding = Math.max(0, width - displayValue.length);
      
      // Alignment
      if (column.align === 'center') {
        const leftPadding = Math.floor(padding / 2);
        const rightPadding = padding - leftPadding;
        displayValue = ' '.repeat(leftPadding) + displayValue + ' '.repeat(rightPadding);
      } else if (column.align === 'right') {
        displayValue = ' '.repeat(padding) + displayValue;
      } else {
        displayValue = displayValue + ' '.repeat(padding);
      }
      
      cellContent += displayValue;
      rowContent += cellContent;
      
      // Column separator
      if (colIndex < this.columns.length - 1) {
        rowContent += ' | ';
      }
    });
    
    return rowContent;
  }

  // Variant system methods
  setVariant(variant: TableVariants) {
    this.props.variant = variant;
    this.el.style = TableStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: TableSizes) {
    this.props.size = size;
    this.el.style = TableStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setState(state: TableStates) {
    this.props.state = state;
    this.el.style = TableStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // Table-specific methods
  setTitle(title: string) {
    this.props.title = title;
    this.el.setContent(this.renderTable());
    this.el.screen.render();
  }

  setColumns(columns: TableColumn[]) {
    this.columns = columns;
    this.focusedColumnIndex = -1;
    this.sortColumn = null;
    this.el.setContent(this.renderTable());
    this.el.screen.render();
    
    if (this.props.onColumnsChange) {
      this.props.onColumnsChange({
        type: 'columnschange',
        target: this.el,
        columns: this.columns,
        previousColumns: [],
      });
    }
  }

  setRows(rows: TableRow[]) {
    this.rows = rows;
    this.selectedRows.clear();
    this.focusedRowIndex = -1;
    this.el.setContent(this.renderTable());
    this.el.screen.render();
    
    if (this.props.onRowsChange) {
      this.props.onRowsChange({
        type: 'rowschange',
        target: this.el,
        rows: this.rows,
        previousRows: [],
      });
    }
  }

  addColumn(column: TableColumn) {
    this.columns.push(column);
    this.el.setContent(this.renderTable());
    this.el.screen.render();
    
    if (this.props.onColumnAdd) {
      this.props.onColumnAdd({
        type: 'columnadd',
        target: this.el,
        column,
        totalColumns: this.columns.length,
      });
    }
  }

  removeColumn(id: string) {
    const index = this.columns.findIndex(col => col.id === id);
    if (index >= 0) {
      const removedColumn = this.columns.splice(index, 1)[0];
      
      // Adjust focused column index
      if (this.focusedColumnIndex >= index) {
        this.focusedColumnIndex = Math.max(-1, this.focusedColumnIndex - 1);
      }
      
      // Clear sort if removed column was sorted
      if (this.sortColumn === id) {
        this.sortColumn = null;
      }
      
      this.el.setContent(this.renderTable());
      this.el.screen.render();
      
      if (this.props.onColumnRemove) {
        this.props.onColumnRemove({
          type: 'columnremove',
          target: this.el,
          column: removedColumn,
          totalColumns: this.columns.length,
        });
      }
    }
  }

  addRow(row: TableRow) {
    this.rows.push(row);
    this.el.setContent(this.renderTable());
    this.el.screen.render();
    
    if (this.props.onRowAdd) {
      this.props.onRowAdd({
        type: 'rowadd',
        target: this.el,
        row,
        totalRows: this.rows.length,
      });
    }
  }

  removeRow(id: string) {
    const index = this.rows.findIndex(row => row.id === id);
    if (index >= 0) {
      const removedRow = this.rows.splice(index, 1)[0];
      
      // Remove from selection
      this.selectedRows.delete(id);
      
      // Adjust focused row index
      if (this.focusedRowIndex >= index) {
        this.focusedRowIndex = Math.max(-1, this.focusedRowIndex - 1);
      }
      
      this.el.setContent(this.renderTable());
      this.el.screen.render();
      
      if (this.props.onRowRemove) {
        this.props.onRowRemove({
          type: 'rowremove',
          target: this.el,
          row: removedRow,
          totalRows: this.rows.length,
        });
      }
    }
  }

  updateRow(id: string, updates: Partial<TableRow>) {
    const index = this.rows.findIndex(row => row.id === id);
    if (index >= 0) {
      const previousRow = { ...this.rows[index] };
      this.rows[index] = { ...this.rows[index], ...updates };
      
      this.el.setContent(this.renderTable());
      this.el.screen.render();
      
      if (this.props.onRowUpdate) {
        this.props.onRowUpdate({
          type: 'rowupdate',
          target: this.el,
          row: this.rows[index],
          previousRow,
        });
      }
    }
  }

  clearTable() {
    this.columns = [];
    this.rows = [];
    this.selectedRows.clear();
    this.focusedRowIndex = -1;
    this.focusedColumnIndex = -1;
    this.sortColumn = null;
    this.el.setContent(this.renderTable());
    this.el.screen.render();
    
    if (this.props.onTableClear) {
      this.props.onTableClear({
        type: 'tableclear',
        target: this.el,
      });
    }
  }

  // Display options
  setShowHeader(show: boolean) {
    this.props.showHeader = show;
    this.el.setContent(this.renderTable());
    this.el.screen.render();
  }

  setShowSeparators(show: boolean) {
    this.props.showSeparators = show;
    this.el.setContent(this.renderTable());
    this.el.screen.render();
  }

  setDefaultColumnWidth(width: number) {
    this.props.defaultColumnWidth = width;
    this.el.setContent(this.renderTable());
    this.el.screen.render();
  }

  // Row selection methods
  selectRow(id: string) {
    this.selectedRows.add(id);
    this.el.setContent(this.renderTable());
    this.el.screen.render();
    
    if (this.props.onRowSelect) {
      this.props.onRowSelect({
        type: 'rowselect',
        target: this.el,
        rowId: id,
        selectedRows: Array.from(this.selectedRows),
      });
    }
  }

  deselectRow(id: string) {
    this.selectedRows.delete(id);
    this.el.setContent(this.renderTable());
    this.el.screen.render();
    
    if (this.props.onRowDeselect) {
      this.props.onRowDeselect({
        type: 'rowdeselect',
        target: this.el,
        rowId: id,
        selectedRows: Array.from(this.selectedRows),
      });
    }
  }

  toggleRowSelection() {
    if (this.focusedRowIndex >= 0 && this.focusedRowIndex < this.rows.length) {
      const row = this.rows[this.focusedRowIndex];
      if (this.selectedRows.has(row.id)) {
        this.deselectRow(row.id);
      } else {
        this.selectRow(row.id);
      }
    }
  }

  selectAllRows() {
    this.rows.forEach(row => {
      this.selectedRows.add(row.id);
    });
    this.el.setContent(this.renderTable());
    this.el.screen.render();
    
    if (this.props.onSelectAll) {
      this.props.onSelectAll({
        type: 'selectall',
        target: this.el,
        selectedRows: Array.from(this.selectedRows),
      });
    }
  }

  clearSelection() {
    this.selectedRows.clear();
    this.el.setContent(this.renderTable());
    this.el.screen.render();
    
    if (this.props.onSelectionClear) {
      this.props.onSelectionClear({
        type: 'selectionclear',
        target: this.el,
      });
    }
  }

  // Row focus methods
  focusRow(index: number) {
    if (index >= 0 && index < this.rows.length) {
      this.focusedRowIndex = index;
      this.el.setContent(this.renderTable());
      this.el.screen.render();
      
      if (this.props.onRowFocus) {
        this.props.onRowFocus({
          type: 'rowfocus',
          target: this.el,
          rowIndex: this.focusedRowIndex,
          row: this.rows[this.focusedRowIndex],
        });
      }
    }
  }

  focusNextRow() {
    if (this.focusedRowIndex < this.rows.length - 1) {
      this.focusRow(this.focusedRowIndex + 1);
    } else {
      this.focusRow(0);
    }
  }

  focusPreviousRow() {
    if (this.focusedRowIndex > 0) {
      this.focusRow(this.focusedRowIndex - 1);
    } else {
      this.focusRow(this.rows.length - 1);
    }
  }

  focusFirstRow() {
    this.focusRow(0);
  }

  focusLastRow() {
    this.focusRow(this.rows.length - 1);
  }

  // Column focus methods
  focusColumn(index: number) {
    if (index >= 0 && index < this.columns.length) {
      this.focusedColumnIndex = index;
      this.el.setContent(this.renderTable());
      this.el.screen.render();
      
      if (this.props.onColumnFocus) {
        this.props.onColumnFocus({
          type: 'columnfocus',
          target: this.el,
          columnIndex: this.focusedColumnIndex,
          column: this.columns[this.focusedColumnIndex],
        });
      }
    }
  }

  focusNextColumn() {
    if (this.focusedColumnIndex < this.columns.length - 1) {
      this.focusColumn(this.focusedColumnIndex + 1);
    } else {
      this.focusColumn(0);
    }
  }

  focusPreviousColumn() {
    if (this.focusedColumnIndex > 0) {
      this.focusColumn(this.focusedColumnIndex - 1);
    } else {
      this.focusColumn(this.columns.length - 1);
    }
  }

  // Sorting methods
  sortByColumn(columnId: string, direction?: 'asc' | 'desc') {
    const column = this.columns.find(col => col.id === columnId);
    if (column && column.sortable) {
      this.sortColumn = columnId;
      this.sortDirection = direction || (this.sortColumn === columnId && this.sortDirection === 'asc' ? 'desc' : 'asc');
      
      // Sort rows
      this.rows.sort((a, b) => {
        const aValue = a.data[columnId];
        const bValue = b.data[columnId];
        
        let comparison = 0;
        if (aValue < bValue) comparison = -1;
        if (aValue > bValue) comparison = 1;
        
        return this.sortDirection === 'asc' ? comparison : -comparison;
      });
      
      this.el.setContent(this.renderTable());
      this.el.screen.render();
      
      if (this.props.onSort) {
        this.props.onSort({
          type: 'sort',
          target: this.el,
          columnId,
          direction: this.sortDirection,
        });
      }
    }
  }

  clearSort() {
    this.sortColumn = null;
    this.sortDirection = 'asc';
    this.el.setContent(this.renderTable());
    this.el.screen.render();
  }

  // Get current configuration
  getConfig() {
    return {
      variant: this.props.variant,
      size: this.props.size,
      state: this.props.state,
      theme: this.theme,
      title: this.props.title,
      columns: this.columns,
      rows: this.rows,
      selectedRows: Array.from(this.selectedRows),
      focusedRowIndex: this.focusedRowIndex,
      focusedColumnIndex: this.focusedColumnIndex,
      sortColumn: this.sortColumn,
      sortDirection: this.sortDirection,
      showHeader: this.props.showHeader,
      showSeparators: this.props.showSeparators,
      defaultColumnWidth: this.props.defaultColumnWidth,
    };
  }

  // Get table properties
  getTitle(): string | undefined {
    return this.props.title;
  }

  getColumns(): TableColumn[] {
    return [...this.columns];
  }

  getRows(): TableRow[] {
    return [...this.rows];
  }

  getSelectedRows(): string[] {
    return Array.from(this.selectedRows);
  }

  getFocusedRowIndex(): number {
    return this.focusedRowIndex;
  }

  getFocusedColumnIndex(): number {
    return this.focusedColumnIndex;
  }

  getSortColumn(): string | null {
    return this.sortColumn;
  }

  getSortDirection(): 'asc' | 'desc' {
    return this.sortDirection;
  }

  getColumnCount(): number {
    return this.columns.length;
  }

  getRowCount(): number {
    return this.rows.length;
  }

  getColumnById(id: string): TableColumn | undefined {
    return this.columns.find(col => col.id === id);
  }

  getRowById(id: string): TableRow | undefined {
    return this.rows.find(row => row.id === id);
  }

  // Update component with new props
  update(newProps: Partial<TableProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('Table', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ Table update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = TableStyles.getStyle(this.props);
    
    // Update columns if changed
    if (newProps.columns !== undefined) {
      this.setColumns(this.props.columns || []);
    }
    
    // Update rows if changed
    if (newProps.rows !== undefined) {
      this.setRows(this.props.rows || []);
    }
    
    // Update content if any display properties changed
    if (newProps.title !== undefined ||
        newProps.showHeader !== undefined ||
        newProps.showSeparators !== undefined ||
        newProps.defaultColumnWidth !== undefined) {
      this.el.setContent(this.renderTable());
    }
    
    this.el.screen.render();
  }

  // Focus management
  focus() {
    this.el.focus();
  }

  blur() {
    this.el.blur();
  }

  // Visibility management
  show() {
    this.el.show();
    this.el.screen.render();
  }

  hide() {
    this.el.hide();
    this.el.screen.render();
  }

  // Get validation result for debugging
  getValidationResult(): ValidationResult {
    return this.validationResult;
  }
}