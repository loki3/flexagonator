namespace Flexagonator {

  /**
   * Label the sides of the leaves in each pat by doing a breadth first traversal
   * of the binary tree of leaves.
   * - The front and back are labeled 1 & 2, using color[0] & color[1] if present.
   * - If there's an even number of pats, the odd pats and even pats are assigned
   *   different sets of numbers & colors.
   *   Leaf faces that are folded together are assigned the same number.
   * - If there's an odd number of pats, every pat uses the same numbering scheme.
   *   Leaf faces that are folded together are assigned consecutive numbers.
   * @param flexagon the flexagon to label
   * @param colors optional array of colors to apply corresponding where in the traversal we are
   */
  export function labelAsTree(flexagon: Flexagon, colors?: number[]): PropertiesForLeaves {
    const leafToLabel: number[] = [];  // leaf number -> label number
    labelOutside(leafToLabel, flexagon);
    labelInsides(leafToLabel, flexagon);
    // note: we get rid of any gaps in the label numbers we created, which is generally nicer,
    // but we could decide to skip this step if we want consistency across different flexagons.
    const squished = squishNumbers(leafToLabel);
    return createLeafProps(squished, colors);
  }

  function labelOutside(leafToLabel: number[], flexagon: Flexagon): void {
    const top = flexagon.getTopIds();
    top.forEach(id => leafToLabel[id] = 1);
    const bottom = flexagon.getBottomIds();
    bottom.forEach(id => leafToLabel[id] = 2);
  }

  function labelInsides(leafToLabel: number[], flexagon: Flexagon): void {
    const pats = flexagon.pats;
    if (pats.length % 2 === 0) {
      pats.forEach((pat, i) => handlePatFromEven(leafToLabel, pat, i));
    } else {
      pats.forEach((pat, i) => handlePatFromOdd(leafToLabel, pat));
    }
  }

  function handlePatFromEven(leafToLabel: number[], pat: Pat, whichPat: number): void {
    const unfold = pat.unfold();
    if (unfold === null) {
      return;
    }
    const n = (whichPat % 2 === 0) ? 1 : 2;
    let start = 2;
    leafToLabel[unfold[0].getTop()] = start + n;
    leafToLabel[unfold[1].getTop()] = start + n;

    let level: (Pat | null)[] = unfold;
    while (true) {
      start *= 2;
      const next = level.map(p => p === null ? null : p.unfold());
      next.forEach((pair, i) => {
        if (pair !== null) {
          leafToLabel[pair[0].getTop()] = start + n + i * 2;
          leafToLabel[pair[1].getTop()] = start + n + i * 2;
        }
      });
      if (!next.some(e => e !== null)) {
        return;
      }
      level = flatten(next);
    }
  }

  function handlePatFromOdd(leafToLabel: number[], pat: Pat): void {
    const unfold = pat.unfold();
    if (unfold === null) {
      return;
    }
    let start = 2;
    leafToLabel[unfold[0].getTop()] = start + 1;
    leafToLabel[unfold[1].getTop()] = start + 2;

    let level: (Pat | null)[] = unfold;
    while (true) {
      start *= 2;
      const next = level.map(p => p === null ? null : p.unfold());
      next.forEach((pair, i) => {
        if (pair !== null) {
          leafToLabel[pair[0].getTop()] = start + 1 + i * 2;
          leafToLabel[pair[1].getTop()] = start + 2 + i * 2;
        }
      });
      if (!next.some(e => e !== null)) {
        return;
      }
      level = flatten(next);
    }
  }

  // assign labels & colors to all leaf faces
  function createLeafProps(leafToLabel: number[], colors?: number[]): PropertiesForLeaves {
    const props = new PropertiesForLeaves();
    Object.keys(leafToLabel).forEach(a => {
      const id = Number.parseInt(a);
      const n = leafToLabel[id];
      // set the leaf side identified by 'id' to label 'n' & colors[n-1]
      props.setLabelProp(id, n.toString());
      if (colors && colors[n - 1]) {
        props.setColorProp(id, colors[n - 1])
      }
    });
    return props;
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

  // get rid of gaps in the labels
  function squishNumbers(leafToLabel: number[]): number[] {
    const hasLabel: boolean[] = collectAllLabels(leafToLabel);
    if (!hasGap(hasLabel)) {
      return leafToLabel;
    }
    const oldToNew: number[] = mapOldLabelsToNewLabels(hasLabel);
    return mapLeafNumbersToSquishedNumbers(leafToLabel, oldToNew);;
  }

  function collectAllLabels(leafToLabel: number[]): boolean[] {
    const hasLabel: boolean[] = [];
    Object.keys(leafToLabel).forEach(k => {
      const id = Number.parseInt(k);
      hasLabel[leafToLabel[id]] = true;
    });
    return hasLabel;
  }

  function hasGap(hasLabel: boolean[]): boolean {
    // note that [0] is always empty, so we ignore it
    for (let i = 1; i < hasLabel.length; i++) {
      if (!hasLabel[i]) {
        return true;
      }
    }
    return false;
  }

  function mapOldLabelsToNewLabels(hasLabel: boolean[]): number[] {
    const oldToNew: number[] = [];
    let current = 1;
    for (let i = 1; i < hasLabel.length; i++) {
      if (hasLabel[i]) {
        oldToNew[i] = current++;
      }
    }
    return oldToNew;
  }

  function mapLeafNumbersToSquishedNumbers(leafToLabel: number[], oldToNew: number[]): number[] {
    const newLeafToLabel: number[] = [];
    Object.keys(leafToLabel).forEach(k => {
      const id = Number.parseInt(k);
      newLeafToLabel[id] = oldToNew[leafToLabel[id]];
    });
    return newLeafToLabel;
  }
}
