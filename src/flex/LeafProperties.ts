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

  export function setLabelProp(props: LeafProperties[], id: number, label: string) {
    const front = id > 0;
    id = Math.abs(id) - 1;
    if (props[id] === undefined) {
      const newProp = { label: label };
      props[id] = { front: (front ? newProp : {}), back: (front ? {} : newProp) };
    } else if (front) {
      props[id].front.label = label;
    } else {
      props[id].back.label = label;
    }
  }

  export function setColorProp(props: LeafProperties[], id: number, color: number) {
    const front = id > 0;
    id = Math.abs(id) - 1;
    if (props[id] === undefined) {
      const newProp = { color: color };
      props[id] = { front: (front ? newProp : {}), back: (front ? {} : newProp) };
    } else if (front) {
      props[id].front.color = color;
    } else {
      props[id].back.color = color;
    }
  }

}
