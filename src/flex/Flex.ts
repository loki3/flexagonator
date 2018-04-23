namespace Flexagonator {

  /*
    Takes a pattern as input (length matches the pat count in the target flexagon)
      and an output pattern that references the labels from the input pattern,
      with negative numbers indicating that the matching pat should be flipped
    e.g. pattern: [1, [2, 3], 4, [5, 6]]
         output:  [[-5, 1], -2, [4, -3], -6]
  */
  export function makeFlex(name: string, pattern: LeafTree[], output: LeafTree[]): Flex | FlexError {
    if (pattern.length !== output.length) {
      return { reason: FlexCode.SizeMismatch };
    }
    return new Flex(name, pattern, output);
  }

  /*
    Manages flexing a flexagon.
  */
  export class Flex {
    constructor(
      readonly name: string,
      readonly pattern: LeafTree[],
      readonly output: LeafTree[]) {
    }

    createInverse(): Flex {
      return new Flex("inverse " + this.name, this.output, this.pattern);
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

      return makeFlexagonFromPats(newPats);
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

    // generate the structure necessary to perform this flex
    // note: it doesn't actually apply the flex
    createPattern(flexagon: Flexagon): Flexagon {
      var newPats: Pat[] = [];
      var nextId = flexagon.getLeafCount() + 1;
      for (var i in this.pattern) {
        const newPat = flexagon.pats[i].createPattern(this.pattern[i], () => { return nextId++; });
        newPats.push(newPat);
      }

      return makeFlexagonFromPats(newPats);
    }
  }

}
