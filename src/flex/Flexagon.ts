namespace Flexagonator {

  /*
    Manages the pats in a flexagon
  */
  export class Flexagon {
    // whichVertex: 1st face is numbered 0,1,2 clockwise - 0 starts out pointing to the center
    // isFirstMirrored: indicates that the first pat rotates counterclockwise instead
    constructor(readonly pats: Pat[], readonly whichVertex: number, readonly isFirstMirrored: boolean) {
    }

    static makeFromPats(pats: Pat[], whichVertex: number, isFirstMirrored: boolean): Flexagon {
      return new Flexagon(pats, whichVertex, isFirstMirrored);
    }

    static makeFromTree(trees: LeafTree[]): Flexagon | TreeError {
      return Flexagon.makeFromTreePlus(trees, 0, false/*isFirstMirrored*/);
    }

    static makeFromTreePlus(trees: LeafTree[], whichVertex: number, isFirstMirrored: boolean): Flexagon | TreeError {
      if (trees.length < 2) {
        return { reason: TreeCode.TooFewPats, context: trees };
      }
      const pats: Pat[] = [];
      for (let tree of trees) {
        const pat = makePat(tree);
        if (isTreeError(pat)) {
          return pat;
        }
        pats.push(pat);
      }
      return new Flexagon(pats, whichVertex, isFirstMirrored);
    }

    getPatCount(): number {
      return this.pats.length;
    }

    getLeafCount(): number {
      return this.pats.reduce((total, pat) => total + pat.getLeafCount(), 0);
    }

    getAsLeafTrees(): LeafTree[] {
      return this.pats.map(pat => pat.getAsLeafTree());
    }

    getTopIds(): number[] {
      return this.pats.map(pat => pat.getTop());
    }

    getBottomIds(): number[] {
      return this.pats.map(pat => pat.getBottom());
    }

    // get the ids for the visible leaves [ [top1, top2...], [bottom1,  bottom2...] ]
    getVisible(): number[][] {
      return [this.getTopIds(), this.getBottomIds()];
    }

    getThickness(): number[] {
      return this.pats.map(pat => pat.getThickness());
    }

    hasPattern(pattern: LeafTree[]): boolean {
      if (this.pats.length !== pattern.length) {
        return false;
      }
      for (let i in this.pats) {
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

      const match: Pat[] = [];
      for (let i in this.pats) {
        const imatch = this.pats[i].matchPattern(pattern[i]);
        if (isPatternError(imatch)) {
          return imatch;
        }
        for (let j in imatch) {
          match[j] = imatch[j];
        }
      }
      return match;
    }
  }
}
