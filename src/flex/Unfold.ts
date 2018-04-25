namespace Flexagonator {

  // a description of a single triangle in a strip
  export interface Leaf {
    id: number,       // id that's unique across the strip
    top: number,      // folding number on top of leaf
    bottom: number,   // folding number on bottom of leaf
    isClock: boolean, // true -> next leaf connected clockwise
  }

  // unfold a flexagon into a strip of leaves containing information
  // on how to fold it back into the original flexagon
  export function unfold(tree: LeafTree[]): Leaf[] | TreeError {
    if (typeof (tree) === "number") {
      return { reason: TreeCode.TooFewPats, context: tree };
    }

    const foldpats = toFoldPats(tree);
    return toLeaves(foldpats);
  }

  interface FoldPat {
    pat: LeafTree,
    numbers: number[],
    isClock: boolean,
    next: any
  }

  function toFoldPats(tree: LeafTree[]): FoldPat[] {
    var next = 3;
    const getNext = () => { return next++; };

    // note: this assumes that all the triangles meet in the middle.
    // if you want to unfold a different arrangement, change the
    //   the direction (isClock) of the appropriate pats
    const foldpats = tree.map((pat) => { return { pat: pat, numbers: [1, 2], isClock: true, next: getNext } });
    return foldpats;
  }

  function toLeaves(foldpats: FoldPat[]): Leaf[] {
    const toLeaf = (foldpat: FoldPat) => {
      return { id: getTop(foldpat.pat), top: foldpat.numbers[0], bottom: foldpat.numbers[1], isClock: foldpat.isClock };
    }
    const leaves = foldpats.map(toLeaf);
    return leaves;
  }
}
