namespace Flexagonator {

  // properties of one face of a single leaf
  export interface LeafFaceProperties {
    label?: string,
    color?: number
  }

  // properties for a single leaf
  export interface LeafProperties {
    readonly front: LeafFaceProperties,
    readonly back: LeafFaceProperties
  }

  /**
   * convert an array of labels (e.g., [[1,2],[3,4],[5,6]]) to LeafProperties,
   * optionally adding in colors (e.g., [0xff0000,0x0000ff]) indexed to numeric labels
   */
  export function convertLeafProps(labels: (string | number)[][], repeat?: number, colors?: number[]): LeafProperties[] {
    let numbers: (string | number)[][] = labels;
    if (repeat) {
      for (let i = 1; i < repeat; i++) {
        numbers = numbers.concat(labels);
      }
    }
    const leafProps = numbers.map(pair => {
      if (colors && typeof pair[0] === 'number' && typeof pair[1] === 'number') {
        const front = pair[0] as number;
        const back = pair[1] as number;
        return { front: { label: front.toString(), color: colors[front - 1] }, back: { label: back.toString(), color: colors[back - 1] } };
      } else {
        return { front: { label: pair[0].toString() }, back: { label: pair[1].toString() } };
      }
    });
    return leafProps;
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
    adjustForSplit(topId: number, bottomId: number) {
      const idToRemove = -topId;
      const oldprops = this.getFacePropsToGet(idToRemove);
      if (oldprops === undefined) {
        return;
      }

      const idToAdd = bottomId;
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
