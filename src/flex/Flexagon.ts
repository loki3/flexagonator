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
    return new Flexagon(pats, 0, false/*isFirstMirrored*/);
  }

  export function makeFlexagonFromPats(pats: Pat[], whichVertex: number, isFirstMirrored: boolean): Flexagon {
    return new Flexagon(pats, whichVertex, isFirstMirrored);
  }

  /*
    Manages the pats in a flexagon
  */
  export class Flexagon {
    // whichVertex: 1st face is numbered 0,1,2 clockwise - 0 starts out pointing to the center
    // isFirstMirrored: indicates that the first pat rotates counterclockwise instead
    constructor(readonly pats: Pat[], readonly whichVertex: number, readonly isFirstMirrored: boolean) {
    }

    getPatCount(): number {
      return this.pats.length;
    }

    getLeafCount(): number {
      var total = 0;
      for (var pat of this.pats) {
        total += pat.getLeafCount();
      }
      return total;
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

    // get the ids for the visible leaves [ top1, bottom1, top2, bottom2, ... ]
    getVisible(): number[] {
      var ids: number[] = [];
      for (var pat of this.pats) {
        ids.push(pat.getTop());
        ids.push(pat.getBottom());
      }
      return ids;
    }

    getThickness(): number[] {
      var thickness: number[] = [];
      for (var pat of this.pats) {
        thickness.push(pat.getThickness());
      }
      return thickness;
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
