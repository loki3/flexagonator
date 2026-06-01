namespace Flexagonator {

  /**
   * find all the possible straight templates with 1 or 2 leaf pats for a given flexagon shape
   * assuming the leaves are equilateral triangles
   */
  export function findStraight(directions: Directions): number[][] {
    const len = directions.getCount();
    let ts: number[] = [];
    for (let i = 0; i < len; i++) {
      ts.push(1);
    }

    const results: number[][] = [];
    const total = Math.pow(2, len);
    for (let i = 0; i < total; i++) {
      const current = i === 0 ? ts : addOne(ts, len);
      if (checkStraight(directions, current)) {
        results.push(current);
      }
      ts = current;
    }
    return results;
  }

  /**
   * check to see if the given pat structure unfolds to a straight template of equilateral triangles
   */
  function checkStraight(
    directions: Directions, /** pat directions for folded flexagon */
    thicknesses: number[], /** array of 1's & 2's representing pat thicknesses */
  ): boolean {
    let id = 1;
    const tree: LeafTree[] = thicknesses.map(t => t === 1 ? id++ : [id++, id++]);
    const unfolded = unfold(tree, directions);
    if (isTreeError(unfolded)) {
      return false;
    }
    const first = unfolded[0].isClock;
    // if it alternates directions, it's straight
    return unfolded.every((leaf, i) => i % 2 === 0 ? leaf.isClock === first : leaf.isClock !== first);
  }

  /** treat the array of numbers like binary digits (0,1) & add 1 */
  function addOne(ts: number[], len: number): number[] {
    const sum: number[] = [];
    let carry = true;
    for (let i = len - 1; i >= 0; i--) {
      const d = ts[i];
      if (carry && d === 2) {
        sum[i] = 1;
      } else if (carry && d === 1) {
        sum[i] = 2;
        carry = false;
      } else {
        sum[i] = d;
      }
    }
    return sum;
  }

}
