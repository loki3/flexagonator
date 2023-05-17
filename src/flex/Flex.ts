namespace Flexagonator {

  // describes how a flex rotates & mirrors leaves
  export enum FlexRotation {
    None,          // same center vertex, no mirroring
    ClockMirror,   // new center = 1 step clockwise, flexagon is mirrored
    CounterMirror, // new center = 1 step counterclockwise, flexagon is mirrored
    Mirror,        // same center vertex, flexagon is mirrored
  }

  /*
    Takes a pattern as input (length matches the pat count in the target flexagon)
      and an output pattern that references the labels from the input pattern,
      with negative numbers indicating that the matching pat should be flipped
    e.g. input:  [1, [2, 3], 4, [5, 6]]
         output: [[-5, 1], -2, [4, -3], -6]
  */
  export function makeFlex(name: string, input: LeafTree[], output: LeafTree[], fr: FlexRotation): Flex | FlexError {
    if (input.length !== output.length) {
      return { reason: FlexCode.SizeMismatch };
    }
    return new Flex(name, input, output, fr);
  }

  /*
    Manages flexing a flexagon.
  */
  export class Flex {
    constructor(
      readonly name: string,
      readonly input: LeafTree[],
      readonly output: LeafTree[],
      readonly rotation: FlexRotation) {
    }

    createInverse(): Flex {
      return new Flex("inverse " + this.name, this.output, this.input, this.invertRotation(this.rotation));
    }

    // apply this flex to the given flexagon
    apply(flexagon: Flexagon): Flexagon | FlexError {
      const matches = flexagon.matchPattern(this.input);
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
      return new Flexagon(newPats, angleTracker);
    }

    private newAngleTracker(flexagon: Flexagon): AngleTracker {
      const tracker = flexagon.angleTracker;

      const newWhich: number = this.getNewCorner(tracker.whichCorner, tracker.isMirrored);
      const oldWhich: number = this.getOldCorner(tracker.oldCorner, tracker.isMirrored);
      const mirrored: boolean = (this.rotation == FlexRotation.None) ? tracker.isMirrored : !tracker.isMirrored;

      return AngleTracker.make(newWhich, mirrored, oldWhich);
    }

    private invertRotation(fr: FlexRotation): FlexRotation {
      if (fr === FlexRotation.None || fr === FlexRotation.Mirror) {
        return fr;
      }
      return (fr === FlexRotation.ClockMirror) ? FlexRotation.CounterMirror : FlexRotation.ClockMirror;
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

    private getNewCorner(whichCorner: number, isFirstMirrored: boolean): number {
      if (this.rotation === FlexRotation.None || this.rotation === FlexRotation.Mirror) {
        return whichCorner;
      }
      if ((this.rotation === FlexRotation.ClockMirror && isFirstMirrored) ||
        (this.rotation === FlexRotation.CounterMirror && !isFirstMirrored)) {
        return (whichCorner + 1) % 3;
      }
      return (whichCorner + 2) % 3;
    }
    private getOldCorner(whichCorner: number, isFirstMirrored: boolean): number {
      if (this.rotation === FlexRotation.None || this.rotation === FlexRotation.Mirror) {
        return whichCorner;
      }
      if ((this.rotation === FlexRotation.ClockMirror && !isFirstMirrored) ||
        (this.rotation === FlexRotation.CounterMirror && isFirstMirrored)) {
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

      return [new Flexagon(newPats, flexagon.angleTracker), splits];
    }
  }

}
