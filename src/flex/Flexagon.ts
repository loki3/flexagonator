namespace Flexagonator {

  export function makeFlexagon(trees: LeafTree[]): Flexagon | TreeError {
    if (trees.length < 2) {
      return { reason: TreeCode.TooFewPats, context: trees };
    }
    var pats: Pat[] = [];
    for (var tree of trees) {
      const pat = makePat(tree);
      if (isTreeError(pat)) {
        return pat;
      }
      pats.push(pat);
    }
    return new Flexagon(pats);
  }

  /*
    Manages the pats in a flexagon
  */
  export class Flexagon {
    constructor(private readonly pats: Pat[]) {
    }

    getPatCount(): number {
      return this.pats.length;
    }

    getAsLeafTrees(): LeafTree[] {
      var trees: LeafTree[] = [];
      for (var pat of this.pats) {
        const tree: LeafTree = pat.getAsLeafTree();
        trees.push(tree);
      }
      return trees;
    }

    getTopIds(): number[] {
      var ids: number[] = [];
      for (var pat of this.pats) {
        ids.push(pat.getTop());
      }
      return ids;
    }

    getBottomIds(): number[] {
      var ids: number[] = [];
      for (var pat of this.pats) {
        ids.push(pat.getBottom());
      }
      return ids;
    }

    hasPattern(tree: LeafTree[]): boolean {
      if (this.pats.length !== tree.length) {
        return false;
      }
      for (var i in this.pats) {
        if (!this.pats[i].hasPattern(tree[i])) {
          return false;
        }
      }
      return true;
    }
  }
}
