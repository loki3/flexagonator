namespace Flexagonator {

  export function makeFlexagon(trees: LeafTree[]): Flexagon {
    var pats: Pat[] = [];
    for (var tree of trees) {
      const pat = makePat(tree);
      pats.push(pat);
    }
    return new Flexagon(pats);
  }

  /*
    Manages the pats in a flexagon
  */
  export class Flexagon {
    constructor(private pats: Pat[]) {
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
  }
}
