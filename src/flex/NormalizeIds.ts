namespace Flexagonator {
  /**
   * Generate new leaf ids so that, when unfolded, the ids appear in order.
   * (Leaf ids may have been numbered as they were created, which can feel random.)
   */
  export function normalizeIds(pats: Pat[]): Pat[] {
    const leafTree = pats.map(p => p.getAsLeafTree());
    const unfolded = unfold(leafTree);
    if (isTreeError(unfolded)) {
      return pats;
    }
    // this gives us the leaves in order, using the original ids
    const leaves = unfolded.map(leaf => leaf.id);
    // map original id to ordered id
    // e.g., leaves of [2,-3,-1] => {2:1, 3:-2, 1:-3}
    const map: Record<number, number> = {};
    leaves.forEach((original, i) => map[Math.abs(original)] = (i + 1) * Math.sign(original));
    return pats.map(p => p.remap(map));
  }
}
