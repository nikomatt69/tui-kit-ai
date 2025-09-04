import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from '../../BaseComponent';
import { TreeProps, TreeVariants, TreeSizes, TreeStates, TreeNode } from './Tree.types';
import { TreeStyles } from './Tree.styles';
import { validateComponent, ValidationResult } from '../../validation/component-validator';

export class Tree implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private props: TreeProps;
  private validationResult: ValidationResult;
  private nodes: TreeNode[] = [];
  private expandedNodes: Set<string> = new Set();
  private selectedNode: string | null = null;
  private focusedNode: string | null = null;
  private scrollOffset: number = 0;

  constructor(props: TreeProps) {
    // Validate props using Zod
    this.validationResult = validateComponent('Tree', props);
    
    if (!this.validationResult.success) {
      console.error('❌ Tree validation failed:', this.validationResult.errors);
      throw new Error(`Tree validation failed: ${this.validationResult.errors?.message || 'Unknown error'}`);
    }

    // Show warnings if any
    if (this.validationResult.warnings && this.validationResult.warnings.length > 0) {
      console.warn('⚠️ Tree warnings:', this.validationResult.warnings);
    }

    this.props = this.validationResult.data;
    this.nodes = this.props.nodes || [];
    
    // Expand default nodes
    if (this.props.defaultExpanded) {
      this.expandDefaultNodes();
    }
    
    // Create blessed element with validated props
    const comp = createBoxBase<Widgets.BoxElement>({
      ...this.props,
      style: TreeStyles.getStyle(this.props),
      content: this.renderTree(),
      align: 'left',
      valign: 'top',
      scrollable: true,
      alwaysScroll: true,
      scrollbar: {
        ch: ' ',
        track: {
          bg: 'cyan'
        },
        style: {
          bg: 'blue'
        }
      }
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

    // Handle key events
    this.el.on('keydown', (event: any) => {
      this.handleKeyDown(event);
    });

    // Handle scroll events
    this.el.on('scroll', () => {
      this.handleScroll();
    });
  }

  private handleClick(event: any) {
    // Handle node clicks
    if (this.props.onNodeClick) {
      this.props.onNodeClick({
        type: 'nodeclick',
        target: this.el,
        nodeId: this.selectedNode,
        node: this.getNodeById(this.selectedNode || ''),
      });
    }
  }

  private handleKeyDown(event: any) {
    switch (event.key) {
      case 'up':
        this.navigateUp();
        break;
      case 'down':
        this.navigateDown();
        break;
      case 'left':
        this.collapseNode();
        break;
      case 'right':
        this.expandNode();
        break;
      case 'enter':
      case 'space':
        this.toggleNode();
        break;
      case 'home':
        this.navigateToFirst();
        break;
      case 'end':
        this.navigateToLast();
        break;
      case 'pageup':
        this.pageUp();
        break;
      case 'pagedown':
        this.pageDown();
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

  private handleScroll() {
    if (this.props.onScroll) {
      this.props.onScroll({
        type: 'scroll',
        target: this.el,
        scrollOffset: this.scrollOffset,
      });
    }
  }

  private expandDefaultNodes() {
    this.nodes.forEach(node => {
      if (node.defaultExpanded) {
        this.expandedNodes.add(node.id);
        if (node.children) {
          node.children.forEach(child => {
            if (child.defaultExpanded) {
              this.expandedNodes.add(child.id);
            }
          });
        }
      }
    });
  }

  private renderTree(): string {
    if (this.nodes.length === 0) {
      return this.props.emptyMessage || 'No nodes';
    }

    let treeContent = '';
    this.nodes.forEach(node => {
      treeContent += this.renderNode(node, 0);
    });

    return treeContent;
  }

  private renderNode(node: TreeNode, level: number): string {
    const indent = '  '.repeat(level);
    const isExpanded = this.expandedNodes.has(node.id);
    const isSelected = this.selectedNode === node.id;
    const isFocused = this.focusedNode === node.id;
    
    let nodeContent = '';
    
    // Selection indicator
    if (isSelected) {
      nodeContent += '▶ ';
    } else {
      nodeContent += '  ';
    }
    
    // Focus indicator
    if (isFocused) {
      nodeContent += '● ';
    } else {
      nodeContent += '  ';
    }
    
    // Expand/collapse indicator
    if (node.children && node.children.length > 0) {
      nodeContent += isExpanded ? '▼ ' : '▶ ';
    } else {
      nodeContent += '  ';
    }
    
    // Icon
    if (node.icon) {
      nodeContent += `${node.icon} `;
    }
    
    // Label
    if (isSelected) {
      nodeContent += `**${node.label}**`;
    } else {
      nodeContent += node.label;
    }
    
    // Additional info
    if (node.info) {
      nodeContent += ` (${node.info})`;
    }
    
    nodeContent += '\n';
    
    // Render children if expanded
    if (isExpanded && node.children && node.children.length > 0) {
      node.children.forEach(child => {
        nodeContent += this.renderNode(child, level + 1);
      });
    }
    
    return nodeContent;
  }

  // Variant system methods
  setVariant(variant: TreeVariants) {
    this.props.variant = variant;
    this.el.style = TreeStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setSize(size: TreeSizes) {
    this.props.size = size;
    this.el.style = TreeStyles.getStyle(this.props);
    this.el.screen.render();
  }
  
  setState(state: TreeStates) {
    this.props.state = state;
    this.el.style = TreeStyles.getStyle(this.props);
    this.el.screen.render();
  }

  // Tree-specific methods
  setNodes(nodes: TreeNode[]) {
    this.nodes = nodes;
    this.expandedNodes.clear();
    this.selectedNode = null;
    this.focusedNode = null;
    
    if (this.props.defaultExpanded) {
      this.expandDefaultNodes();
    }
    
    this.el.setContent(this.renderTree());
    this.el.screen.render();
    
    if (this.props.onNodesChange) {
      this.props.onNodesChange({
        type: 'nodeschange',
        target: this.el,
        nodes: this.nodes,
      });
    }
  }

  addNode(node: TreeNode, parentId?: string) {
    if (parentId) {
      const parent = this.findNodeById(this.nodes, parentId);
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(node);
      }
    } else {
      this.nodes.push(node);
    }
    
    this.el.setContent(this.renderTree());
    this.el.screen.render();
    
    if (this.props.onNodeAdd) {
      this.props.onNodeAdd({
        type: 'nodeadd',
        target: this.el,
        node,
        parentId,
      });
    }
  }

  removeNode(nodeId: string) {
    const removed = this.removeNodeById(this.nodes, nodeId);
    if (removed) {
      this.expandedNodes.delete(nodeId);
      if (this.selectedNode === nodeId) {
        this.selectedNode = null;
      }
      if (this.focusedNode === nodeId) {
        this.focusedNode = null;
      }
      
      this.el.setContent(this.renderTree());
      this.el.screen.render();
      
      if (this.props.onNodeRemove) {
        this.props.onNodeRemove({
          type: 'noderemove',
          target: this.el,
          nodeId,
        });
      }
    }
  }

  updateNode(nodeId: string, updates: Partial<TreeNode>) {
    const node = this.findNodeById(this.nodes, nodeId);
    if (node) {
      Object.assign(node, updates);
      this.el.setContent(this.renderTree());
      this.el.screen.render();
      
      if (this.props.onNodeUpdate) {
        this.props.onNodeUpdate({
          type: 'nodeupdate',
          target: this.el,
          nodeId,
          node,
          updates,
        });
      }
    }
  }

  expandNode(nodeId?: string) {
    const targetId = nodeId || this.focusedNode;
    if (targetId && this.expandedNodes.has(targetId)) {
      return; // Already expanded
    }
    
    if (targetId) {
      this.expandedNodes.add(targetId);
      this.el.setContent(this.renderTree());
      this.el.screen.render();
      
      if (this.props.onNodeExpand) {
        this.props.onNodeExpand({
          type: 'nodeexpand',
          target: this.el,
          nodeId: targetId,
        });
      }
    }
  }

  collapseNode(nodeId?: string) {
    const targetId = nodeId || this.focusedNode;
    if (targetId && !this.expandedNodes.has(targetId)) {
      return; // Already collapsed
    }
    
    if (targetId) {
      this.expandedNodes.delete(targetId);
      this.el.setContent(this.renderTree());
      this.el.screen.render();
      
      if (this.props.onNodeCollapse) {
        this.props.onNodeCollapse({
          type: 'nodecollapse',
          target: this.el,
          nodeId: targetId,
        });
      }
    }
  }

  toggleNode(nodeId?: string) {
    const targetId = nodeId || this.focusedNode;
    if (targetId) {
      if (this.expandedNodes.has(targetId)) {
        this.collapseNode(targetId);
      } else {
        this.expandNode(targetId);
      }
    }
  }

  expandAll() {
    this.expandAllNodes(this.nodes);
    this.el.setContent(this.renderTree());
    this.el.screen.render();
  }

  collapseAll() {
    this.expandedNodes.clear();
    this.el.setContent(this.renderTree());
    this.el.screen.render();
  }

  selectNode(nodeId: string) {
    this.selectedNode = nodeId;
    this.focusedNode = nodeId;
    this.el.setContent(this.renderTree());
    this.el.screen.render();
    
    if (this.props.onNodeSelect) {
      this.props.onNodeSelect({
        type: 'nodeselect',
        target: this.el,
        nodeId,
        node: this.getNodeById(nodeId),
      });
    }
  }

  // Navigation methods
  navigateUp() {
    const flatNodes = this.getFlatNodes();
    const currentIndex = flatNodes.findIndex(node => node.id === this.focusedNode);
    
    if (currentIndex > 0) {
      this.focusedNode = flatNodes[currentIndex - 1].id;
      this.el.setContent(this.renderTree());
      this.el.screen.render();
    }
  }

  navigateDown() {
    const flatNodes = this.getFlatNodes();
    const currentIndex = flatNodes.findIndex(node => node.id === this.focusedNode);
    
    if (currentIndex < flatNodes.length - 1) {
      this.focusedNode = flatNodes[currentIndex + 1].id;
      this.el.setContent(this.renderTree());
      this.el.screen.render();
    }
  }

  navigateToFirst() {
    if (this.nodes.length > 0) {
      this.focusedNode = this.nodes[0].id;
      this.el.setContent(this.renderTree());
      this.el.screen.render();
    }
  }

  navigateToLast() {
    const flatNodes = this.getFlatNodes();
    if (flatNodes.length > 0) {
      this.focusedNode = flatNodes[flatNodes.length - 1].id;
      this.el.setContent(this.renderTree());
      this.el.screen.render();
    }
  }

  pageUp() {
    // Simple page up implementation
    for (let i = 0; i < 10; i++) {
      this.navigateUp();
    }
  }

  pageDown() {
    // Simple page down implementation
    for (let i = 0; i < 10; i++) {
      this.navigateDown();
    }
  }

  // Utility methods
  private findNodeById(nodes: TreeNode[], id: string): TreeNode | null {
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }
      if (node.children) {
        const found = this.findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  private removeNodeById(nodes: TreeNode[], id: string): boolean {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === id) {
        nodes.splice(i, 1);
        return true;
      }
      if (nodes[i].children) {
        if (this.removeNodeById(nodes[i].children!, id)) {
          return true;
        }
      }
    }
    return false;
  }

  private expandAllNodes(nodes: TreeNode[]) {
    nodes.forEach(node => {
      this.expandedNodes.add(node.id);
      if (node.children) {
        this.expandAllNodes(node.children);
      }
    });
  }

  private getFlatNodes(): TreeNode[] {
    const flat: TreeNode[] = [];
    
    const flatten = (nodes: TreeNode[]) => {
      nodes.forEach(node => {
        flat.push(node);
        if (node.children && this.expandedNodes.has(node.id)) {
          flatten(node.children);
        }
      });
    };
    
    flatten(this.nodes);
    return flat;
  }

  getNodeById(nodeId: string): TreeNode | null {
    return this.findNodeById(this.nodes, nodeId);
  }

  getSelectedNode(): TreeNode | null {
    return this.selectedNode ? this.getNodeById(this.selectedNode) : null;
  }

  getFocusedNode(): TreeNode | null {
    return this.focusedNode ? this.getNodeById(this.focusedNode) : null;
  }

  getExpandedNodes(): string[] {
    return Array.from(this.expandedNodes);
  }

  getVisibleNodes(): TreeNode[] {
    return this.getFlatNodes();
  }

  // Get current configuration
  getConfig() {
    return {
      variant: this.props.variant,
      size: this.props.size,
      state: this.props.state,
      theme: this.theme,
      nodes: this.nodes,
      selectedNode: this.selectedNode,
      focusedNode: this.focusedNode,
      expandedNodes: this.getExpandedNodes(),
      scrollOffset: this.scrollOffset,
    };
  }

  // Tree utility methods
  hasNodes(): boolean {
    return this.nodes.length > 0;
  }

  getNodeCount(): number {
    return this.getFlatNodes().length;
  }

  getDepth(): number {
    const getMaxDepth = (nodes: TreeNode[], currentDepth: number): number => {
      let maxDepth = currentDepth;
      nodes.forEach(node => {
        if (node.children) {
          maxDepth = Math.max(maxDepth, getMaxDepth(node.children, currentDepth + 1));
        }
      });
      return maxDepth;
    };
    
    return getMaxDepth(this.nodes, 1);
  }

  // Update component with new props
  update(newProps: Partial<TreeProps>) {
    const updatedProps = { ...this.props, ...newProps };
    const validationResult = validateComponent('Tree', updatedProps);
    
    if (!validationResult.success) {
      console.error('❌ Tree update validation failed:', validationResult.errors);
      return;
    }

    this.props = validationResult.data;
    this.el.style = TreeStyles.getStyle(this.props);
    
    // Update nodes if changed
    if (newProps.nodes !== undefined) {
      this.setNodes(this.props.nodes || []);
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