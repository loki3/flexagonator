namespace Flexagonator {

  // properties of one side of a single leaf
  export interface LeafFaceProperties {
    label?: string,
    color?: number
  }

  // properties for a single leaf
  export interface LeafProperties {
    readonly front: LeafFaceProperties,
    readonly back: LeafFaceProperties
  }

  export class PropertiesForLeaves {
    private props: LeafProperties[];

    constructor(props?: LeafProperties[]) {
      this.props = props === undefined ? [] : props;
    }

    reset() {
      this.props = [];
    }

    getRawProps(): LeafProperties[] {
      return this.props;
    }

    setLabelProp(id: number, label: string) {
      const props = this.getFacePropsToSet(id);
      props.label = label;
    }

    setUnsetLabelProp(id: number, label: string) {
      const props = this.getFacePropsToSet(id);
      if (props.label === undefined) {
        props.label = label;
      }
    }

    setColorProp(id: number, color: number) {
      const props = this.getFacePropsToSet(id);
      props.color = color;
    }

    setUnsetColorProp(id: number, color: number) {
      const props = this.getFacePropsToSet(id);
      if (props.color === undefined) {
        props.color = color;
      }
    }

    getFaceLabel(id: number): string {
      const props = this.getFacePropsToGet(id);
      if (props !== undefined && props.label !== undefined) {
        return props.label;
      }
      return id.toString();
    }

    getColorProp(id: number): number | undefined {
      const props = this.getFacePropsToGet(id);
      if (props === undefined) {
        return props;
      }
      return props.color;
    }

    getColorAsRGBString(id: number): string | undefined {
      const color = this.getColorProp(id);
      if (color === undefined) {
        return color;
      }
      return "rgb("
        + ((color & 0xff0000) >> 16).toString() + ","
        + ((color & 0xff00) >> 8).toString() + ","
        + (color & 0xff).toString() + ")";
    }

    private getFacePropsToGet(id: number): LeafFaceProperties | undefined {
      const leafProps = this.props[Math.abs(id) - 1]
      if (leafProps === undefined || leafProps === null) {
        return undefined;
      }
      return id > 0 ? leafProps.front : leafProps.back;
    }

    private getFacePropsToSet(id: number): LeafFaceProperties {
      const front = id > 0;
      id = Math.abs(id) - 1;
      if (this.props[id] === undefined) {
        this.props[id] = { front: {}, back: {} };
      }
      return front ? this.props[id].front : this.props[id].back;
    }
  }

}
