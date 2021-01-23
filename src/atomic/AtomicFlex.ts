namespace Flexagonator {

  export function makeAtomicFlex(name: string, inPattern: string, outPattern: string): AtomicFlex | AtomicParseError {
    const input = stringToAtomicPattern(inPattern);
    if (isAtomicParseError(input)) {
      return input;
    }
    const output = stringToAtomicPattern(outPattern);
    if (isAtomicParseError(output)) {
      return output;
    }
    return new AtomicFlex(name, input, output);
  }

  /**
   * assuming that the entire flexagon is described by input.left & input.right,
   * move the first or last pat to the opposite end of the pattern
   */
  export function makeAtomicWrap(wrap: 'r' | 'l'): AtomicFlex {
    const name = wrap === 'r' ? 'wrap right to left' : 'wrap left to right';
    const empty: AtomicPattern = { otherLeft: 'a', left: null, right: null, otherRight: 'b', singleLeaf: false };
    return new AtomicFlex(name, empty, empty, wrap);
  }

  /** info about how to apply a flex that uses AtomicPattern */
  export class AtomicFlex {
    constructor(
      readonly name: string,
      readonly pattern: AtomicPattern,
      readonly output: AtomicPattern,
      readonly specialWrap?: 'r' | 'l') {
    }

    createInverse(): AtomicFlex {
      return new AtomicFlex("inverse " + this.name, this.output, this.pattern);
    }

    /** apply this flex to the given input */
    apply(input: AtomicPattern): AtomicPattern | AtomicPatternError {
      if (this.specialWrap) {
        return this.handleSpecialWrap(input);
      }

      const matches = matchAtomicPattern(input, this.pattern);
      if (isAtomicPatternError(matches)) {
        return matches;
      }

      const otherLeft = this.getRemainder(this.output.otherLeft, matches.otherLeft, matches.otherRight);
      const otherRight = this.getRemainder(this.output.otherRight, matches.otherLeft, matches.otherRight);

      const moreLeft = this.getLeftoverPats(this.pattern.otherLeft, this.output.otherLeft, matches.patsLeft, matches.patsRight);
      const left = this.makePats(this.output.left, matches.matches, moreLeft, matches.specialDirection);
      if (isFlexError(left)) {
        return { atomicPatternError: "PatMismatch" };
      }
      const moreRight = this.getLeftoverPats(this.pattern.otherRight, this.output.otherRight, matches.patsLeft, matches.patsRight);
      const right = this.makePats(this.output.right, matches.matches, moreRight, matches.specialDirection);
      if (isFlexError(right)) {
        return { atomicPatternError: "PatMismatch" };
      }

      return { otherLeft, left, right, otherRight, singleLeaf: false };
    }

    /** make a series of ConnectedPats by filling in 'output' with what's in 'matches' + 'more' */
    private makePats(output: ConnectedPats | null, matches: Pat[], more?: ConnectedPats, direction?: Direction): ConnectedPats | null | FlexError {
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

    private getLeftoverPats(pattern: Remainder, output: Remainder, left?: ConnectedPats, right?: ConnectedPats): ConnectedPats | undefined {
      switch (output) {
        case 'a': return left ? this.checkReverse(pattern, output, left) : undefined;
        case '-a': return left ? this.checkFlipAndReverse(pattern, output, left) : undefined;
        case 'b': return right ? this.checkReverse(pattern, output, right) : undefined;
        case '-b': return right ? this.checkFlipAndReverse(pattern, output, right) : undefined;
      }
    }

    // flip over pats & possibly reverse the pat directions if needed
    private checkFlipAndReverse(pattern: Remainder, output: Remainder, pats?: ConnectedPats): ConnectedPats | undefined {
      const flipped = flipConnectedPats(pats);
      if (flipped === undefined) {
        return undefined;
      }
      return this.checkReverse(pattern, output, flipped);
    }
    // if one side is being turned over, we need to flip the pat directions
    private checkReverse(pattern: Remainder, output: Remainder, pats: ConnectedPats): ConnectedPats | undefined {
      if ((pattern === 'a' && output === '-a') || (pattern === '-a' && output === 'a')
        || (pattern === 'b' && output === '-b') || (pattern === '-b' && output === 'b')) {
        // if flipping but not swapping sides (e.g. a=-a), then we need to reverse all the directions
        return pats.map(p => { return { pat: p.pat, direction: (p.direction === '\\' ? '/' : '\\') as Direction } });
      }
      return pats;
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

    /**
     * assuming that the entire flexagon is described by input.left & input.right,
     * move the first or last pat to the opposite end of the pattern
     */
    private handleSpecialWrap(input: AtomicPattern): AtomicPattern {
      if (input.left === null && input.right === null) {
        return input;
      }
      const turnOver = this.shouldTurnOver(input);
      if (this.specialWrap === 'l') {
        // check if we need to move the current hinge from 'left' to 'right'
        if (!input.left && input.right) {
          // TODO: handle the 'turnOver' case
          const left = input.right.slice(1).reverse();
          const right = [input.right[0]];
          return { ...input, left, right };
        }
        const item = input.left !== null ? input.left[input.left.length - 1] : (input.right as ConnectedPats)[0];
        const toWrap = turnOver ? this.turnOver(item) : item;
        const left = input.left !== null ? input.left.slice(0, input.left.length - 1) : null;
        const right = input.right !== null ? input.right.concat(toWrap) : [toWrap];
        return { ...input, left, right };
      } else if (this.specialWrap === 'r') {
        // check if we need to move the current hinge from 'right' to 'left'
        if (input.left && !input.right) {
          // TODO: handle the 'turnOver' case
          const left = [input.left[0]];
          const right = input.left.slice(1).reverse();
          return { ...input, left, right };
        }
        const item = input.right !== null ? input.right[input.right.length - 1] : (input.left as ConnectedPats)[0];
        const toWrap = turnOver ? this.turnOver(item) : item;
        const left = input.left !== null ? input.left.concat(toWrap) : [toWrap];
        const right = input.right !== null ? input.right.slice(0, input.right.length - 1) : null;
        return { ...input, left, right };
      }
      return input;
    }

    private shouldTurnOver(input: AtomicPattern): boolean {
      const aFlipped = input.otherLeft.startsWith('-');
      const bFlipped = input.otherRight.startsWith('-');
      return (aFlipped && !bFlipped) || (!aFlipped && bFlipped);
    }
    private turnOver(pat: ConnectedPat): ConnectedPat {
      return { pat: pat.pat.makeFlipped(), direction: pat.direction === '/' ? '\\' : '/' };
    }
  }

}
