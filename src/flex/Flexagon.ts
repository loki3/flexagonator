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

    static makeFromTreeCheckZeros(trees: LeafTree[]): Flexagon | TreeError {
      const flexagon = this.makeFromTree(trees);
      if (isTreeError(flexagon)) {
        return flexagon;
      }

      let next = 1;
      const result = flexagon.pats.map(pat => pat.replaceZeros(() => { return next++; }));
      return this.makeFromPats(result, 0, false/*isFirstMirrored*/);
    }

    static makeFromTreePlus(trees: LeafTree[], whichVertex: number, isFirstMirrored: boolean): Flexagon | TreeError {
      if (trees.length < 2) {
        return { reason: TreeCode.TooFewPats, context: trees };
      }
      const pats = trees.map(tree => makePat(tree));
      const error = pats.find(pat => isTreeError(pat));
      if (error && isTreeError(error)) {
        return error;
      }
      return new Flexagon(pats as Pat[], whichVertex, isFirstMirrored);
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
      return this.pats.every((pat, i) => pat.hasPattern(pattern[i]));
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
