import { Widgets } from "blessed";
import {
  ComponentSize,
  ComponentState,
  ComponentVariant,
} from "../types/schemas";
import { BaseProps, Component, createBoxBase } from "./BaseComponent";

export type BadgeProps = BaseProps & {
  text: string;
  variant?: "default" | "success" | "warning" | "destructive" | "info";
};

export class Badge implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private baseComponent: any;
  private props: BadgeProps;

  constructor(props: BadgeProps) {
    this.props = props;

    const comp = createBoxBase<Widgets.BoxElement>(
      {
        ...props,
        height: 1,
        width: "shrink",
        borderStyle: "none",
      },
      "badge"
    );

    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;
    this.baseComponent = comp;

    // Set content after creation
    this.el.setContent(` ${props.text} `);
  }

  // Implement required methods by delegating to base component
  setVariant = (variant: ComponentVariant) =>
    this.baseComponent.setVariant(variant);
  setSize = (size: ComponentSize) => this.baseComponent.setSize(size);
  setState = (state: ComponentState) => this.baseComponent.setState(state);
  getConfig = () => this.baseComponent.getConfig();
  update = (props: Partial<BaseProps>) => this.baseComponent.update(props);

  // Method to set badge text
  setText(text: string) {
    this.props.text = text;
    this.el.setContent(` ${text} `);
    this.el.screen.render();
  }

  // Method to set badge variant
  setBadgeVariant(
    variant: "default" | "success" | "warning" | "destructive" | "info"
  ) {
    this.props.variant = variant;
    this.setVariant(variant as ComponentVariant);
  }

  // Static method to create badge with specific configuration
  static create(props: BadgeProps): Badge {
    return new Badge(props);
  }
}
