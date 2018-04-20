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

  export function makeFlexagonFromPats(pats: Pat[]): Flexagon {
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

    hasPattern(pattern: LeafTree[]): boolean {
      if (this.pats.length !== pattern.length) {
        return false;
      }
      for (var i in this.pats) {
        if (!this.pats[i].hasPattern(pattern[i])) {
          return false;
        }
      }
      return true;
    }

    matchPattern(pattern: LeafTree[]): Pat[] | PatternError {
      if (this.pats.length !== pattern.length) {
        return { expected: pattern, actual: this.pats };
      }

      var match: Pat[] = [];
      for (var i in this.pats) {
        const imatch = this.pats[i].matchPattern(pattern[i]);
        if (isPatternError(imatch)) {
          return imatch;
        }
        for (var j in imatch) {
          match[j] = imatch[j];
        }
      }
      return match;
    }
  }
}
