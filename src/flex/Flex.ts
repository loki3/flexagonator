namespace Flexagonator {

  /**
   * if the first leaf after the reference hinge has angles ABC (A in the center/lower & B clockwise),
   * this describes the new arrangement of angles after a given flex
   */
  export enum FlexRotation {
    None = 'ABC',    // unchanged
    ACB = 'ACB',
    BAC = 'BAC',
    BCA = 'BCA',
    CAB = 'CAB',
    CBA = 'CBA',
    Right = 'Right',  // ACB if next hinge is /, BAC if next hinge is \
    Left = 'Left',    // ACB if previous hinge is /, BAC if previous hinge is \
  }

  /*
    Takes a pattern as input (length matches the pat count in the target flexagon)
      and an output pattern that references the labels from the input pattern,
      with negative numbers indicating that the matching pat should be flipped
    e.g. input:  [1, [2, 3], 4, [5, 6]]
         output: [[-5, 1], -2, [4, -3], -6]
    specifying pat directions is optional, with two techniques:
      inputDirs: use when input dirs must match a given pattern
      outputDirs: use when flex has specific pat directions as its output
      orderOfDirs: use if directions get rearranged, e.g., > or ^
  */
  export function makeFlex(
    name: string, input: LeafTree[], output: LeafTree[],
    fr: FlexRotation, inputDirs?: string, outputDirs?: string, orderOfDirs?: number[]
  ): Flex | FlexError {
    if (input.length !== output.length
      || (inputDirs !== undefined && input.length !== inputDirs.length)
      || (outputDirs !== undefined && input.length !== outputDirs.length)
      || (orderOfDirs !== undefined && input.length !== orderOfDirs.length)
    ) {
      return { reason: FlexCode.SizeMismatch };
    }

    const inDirections = inputDirs ? DirectionsOpt.make(inputDirs) : undefined;
    const outDirections = outputDirs ? DirectionsOpt.make(outputDirs) : undefined;
    if (inDirections === null || outDirections === null) {
      return { reason: FlexCode.BadDirections };
    }

    return new Flex(name, input, output, fr, inDirections, outDirections, orderOfDirs);
  }

  /*
    Manages flexing a flexagon.
  */
  export class Flex {
    private readonly needsDirections: boolean;

    constructor(
      readonly name: string,
      readonly input: LeafTree[],
      readonly output: LeafTree[],
      readonly rotation: FlexRotation,
      /** flexagon must be connected with these directions for flex to work */
      readonly inputDirs?: DirectionsOpt,
      /** specific pat directions for output flexagon */
      readonly outputDirs?: DirectionsOpt,
      /** old directions get rearranged, specify new order for old directions, 1-based */
      readonly orderOfDirs?: number[],
    ) {
      // check if flex will change a flexagon that's all ////'s
      this.needsDirections = outputDirs ? outputDirs.asRaw().some((d) => d === false) : false;
    }

    createInverse(): Flex {
      return new Flex("inverse " + this.name, this.output, this.input,
        this.invertRotation(this.rotation), this.outputDirs, this.inputDirs);
    }

    // apply this flex to the given flexagon
    apply(flexagon: Flexagon): Flexagon | FlexError {
      const matches = flexagon.matchPattern(this.input, this.inputDirs);
      if (isPatternError(matches)) {
        return { reason: FlexCode.BadFlexInput, patternError: matches };
      }

      const newPats: Pat[] = [];
      for (let stack of this.output) {
        const newPat = this.createPat(stack, matches);
        if (isFlexError(newPat)) {
          return newPat;
        }
        newPats.push(newPat);
      }

      const angleTracker = this.newAngleTracker(flexagon);
      const directions = this.newDirections(flexagon.directions);
      return new Flexagon(newPats, angleTracker, directions);
    }

    private newAngleTracker(flexagon: Flexagon): AngleTracker {
      const tracker = flexagon.angleTracker;

      const nextPrevDirs = this.getAdjacentDirections(flexagon.directions);
      const corners = tracker.rotate(this.rotation, nextPrevDirs);
      // deprecated info
      const oldWhich: number = this.getOldCorner(tracker.oldCorner, tracker.oldIsMirrored);
      const mirrored: boolean = (this.rotation == FlexRotation.None) ? tracker.oldIsMirrored : !tracker.oldIsMirrored;

      return AngleTracker.make(corners, mirrored, oldWhich);
    }

    /** get [next direction, previous direction], where true=/ and false=\ */
    private getAdjacentDirections(directions?: Directions): [boolean, boolean] {
      if (directions === undefined) {
        return [true, true];
      }
      const all = directions.asRaw();
      return [all[0], all[all.length - 1]];
    }

    private newDirections(directions?: Directions): Directions | undefined {
      if (directions === undefined) {
        if (!this.needsDirections || !this.outputDirs) {
          return undefined;
        }
        // flexagon didn't have directions, but the flex needs them
        const raw = this.outputDirs.asRaw().map(_ => true);
        directions = Directions.make(raw);
      }

      // explicitly set new directions
      if (this.outputDirs !== undefined) {
        const flexDirs = this.outputDirs.asRaw();
        const oldDirs = directions.asRaw();
        const newDirs: boolean[] = [];
        for (let i = 0; i < oldDirs.length; i++) {
          const flexDir = flexDirs[i];
          if (flexDir === null || flexDir === undefined) {
            // flex preserves old direction
            newDirs.push(oldDirs[i]);
          } else {
            // use flex's explicit direction
            newDirs.push(flexDir);
          }
        }
        directions = Directions.make(newDirs);
      }

      // rearrange directions
      if (this.orderOfDirs !== undefined) {
        // e.g., [2,3,1] means that the 2nd direction should now be first, followed by the 3rd & 1st
        const oldRaw = directions.asRaw();
        const newRaw = this.orderOfDirs[0] > 0
          ? this.orderOfDirs.map(newIndex => oldRaw[newIndex - 1])   // move directions around
          : this.orderOfDirs.map(newIndex => !oldRaw[-newIndex - 1]); // flip the directions, used by ~
        directions = Directions.make(newRaw);
      }

      return directions;
    }

    private invertRotation(fr: FlexRotation): FlexRotation {
      switch (fr) {
        case FlexRotation.ACB: return FlexRotation.ACB;
        case FlexRotation.BAC: return FlexRotation.BAC;
        case FlexRotation.BCA: return FlexRotation.CAB;
        case FlexRotation.CAB: return FlexRotation.BCA;
        case FlexRotation.CBA: return FlexRotation.CBA;
        case FlexRotation.Right: return FlexRotation.Left;
        case FlexRotation.Left: return FlexRotation.Right;
      }
      return FlexRotation.None;
    }

    // create a pat given a tree of indices into a set of matched pats
    private createPat(stack: LeafTree, matches: Pat[]): Pat | FlexError {
      if (typeof (stack) === "number") {
        const i = stack as number;
        const pat = matches[Math.abs(i)];
        return i > 0 ? pat.makeCopy() : pat.makeFlipped();
      }
      else if (Array.isArray(stack) && stack.length === 2) {
        const a = this.createPat(stack[0], matches);
        if (isFlexError(a)) {
          return a;
        }
        const b = this.createPat(stack[1], matches);
        if (isFlexError(b)) {
          return b;
        }
        return combinePats(a, b);
      }
      return { reason: FlexCode.BadFlexOutput };
    }

    /** deprecated: incorrectly supports a subset of rotations */
    private getOldCorner(whichCorner: number, isFirstMirrored: boolean): number {
      if (this.rotation === FlexRotation.None || this.rotation === FlexRotation.ACB) {
        return whichCorner;
      }
      if ((this.rotation === FlexRotation.CBA && !isFirstMirrored) ||
        (this.rotation === FlexRotation.BAC && isFirstMirrored)) {
        return (whichCorner + 1) % 3;
      }
      return (whichCorner + 2) % 3;
    }

    // generate the structure necessary to perform this flex, and keep track of new subpats
    // note: it doesn't actually apply the flex
    createPattern(flexagon: Flexagon): [Flexagon, Pat[]] {
      const newPats: Pat[] = [];
      const splits: Pat[] = [];
      let nextId = flexagon.getLeafCount() + 1;
      for (let i in this.input) {
        const newPat = flexagon.pats[i].createPattern(this.input[i], () => { return nextId++; }, splits);
        newPats.push(newPat);
      }

      return [new Flexagon(newPats, flexagon.angleTracker, flexagon.directions), splits];
    }
  }

}
