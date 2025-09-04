import { Widgets } from 'blessed';
import { BaseProps, Component, createBoxBase } from './BaseComponent';
import { ZodBoxProps, BoxSchema } from '../types/component-schemas';
import { validateComponent } from '../validation/component-validator';

export type BoxProps = BaseProps & {
  content?: string;
};

export class Box implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private baseComponent: any;

  constructor(props: BoxProps) {
    // Validate props using Zod schema
    const validation = validateComponent('box', props);
    if (!validation.success) {
      console.error('Invalid box props:', validation.errors?.issues);
      throw new Error(`Invalid box props: ${validation.errors?.issues.map(i => i.message).join(', ')}`);
    }
    
    const comp = createBoxBase<Widgets.BoxElement>({
      ...props,
    }, 'box');

    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;
    this.baseComponent = comp;

    if (props.content) this.el.setContent(props.content);
  }

  // Implement required methods by delegating to base component
  setVariant = (variant: any) => this.baseComponent.setVariant(variant);
  setSize = (size: any) => this.baseComponent.setSize(size);
  setState = (state: any) => this.baseComponent.setState(state);
  getConfig = () => this.baseComponent.getConfig();
  update = (props: any) => this.baseComponent.update(props);

  // Method to set content
  setContent(content: string) {
    this.el.setContent(content);
    this.el.screen.render();
  }

  // Static method to create box with specific configuration
  static create(props: BoxProps): Box {
    return new Box(props);
  }
}


