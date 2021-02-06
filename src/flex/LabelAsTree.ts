namespace Flexagonator {

  /**
   * Label the sides of the leaves in each pat by doing a breadth first traversal
   * of the binary tree of leaves.
   * - The front and back are labeled 1 & 2, using color[0] & color[1] if present.
   * - If there's an even number of pats, the odd pats are assigned odd numbers & colors
   *   (from 3 on), while the even pats are assigned even numbers & colors (from 4 on).
   *   Leaf sides that are folded together are assigned the same number.
   * - If there's an odd number of pats, every pat uses the same numbering scheme.
   *   Leaf sides that are folded together are assigned consecutive numbers.
   * @param flexagon the flexagon to label
   * @param colors optional array of colors to apply corresponding where in the traversal we are
   */
  export function labelAsTree(flexagon: Flexagon, colors?: number[]): PropertiesForLeaves {
    const props = new PropertiesForLeaves();
    labelOutside(props, flexagon, colors);
    labelInsides(props, flexagon, colors);
    return props;
  }

  function labelOutside(props: PropertiesForLeaves, flexagon: Flexagon, colors?: number[]): void {
    const top = flexagon.getTopIds();
    top.forEach(id => apply(props, id, 1, colors));
    const bottom = flexagon.getBottomIds();
    bottom.forEach(id => apply(props, id, 2, colors));
  }

  function labelInsides(props: PropertiesForLeaves, flexagon: Flexagon, colors?: number[]): void {
    const pats = flexagon.pats;
    if (pats.length % 2 === 0) {
      pats.forEach((pat, i) => handlePatFromEven(props, pat, i, colors));
    } else {
      pats.forEach((pat, i) => handlePatFromOdd(props, pat, i, colors));
    }
  }

  function handlePatFromEven(props: PropertiesForLeaves, pat: Pat, whichPat: number, colors?: number[]): void {
    const unfold = pat.unfold();
    if (unfold === null) {
      return;
    }
    const n = (whichPat % 2 === 0) ? 1 : 2;
    let start = 2;
    apply(props, unfold[0].getTop(), start + n, colors);
    apply(props, unfold[1].getTop(), start + n, colors);

    let level: (Pat | null)[] = unfold;
    while (true) {
      start *= 2;
      const next = level.map(p => p === null ? null : p.unfold());
      next.forEach((pair, i) => {
        if (pair !== null) {
          apply(props, pair[0].getTop(), start + n + i * 2, colors);
          apply(props, pair[1].getTop(), start + n + i * 2, colors);
        }
      });
      if (!next.some(e => e !== null)) {
        return;
      }
      level = flatten(next);
    }
  }

  function handlePatFromOdd(props: PropertiesForLeaves, pat: Pat, whichPat: number, colors?: number[]): void {
    const unfold = pat.unfold();
    if (unfold === null) {
      return;
    }
    let start = 2;
    apply(props, unfold[0].getTop(), start + 1, colors);
    apply(props, unfold[1].getTop(), start + 2, colors);

    let level: (Pat | null)[] = unfold;
    while (true) {
      start *= 2;
      const next = level.map(p => p === null ? null : p.unfold());
      next.forEach((pair, i) => {
        if (pair !== null) {
          apply(props, pair[0].getTop(), start + 1 + i * 2, colors);
          apply(props, pair[1].getTop(), start + 2 + i * 2, colors);
        }
      });
      if (!next.some(e => e !== null)) {
        return;
      }
      level = flatten(next);
    }
  }

  // set the leaf side identified by 'id' to lable 'n' & colors[n-1]
  function apply(props: PropertiesForLeaves, id: number, n: number, colors?: number[]): void {
    props.setLabelProp(id, n.toString());
    if (colors && colors[n - 1]) {
      props.setColorProp(id, colors[n - 1])
    }
  }

  function flatten(array: ([Pat, Pat] | null)[]): (Pat | null)[] {
    const results: (Pat | null)[] = [];
    array.forEach(e => {
      if (e === null) {
        results.push(null);
        results.push(null);
      } else {
        results.push(e[0]);
        results.push(e[1]);
      }
    });
    return results;
  }
}
