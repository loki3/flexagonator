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
    e.g. pattern: [1, [2, 3], 4, [5, 6]]
         output:  [[-5, 1], -2, [4, -3], -6]
  */
  export function makeFlex(name: string, pattern: LeafTree[], output: LeafTree[], fr: FlexRotation): Flex | FlexError {
    if (pattern.length !== output.length) {
      return { reason: FlexCode.SizeMismatch };
    }
    return new Flex(name, pattern, output, fr);
  }

  /*
    Manages flexing a flexagon.
  */
  export class Flex {
    constructor(
      readonly name: string,
      readonly pattern: LeafTree[],
      readonly output: LeafTree[],
      readonly rotation: FlexRotation) {
    }

    createInverse(): Flex {
      return new Flex("inverse " + this.name, this.output, this.pattern, this.invertRotation(this.rotation));
    }

    // apply this flex to the given flexagon
    apply(flexagon: Flexagon): Flexagon | FlexError {
      const matches = flexagon.matchPattern(this.pattern);
      if (isPatternError(matches)) {
        return { reason: FlexCode.BadFlexInput, patternError: matches };
      }

      var newPats: Pat[] = [];
      for (var stack of this.output) {
        const newPat = this.createPat(stack, matches);
        if (isFlexError(newPat)) {
          return newPat;
        }
        newPats.push(newPat);
      }

      const newVertex: number = this.getNewVertex(flexagon.whichVertex, flexagon.isFirstMirrored);
      const isFirstMirrored: boolean = (this.rotation == FlexRotation.Mirror) ? !flexagon.isFirstMirrored : flexagon.isFirstMirrored;

      return makeFlexagonFromPats(newPats, newVertex, isFirstMirrored);
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

    private getNewVertex(whichVertex: number, isFirstMirrored: boolean): number {
      if (this.rotation === FlexRotation.None || this.rotation === FlexRotation.Mirror) {
        return whichVertex;
      }
      if ((this.rotation === FlexRotation.ClockMirror && !isFirstMirrored) ||
        (this.rotation === FlexRotation.CounterMirror && isFirstMirrored)) {
        return (whichVertex + 1) % 3;
      }
      return (whichVertex + 2) % 3;
    }

    // generate the structure necessary to perform this flex
    // note: it doesn't actually apply the flex
    createPattern(flexagon: Flexagon): Flexagon {
      var newPats: Pat[] = [];
      var nextId = flexagon.getLeafCount() + 1;
      for (var i in this.pattern) {
        const newPat = flexagon.pats[i].createPattern(this.pattern[i], () => { return nextId++; });
        newPats.push(newPat);
      }

      return makeFlexagonFromPats(newPats, flexagon.whichVertex, flexagon.isFirstMirrored);
    }
  }

}
