import { Widgets } from "blessed";
import {
  ComponentSize,
  ComponentState,
  ComponentVariant,
} from "../types/schemas";
import { BaseProps, Component, createBoxBase } from "./BaseComponent";

export type BreadcrumbProps = BaseProps & {
  segments: string[];
  separator?: string;
};

export class Breadcrumb implements Component<Widgets.BoxElement> {
  el: Widgets.BoxElement;
  theme: any;
  destroy: () => void;
  private baseComponent: any;
  private props: BreadcrumbProps;

  constructor(props: BreadcrumbProps) {
    this.props = props;

    const comp = createBoxBase<Widgets.BoxElement>(
      {
        ...props,
        borderStyle: "none",
        height: 1,
      },
      "breadcrumb"
    );

    this.el = comp.el;
    this.theme = comp.theme;
    this.destroy = comp.destroy;
    this.baseComponent = comp;

    this.setSegments(props.segments);
  }

  // Implement required methods by delegating to base component
  setVariant = (variant: ComponentVariant) =>
    this.baseComponent.setVariant(variant);
  setSize = (size: ComponentSize) => this.baseComponent.setSize(size);
  setState = (state: ComponentState) => this.baseComponent.setState(state);
  getConfig = () => this.baseComponent.getConfig();
  update = (props: Partial<BaseProps>) => this.baseComponent.update(props);

  setSegments(segments: string[]) {
    this.props.segments = segments;
    const separator = this.props.separator || " › ";
    this.el.setContent(segments.join(separator));
    this.el.screen.render();
  }

  // Method to add segment
  addSegment(segment: string) {
    this.props.segments.push(segment);
    this.setSegments(this.props.segments);
  }

  // Method to remove last segment
  removeLastSegment() {
    this.props.segments.pop();
    this.setSegments(this.props.segments);
  }

  // Method to clear all segments
  clearSegments() {
    this.props.segments = [];
    this.setSegments(this.props.segments);
  }

  // Static method to create breadcrumb with specific configuration
  static create(props: BreadcrumbProps): Breadcrumb {
    return new Breadcrumb(props);
  }
}
