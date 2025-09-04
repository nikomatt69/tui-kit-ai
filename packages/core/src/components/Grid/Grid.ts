import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { GridProps, GridVariants, GridSizes, GridStates } from './Grid.types';
import { GridStyles } from './Grid.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export class Grid implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: GridProps;
  private validationResult: ValidationResult;
  private children: Widgets.BoxElement[] = [];
  private gridData: any[][] = [];

  constructor(props: GridProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('Grid', props);
    
    if (!this.validationResult.success) {
      console.error('❌ Grid validation failed:', this.validationResult.errors);
      throw new Error(`Grid validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ Grid warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: GridStyles.getStyle(this.props),
      content: '',
      align: 'left',
      valign: 'top',
    });
    
    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;
    
    this.setupEventHandlers();
    this.layoutGrid();
  }
  
  private setupEventHandlers() {
    // Handle focus events
    this.el.on('focus', () => {
      this.setState('focus');
    });

    this.el.on('blur', () => {
      this.setState('default');
    });

    // Handle mouse events
    this.el.on('mouseover', () => {
      this.setState('hover');
    });

    this.el.on('mouseout', () => {
      this.setState('default');
    });
  }

  private layoutGrid() {
    const columns = this.props.columns || 1;
    const rows = this.props.rows || 1;
    const spacing = this.props.spacing || 1;
    const cellWidth = this.props.cellWidth || 10;
    const cellHeight = this.props.cellHeight || 3;
    
    let currentRow = 0;
    let currentCol = 0;
    
    this.children.forEach((child, index) => {
      if (currentCol >= columns) {
        currentCol = 0;
        currentRow++;
      }
      
      if (currentRow >= rows) {
        return; // Skip if we exceed grid bounds
      }
      
      child.left = currentCol * (cellWidth + spacing);
      child.top = currentRow * (cellHeight + spacing);
      child.width = cellWidth;
      child.height = cellHeight;
      
      currentCol++;
    });
  }

  // Variant system methods
  setVariant(variant: GridVariants) {
    this.props.variant = variant;
    this.el.style = GridStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: GridSizes) {
    this.props.size = size;
    this.el.style = GridStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setState(state: GridStates) {
    this.props.state = state;
    this.el.style = GridStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // Grid-specific methods
  setColumns(columns: number) {
    this.props.columns = columns;
    this.layoutGrid();
    this.el.screen.render();
  }

  setRows(rows: number) {
    this.props.rows = rows;
    this.layoutGrid();
    this.el.screen.render();
  }

  setSpacing(spacing: number) {
    this.props.spacing = spacing;
    this.layoutGrid();
    this.el.screen.render();
  }

  setCellWidth(width: number) {
    this.props.cellWidth = width;
    this.layoutGrid();
    this.el.screen.render();
  }

  setCellHeight(height: number) {
    this.props.cellHeight = height;
    this.layoutGrid();
    this.el.screen.render();
  }

  setGridData(data: any[][]) {
    this.gridData = data;
    this.renderGridData();
    this.el.screen.render();
  }

  // Child management
  addChild(child: Widgets.BoxElement) {
    this.children.push(child);
    this.layoutGrid();
    this.el.screen.render();
  }

  removeChild(child: Widgets.BoxElement) {
    const index = this.children.indexOf(child);
    if (index > -1) {
      this.children.splice(index, 1);
      this.layoutGrid();
      this.el.screen.render();
    }
  }

  getChildren(): Widgets.BoxElement[] {
    return [...this.children];
  }

  clearChildren() {
    this.children = [];
    this.layoutGrid();
    this.el.screen.render();
  }

  // Grid data management
  setCellData(row: number, col: number, data: any) {
    if (!this.gridData[row]) {
      this.gridData[row] = [];
    }
    this.gridData[row][col] = data;
    this.renderGridData();
    this.el.screen.render();
  }

  getCellData(row: number, col: number): any {
    return this.gridData[row]?.[col];
  }

  private renderGridData() {
    if (!this.props.showGrid || this.gridData.length === 0) return;
    
    let gridContent = '';
    const columns = this.props.columns || 1;
    
    this.gridData.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (colIndex < columns) {
          gridContent += `${cell || ''}`.padEnd(this.props.cellWidth || 10);
          if (colIndex < columns - 1) {
            gridContent += ' | ';
          }
        }
      });
      if (rowIndex < this.gridData.length - 1) {
        gridContent += '\n';
        gridContent += '─'.repeat(columns * (this.props.cellWidth || 10) + (columns - 1) * 3) + '\n';
      }
    });
    
    this.el.setContent(gridContent);
  }

  // Get current configuration
  getConfig() {
    return {
      variant: this.props.variant,
      size: this.props.size,
      state: this.props.state,
      theme: this.theme,
      columns: this.props.columns,
      rows: this.props.rows,
      spacing: this.props.spacing,
      cellWidth: this.props.cellWidth,
      cellHeight: this.props.cellHeight,
      showGrid: this.props.showGrid,
      childrenCount: this.children.length,
      gridData: this.gridData,
    };
  }

  // Get grid properties
  getColumns(): number {
    return this.props.columns || 1;
  }

  getRows(): number {
    return this.props.rows || 1;
  }

  getSpacing(): number {
    return this.props.spacing || 1;
  }

  getCellWidth(): number {
    return this.props.cellWidth || 10;
  }

  getCellHeight(): number {
    return this.props.cellHeight || 3;
  }

  // Update component with new props
  update(newProps: Partial<GridProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('Grid', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ Grid update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = GridStyles.getStyle(this.props);
    
    // Relayout if layout properties changed
    if (newProps.columns !== undefined || 
        newProps.rows !== undefined || 
        newProps.spacing !== undefined || 
        newProps.cellWidth !== undefined || 
        newProps.cellHeight !== undefined) {
      this.layoutGrid();
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