import { Widgets } from "blessed";
import { BaseProps, Component, createBoxBase } from "./BaseComponent";

export type TextProps = BaseProps & {
  text: string;
  align?: "left" | "center" | "right";
  wrap?: boolean;
};

export class Text implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private baseComponent: any;

  constructor(props: TextProps) {
    const comp = createBoxBase<Widgets.BoxElement>({ 
      ...props, 
      borderStyle: 'none' 
    }, 'text');

    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;
    this.baseComponent = comp;

    this.el.setContent(props.text);
    // alignment and wrap are not enforced due to typings; content aligns via blessed defaults
  }

  // Implement required methods by delegating to base component
  setVariant = (variant: any) => this.baseComponent.setVariant(variant);
  setSize = (size: any) => this.baseComponent.setSize(size);
  setState = (state: any) => this.baseComponent.setState(state);
  getConfig = () => this.baseComponent.getConfig();
  update = (props: any) => this.baseComponent.update(props);

  // Method to set text content
  setText(text: string) {
    this.el.setContent(text);
    this.el.screen.render();
  }

  // Static method to create text with specific configuration
  static create(props: TextProps): Text {
    return new Text(props);
  }
}
