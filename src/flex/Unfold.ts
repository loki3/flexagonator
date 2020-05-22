namespace Flexagonator {

  // a description of a single triangle in a strip
  export interface Leaf {
    readonly id: number,       // id that's unique across the strip
    readonly top: number,      // folding number on top of leaf
    readonly bottom: number,   // folding number on bottom of leaf
    readonly isClock: boolean, // true -> next leaf connected clockwise
  }

  // unfold a flexagon into a strip of leaves containing information
  // on how to fold it back into the original flexagon
  // optional: for every top-level LeafTree, describe whether to go clockwise
  //    or counterclockwise to get to the next pat
  export function unfold(tree: LeafTree[], directions?: boolean[]): Leaf[] | TreeError {
    if (typeof (tree) === "number") {
      return { reason: TreeCode.TooFewPats, context: tree };
    }

    // tracking the next number to assign leaves as they're unfolded
    let next = 3;
    const getNext = () => { return next++; };

    const foldpats = toFoldPats(tree, directions);
    const resultFoldpats = unfoldAll(foldpats, getNext);
    return toLeaves(resultFoldpats);
  }


  // several leaves folded together, with information
  // about how this pat is related to other pats
  interface FoldPat {
    pat: LeafTree,
    numbers: number[],
    isClock: boolean,
  }


  //----- conversion routines

  function toFoldPats(tree: LeafTree[], directions?: boolean[]): FoldPat[] {
    // note: if !directions, this assumes that all the triangles meet in the middle.
    // if you want to unfold a different arrangement, change the
    //   the direction (isClock) of the appropriate pats by passing in 'directions'
    const foldpats = tree.map((pat) => { return { pat: pat, numbers: [1, 2], isClock: true } });
    if (!directions || tree.length !== directions.length) {
      return foldpats;
    }
    return foldpats.map((pat, i) => { return { ...pat, isClock: directions[i] } });
  }

  function toLeaves(foldpats: FoldPat[]): Leaf[] {
    const toLeaf = (foldpat: FoldPat) => {
      return { id: getTop(foldpat.pat), top: foldpat.numbers[0], bottom: foldpat.numbers[1], isClock: foldpat.isClock };
    }
    const leaves = foldpats.map(toLeaf);
    return leaves;
  }


  //----- unfolding routines

  function over(tree: LeafTree): LeafTree {
    return (Array.isArray(tree)) ? [over(tree[1]), over(tree[0])] : -tree;
  }

  function flip(foldpat: FoldPat): FoldPat {
    return { pat: over(foldpat.pat), numbers: foldpat.numbers.reverse(), isClock: !foldpat.isClock };
  }

  function unfoldOne(foldpat: FoldPat, getNext: () => number): FoldPat[] {
    const p1 = (<any[]>foldpat.pat)[0];
    const p2 = (<any[]>foldpat.pat)[1];
    const n1 = foldpat.numbers[0];
    const n2 = foldpat.numbers[1];
    const next = getNext();
    if (foldpat.isClock) {
      const a = { pat: p2, numbers: [next, n2], isClock: false };
      const b = { pat: over(p1), numbers: [next, n1], isClock: true };
      return [a, b];
    } else {
      const a = { pat: p1, numbers: [n1, next], isClock: true };
      const b = { pat: over(p2), numbers: [n2, next], isClock: false };
      return [a, b];
    }
  }

  function flatten(fp: (FoldPat | FoldPat[])[]): FoldPat[] {
    const foldpats: FoldPat[] = [];
    for (let item of fp) {
      if (Array.isArray(item)) {
        foldpats.push(item[0]);
        foldpats.push(item[1]);
      } else {
        foldpats.push(item);
      }
    }
    return foldpats;
  }

  function unfoldAt(foldpats: FoldPat[], hinge: number, getNext: () => number): FoldPat[] {
    const f = (foldpat: FoldPat, i: number): FoldPat | FoldPat[] => {
      if (i < hinge) {
        return foldpat;
      } else if (i === hinge) {
        return unfoldOne(foldpat, getNext);
      } else {
        return flip(foldpat);
      }
    }
    const fp = foldpats.map(f);
    return flatten(fp);
  }

  function findNextHinge(foldpats: FoldPat[]): number | null {
    for (let i in foldpats) {
      if (Array.isArray(foldpats[i].pat)) {
        return Number.parseInt(i);
      }
    }
    return null;
  }

  function unfoldAll(foldpats: FoldPat[], getNext: () => number): FoldPat[] {
    let hinge = findNextHinge(foldpats);
    while (hinge !== null) {
      foldpats = unfoldAt(foldpats, hinge, getNext);
      hinge = findNextHinge(foldpats);
    }
    return foldpats;
  }

}
