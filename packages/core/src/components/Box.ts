import { Widgets } from "blessed";
import { z } from "zod";
import { BoxSchema } from "../types/component-schemas";
import { Component, createBoxBase } from "./BaseComponent";
import { safeRender } from "../terminal/useTerminal";

export type BoxProps = z.infer<typeof BoxSchema>;

export class Box implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private baseComponent: any;

  constructor(props: BoxProps) {
    const comp = createBoxBase<Widgets.BoxElement>(
      {
        ...props,
      },
      "box"
    );

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
    safeRender(this.el.screen);
  }

  // Static method to create box with specific configuration
  static create(props: BoxProps): Box {
    return new Box(props);
  }
}
