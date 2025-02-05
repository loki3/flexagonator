namespace Flexagonator {

  /**
   * search through a collection of flexagons for any that have a rearranged version of a given pat
   * @returns the indices of any matching flexagons
   */
  export function findRearrangements(flexagons: Flexagon[], leafTree: LeafTree): number[] | TreeError {
    const pat = makePat(leafTree);
    if (isError(pat)) {
      return pat;
    }
    const flipped = pat.makeFlipped();
    const patIds = getSortedIds(pat);
    const leafCount = patIds.length;

    const found: number[] = [];
    for (let i = 0; i < flexagons.length; i++) {
      const flexagon = flexagons[i];
      for (const thisPat of flexagon.pats) {
        if (leafCount === thisPat.getLeafCount() && !pat.isEqual(thisPat) && !flipped.isEqual(thisPat)) {
          const thisIds = getSortedIds(thisPat);
          if (patIds.every((v, j) => thisIds[j] === v)) {
            found.push(i);
            continue;
          }
        }
      }
    }
    return found;
  }

  /** get a sorted list of all leaf ids in the given pat */
  function getSortedIds(pat: Pat): number[] {
    const ids: number[] = getIds(pat.getAsLeafTree());
    return ids.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
  }

  /** get a list of all positive ids in this LeafTree */
  function getIds(tree: LeafTree): number[] {
    if (typeof (tree) === "number") {
      return [Math.abs(tree)];
    }
    if (Array.isArray(tree) && tree.length === 2) {
      const ids1 = getIds(tree[0]);
      const ids2 = getIds(tree[1]);
      return ids1.concat(ids2);
    }
    return [];
  }
}
