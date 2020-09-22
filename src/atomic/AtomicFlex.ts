namespace Flexagonator {

  /** definition of an "atomic flex", which transforms one atomic pattern into another */
  export interface AtomicFlexDef {
    readonly shorthand: string;
    readonly name: string;
    readonly input: string;  // AtomicPattern
    readonly output: string; // AtomicPattern
  }

  export function makeAtomicFlex(def: AtomicFlexDef): AtomicFlex | AtomicParseError {
    const input = stringToAtomicPattern(def.input);
    if (isAtomicParseError(input)) {
      return input;
    }
    const output = stringToAtomicPattern(def.output);
    if (isAtomicParseError(output)) {
      return output;
    }
    return new AtomicFlex(def.name, input, output);
  }

  /** info about how to apply a flex that uses AtomicPattern */
  export class AtomicFlex {
    constructor(
      readonly name: string,
      readonly pattern: AtomicPattern,
      readonly output: AtomicPattern) {
    }

    createInverse(): AtomicFlex {
      return new AtomicFlex("inverse " + this.name, this.output, this.pattern);
    }

    /** apply this flex to the given input */
    apply(input: AtomicPattern): AtomicPattern | AtomicPatternError {
      const matches = matchAtomicPattern(input, this.pattern);
      if (isAtomicPatternError(matches)) {
        return matches;
      }

      const otherLeft = this.getRemainder(this.output.otherLeft, matches.otherLeft, matches.otherRight);
      const otherRight = this.getRemainder(this.output.otherRight, matches.otherLeft, matches.otherRight);

      const moreLeft = this.getLeftoverPats(this.output.otherLeft, matches.patsLeft, matches.patsRight);
      const left = this.makePats(this.output.left, matches.matches, moreLeft, matches.specialDirection);
      if (isFlexError(left)) {
        return { atomicPatternError: "PatMismatch" };
      }
      const moreRight = this.getLeftoverPats(this.output.otherRight, matches.patsLeft, matches.patsRight);
      const right = this.makePats(this.output.right, matches.matches, moreRight, matches.specialDirection);
      if (isFlexError(right)) {
        return { atomicPatternError: "PatMismatch" };
      }

      return { otherLeft, left, right, otherRight, singleLeaf: false };
    }

    /** make a series of ConnectedPats by filling in 'output' with what's in 'matches' + 'more' */
    private makePats(output: ConnectedPats | null, matches: Pat[], more?: ConnectedPats, direction?: PatDirection): ConnectedPats | null | FlexError {
      if (output === null && more === undefined) {
        return null;
      }
      const newPats: ConnectedPat[] = [];
      if (output) {
        for (let stack of output) {
          const newPat = this.createPat(stack.pat.getAsLeafTree(), matches);
          if (isFlexError(newPat)) {
            return newPat;
          }
          // copy across the pat's direction except in the special case where the pattern only had a single leaf,
          // in which case we use the source pat's direction
          newPats.push({ pat: newPat, direction: direction ? direction : stack.direction });
        }
      }
      if (more) {
        more.map(m => newPats.push(m));
      }
      return newPats;
    }

    /** create a pat given a tree of indices into a set of matched pats */
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

    private getLeftoverPats(output: Remainder, left?: ConnectedPats, right?: ConnectedPats): ConnectedPats | undefined {
      switch (output) {
        case 'a': return left;
        case '-a': return left ? flipConnectedPats(left) : undefined;
        case 'b': return right;
        case '-b': return right ? flipConnectedPats(right) : undefined;
      }
    }

    /** match reaminder output */
    private getRemainder(output: Remainder, left: Remainder, right: Remainder): Remainder {
      switch (output) {
        case 'a': return left;
        case '-a': return flipRemainder(left);
        case 'b': return right;
        case '-b': return flipRemainder(right);
      }
    }
  }

}
