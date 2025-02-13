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

    /** get the ids for the visible leaves [ [top1, top2...], [bottom1,  bottom2...] ] */
    getVisible(): number[][] {
      return [this.getTopIds(), this.getBottomIds()];
    }

    getThicknesses(): number[] {
      return this.pats.map(pat => pat.getLeafCount());
    }

    /** check if flexagons are in the same state: pat structure, leaf ids, & directions */
    isSameState(other: Flexagon): boolean {
      if (this.pats.length !== other.pats.length) {
        return false;
      }
      if (this.pats.some((p, i) => !p.isEqual(other.pats[i]))) {
        return false;
      }
      return this.hasEqualDirections(other);
    }

    /** check if flexagons have the same pat structure & directions, ignoring leaf ids */
    isSameStructure(other: Flexagon): boolean {
      if (this.pats.length !== other.pats.length) {
        return false;
      }
      if (this.pats.some((p, i) => !p.isEqualStructure(other.pats[i]))) {
        return false;
      }
      return this.hasEqualDirections(other);
    }

    hasPattern(pattern: LeafTree[]): boolean {
      if (this.pats.length !== pattern.length) {
        return false;
      }
      return this.pats.every((pat, i) => pat.hasPattern(pattern[i]));
    }

    /** check if the flexagon's pat directions match the given pattern */
    hasDirections(patternDirs?: DirectionsOpt): boolean {
      if (!patternDirs || !this.directions) {
        return true;
      }
      if (patternDirs.getCount() !== this.directions.getCount()) {
        return false;
      }
      const expected = patternDirs.asRaw();
      const actual = this.directions.asRaw();
      let i = 0;
      for (const e of expected) {
        if (e !== null && e != actual[i]) {
          return false;
        }
        i++;
      }
      return true;
    }

    /** check if flexagons have same pat directions */
    hasEqualDirections(other: Flexagon): boolean {
      if (this.hasSameDirections() && other.hasSameDirections()) {
        return true;
      } else if (this.directions === undefined || other.directions === undefined) {
        return false;
      }
      return this.directions.asRaw().every((d, i) => d === other.directions?.asRaw()[i]);
    }

    /** check if all pats go in the same direction */
    hasSameDirections(): boolean {
      if (!this.directions) {
        return true;
      }
      const raw = this.directions.asRaw();
      return raw.every(d => d) || raw.every(d => !d);
    }

    /** if pats & directions match, return a lookup from pattern leaf id to matching pat */
    matchPattern(pattern: LeafTree[], patternDirs?: DirectionsOpt): Pat[] | PatternError {
      if (this.pats.length !== pattern.length) {
        return { expected: pattern, actual: this.pats };
      }

      // check pats & save matches
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

      // verify that directions match
      if (!this.hasDirections(patternDirs)) {
        return { expectedDirs: patternDirs, actualDirs: this.directions };
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
   * corners: array of 0,1,or 2 - lists which angle is center/lower, first clockwise, and final angle
   * isMirrored: for backward compat with the old API, if !isMirrored, angles are 012, else 021
   * oldAngle: for backward compat with the old API, same as 'whichAngle' except it's often wrong
   */
  export class AngleTracker {
    static make(corners: number[], oldIsMirrored: boolean, oldCorner?: number) {
      return new AngleTracker(corners, oldIsMirrored, oldCorner !== undefined ? oldCorner : corners[0]);
    }
    static makeDefault() {
      return new AngleTracker([0, 1, 2], false, 0);
    }

    private constructor(
      readonly corners: number[],
      readonly oldIsMirrored: boolean, readonly oldCorner: number
    ) {
    }

    /** @param nextPrevDirs [next direction, previous direction], where true=/ and false=\ */
    rotate(fr: FlexRotation, nextPrevDirs: [boolean, boolean]): number[] {
      switch (fr) {
        case FlexRotation.ACB: return this.apply(0, 2, 1);
        case FlexRotation.BAC: return this.apply(1, 0, 2);
        case FlexRotation.BCA: return this.apply(1, 2, 0);
        case FlexRotation.CAB: return this.apply(2, 0, 1);
        case FlexRotation.CBA: return this.apply(2, 1, 0);
        case FlexRotation.Right:
          return nextPrevDirs[0] ? this.apply(0, 2, 1) : this.apply(1, 0, 2);
        case FlexRotation.Left:
          return nextPrevDirs[1] ? this.apply(0, 2, 1) : this.apply(1, 0, 2);
      }
      return this.corners;
    }

    private apply(a: number, b: number, c: number): number[] {
      return [this.corners[a], this.corners[b], this.corners[c]];
    }
  }
}
