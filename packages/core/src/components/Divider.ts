import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from './BaseComponent';

export type DividerProps = BaseProps & { 
  char?: string; 
};

export class Divider implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private baseComponent: any;

  constructor(props: DividerProps) {
    const comp = createBoxBase<Widgets.BoxElement>({ 
      ...props, 
      borderStyle: 'none', 
      height: 1 
    }, 'divider');

    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;
    this.baseComponent = comp;

    const width = typeof props.width === 'number' ? props.width : 50;
    const ch = props.char || '─';
    this.el.setContent(ch.repeat(Math.max(1, width - 2)));
  }

  // Implement required methods by delegating to base component
  setVariant = (variant: any) => this.baseComponent.setVariant(variant);
  setSize = (size: any) => this.baseComponent.setSize(size);
  setState = (state: any) => this.baseComponent.setState(state);
  getConfig = () => this.baseComponent.getConfig();
  update = (props: any) => this.baseComponent.update(props);

  // Method to set divider character
  setChar(char: string) {
    const width = typeof this.el.width === 'number' ? this.el.width : 50;
    this.el.setContent(char.repeat(Math.max(1, width - 2)));
    this.el.screen.render();
  }

  // Static method to create divider with specific configuration
  static create(props: DividerProps): Divider {
    return new Divider(props);
  }
}


