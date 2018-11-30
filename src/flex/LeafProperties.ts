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

    setUnsetLabelProp(id: number, label: string): boolean {
      const props = this.getFacePropsToSet(id);
      if (props.label === undefined) {
        props.label = label;
        return true;
      }
      return false;
    }

    setColorProp(id: number, color: number) {
      const props = this.getFacePropsToSet(id);
      props.color = color;
    }

    setUnsetColorProp(id: number, color: number): boolean {
      const props = this.getFacePropsToSet(id);
      if (props.color === undefined) {
        props.color = color;
        return true;
      }
      return false;
    }

    getFaceLabel(id: number): string | undefined {
      const props = this.getFacePropsToGet(id);
      if (props !== undefined && props.label !== undefined) {
        return props.label;
      }
      return undefined;
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

    // move properties to a different id based on how a leaf was split
    adjustForSplit(split: Split) {
      const idToRemove = -split.topId;
      const oldprops = this.getFacePropsToGet(idToRemove);
      if (oldprops === undefined) {
        return;
      }

      const idToAdd = split.bottomId;
      const newprops = this.getFacePropsToSet(idToAdd);
      newprops.color = oldprops.color;
      newprops.label = oldprops.label;

      oldprops.color = undefined;
      oldprops.label = undefined;
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
