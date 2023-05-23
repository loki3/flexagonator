namespace Flexagonator {

  /*
    Manages the pats in a flexagon
  */
  export class Flexagon {
    readonly angleTracker: AngleTracker;

    constructor(readonly pats: Pat[], angleTracker?: AngleTracker, readonly directions?: Directions) {
      this.angleTracker = angleTracker === undefined ? AngleTracker.makeDefault() : angleTracker;
    }

    static makeFromTreeCheckZeros(trees: LeafTree[]): Flexagon | TreeError {
      const flexagon = this.makeFromTree(trees);
      if (isTreeError(flexagon)) {
        return flexagon;
      }

      // find the largest id and replace all 0's in pats with an incremented counter
      let next = flexagon.pats.map(pat => pat.findMaxId()).reduce((prev, current) => Math.max(prev, current), 0) + 1;
      const result = flexagon.pats.map(pat => pat.replaceZeros(() => { return next++; }));
      return new Flexagon(result);
    }

    static makeFromTree(trees: LeafTree[], angleTracker?: AngleTracker, directions?: Directions): Flexagon | TreeError {
      if (trees.length < 2) {
        return { reason: TreeCode.TooFewPats, context: trees };
      }
      const pats = trees.map(tree => makePat(tree));
      const error = pats.find(pat => isTreeError(pat));
      if (error && isTreeError(error)) {
        return error;
      }
      return new Flexagon(pats as Pat[], angleTracker, directions);
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

    /**
     * create a new flexagon where the leaves are renumbered
     * such that the ids are in the order they occur in the unfolded strip
     */
    normalizeIds(): Flexagon {
      const normalized = normalizeIds(this.pats);
      return new Flexagon(normalized, this.angleTracker, this.directions);
    }

    changeDirections(directions?: Directions): Flexagon {
      return new Flexagon(this.pats, this.angleTracker, directions);
    }
  }

  /**
   * tracks how the FlexagonAngles associated with a Flexagon should be used.
   * whichAngle: which of the 3 angles is currently in the center of the flexagon (012)
   * isMirrored: if !isMirrored, angles are 012, else 021
   * oldAngle: for backward compat with the old API, same as 'whichAngle' except it's often wrong
   */
  export class AngleTracker {
    static make(whichCorner: number, isMirrored: boolean, oldCorner?: number) {
      return new AngleTracker(whichCorner, isMirrored, oldCorner !== undefined ? oldCorner : whichCorner);
    }
    static makeDefault() {
      return new AngleTracker(0, false, 0);
    }

    private constructor(
      readonly whichCorner: number, readonly isMirrored: boolean,
      readonly oldCorner: number
    ) {
    }
  }
}
