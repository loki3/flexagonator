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
    const resultFoldpats = unfoldAll(foldpats);
    return toLeaves(resultFoldpats);
  }

  interface FoldPat {
    pat: LeafTree,
    numbers: number[],
    isClock: boolean,
    next: any
  }


  //----- conversion routines

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


  //----- unfolding routines

  function over(tree: LeafTree): LeafTree {
    return (Array.isArray(tree)) ? [over(tree[0]), over(tree[1])] : -tree;
  }

  function flip(foldpat: FoldPat): FoldPat {
    if (Array.isArray(foldpat.numbers)) {
      return { pat: over(foldpat.pat), numbers: foldpat.numbers.reverse(), isClock: !foldpat.isClock, next: foldpat.next };
    }
    console.log("not done");
    return foldpat;
  }

  function unfoldOne(foldpat: FoldPat): FoldPat[] {
    const p1 = (<any[]>foldpat.pat)[0];
    const p2 = (<any[]>foldpat.pat)[1];
    const n1 = foldpat.numbers[0];
    const n2 = foldpat.numbers[1];
    const next = foldpat.next();
    if (foldpat.isClock) {
      const a = { pat: p2, numbers: [next, n2], isClock: false, next: foldpat.next };
      const b = { pat: over(p1), numbers: [next, n1], isClock: true, next: foldpat.next };
      return [a, b];
    } else {
      const a = { pat: p1, numbers: [n1, next], isClock: true, next: foldpat.next };
      const b = { pat: over(p2), numbers: [n2, next], isClock: false, next: foldpat.next };
      return [a, b];
    }
  }

  function flatten(fp: (FoldPat | FoldPat[])[]): FoldPat[] {
    var foldpats: FoldPat[] = [];
    for (var item of fp) {
      if (Array.isArray(item)) {
        foldpats.push(item[0]);
        foldpats.push(item[1]);
      } else {
        foldpats.push(item);
      }
    }
    return foldpats;
  }

  function unfoldAt(foldpats: FoldPat[], hinge: number): FoldPat[] {
    const f = (foldpat: FoldPat, i: number): FoldPat | FoldPat[] => {
      if (i < hinge) {
        return foldpat;
      } else if (i === hinge) {
        return unfoldOne(foldpat);
      } else {
        return flip(foldpat);
      }
    }
    const fp = foldpats.map(f);
    return flatten(fp);
  }

  function findNextHinge(foldpats: FoldPat[]): number | null {
    for (var i in foldpats) {
      if (Array.isArray(foldpats[i].pat)) {
        return Number.parseInt(i);
      }
    }
    return null;
  }

  function unfoldAll(foldpats: FoldPat[]): FoldPat[] {
    var hinge = findNextHinge(foldpats);
    while (hinge !== null) {
      foldpats = unfoldAt(foldpats, hinge);
      hinge = findNextHinge(foldpats);
    }
    return foldpats;
  }

}
