namespace Flexagonator {

  // properties of one side of a single leaf
  export interface LeafFaceProperties {
    label?: string,
    color?: number
  }

  // properties for a single leaf
  export interface LeafProperties {
    front: LeafFaceProperties,
    back: LeafFaceProperties
  }

  export class PropertiesForLeaves {
    private props: LeafProperties[];

    constructor(props?: LeafProperties[]) {
      this.props = props === undefined ? [] : props;
    }

    setLabelProp(id: number, label: string) {
      const front = id > 0;
      id = Math.abs(id) - 1;
      if (this.props[id] === undefined) {
        const newProp = { label: label };
        this.props[id] = { front: (front ? newProp : {}), back: (front ? {} : newProp) };
      } else if (front) {
        this.props[id].front.label = label;
      } else {
        this.props[id].back.label = label;
      }
    }

    setColorProp(id: number, color: number) {
      const front = id > 0;
      id = Math.abs(id) - 1;
      if (this.props[id] === undefined) {
        const newProp = { color: color };
        this.props[id] = { front: (front ? newProp : {}), back: (front ? {} : newProp) };
      } else if (front) {
        this.props[id].front.color = color;
      } else {
        this.props[id].back.color = color;
      }
    }

    getColorProp(id: number): number | undefined {
      const leafProps = this.props[Math.abs(id) - 1]
      if (leafProps === undefined) {
        return undefined;
      }
      const faceProps = id > 0 ? leafProps.front : leafProps.back;
      return faceProps.color;
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

    getFaceLabel(id: number): string {
      const leafProps = this.props[Math.abs(id) - 1];
      if (leafProps !== undefined) {
        const label = id > 0 ? leafProps.front.label : leafProps.back.label;
        if (label !== undefined) {
          return label;
        }
      }
      return id.toString();
    }
  }

}
