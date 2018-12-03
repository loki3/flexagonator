namespace Flexagonator {

  // label & color new leaves by interpolating between the values on the old leaves
  export function interpolateLeaves(pat: Pat, props: PropertiesForLeaves, doLabels?: boolean) {
    // e.g. when from 'a' to [a,b], where each letter is an id and has top & bottom properties
    // {top,bottom} -> [{top,(top+bottom)/2}, {(top+bottom)/2,bottom}]
    // {a,b} -> [{a,(a+b)/2}, {(a+b)/2,b}]
    const oldId = pat.getTop();

    if (doLabels) {
      const topLabel = getLabelAsNumber(props, oldId);
      const bottomLabel = getLabelAsNumber(props, -oldId);
      if (topLabel !== undefined && bottomLabel !== undefined) {
        recurse(topLabel, bottomLabel, pat.getAsLeafTree(),
          (id: number, v: number) => props.setLabelProp(id, v.toString()));
      }
    }

    const topColor = props.getColorProp(oldId);
    const bottomColor = props.getColorProp(-oldId);
    if (topColor !== undefined && bottomColor !== undefined) {
      recurse(topColor, bottomColor, pat.getAsLeafTree(),
        (id: number, v: number) => props.setColorProp(id, v));
    }
  }

  function recurse(a: number, b: number, tree: LeafTree, set: (id: number, v: number) => void): void {
    if (typeof tree === 'number') {
      const id = tree;
      set(id, a);
      set(-id, b);
      return;
    }

    const mid = (a + b) / 2;
    recurse(a, mid, tree[0], set);
    recurse(mid, b, tree[1], set);
  }

  function getLabelAsNumber(props: PropertiesForLeaves, id: number): number | undefined {
    const label = props.getFaceLabel(id);
    return label === undefined ? undefined : Number.parseFloat(label);
  }
}
