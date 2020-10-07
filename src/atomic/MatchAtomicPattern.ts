namespace Flexagonator {

  /**
   * match an AtomicPattern against an input pattern, extracting out the matches
   */
  export function matchAtomicPattern(input: AtomicPattern, pattern: AtomicPattern): AtomicMatches | AtomicPatternError {
    if (getPatsCount(input.left) < getPatsCount(pattern.left) || getPatsCount(input.right) < getPatsCount(pattern.right)) {
      return { atomicPatternError: "NotEnoughPats" };
    }

    const result = findMatches(input.left, input.right, pattern.left, pattern.right, pattern.singleLeaf);
    if (isAtomicPatternError(result)) {
      return result;
    }
    const [matches, specialDirection] = result;
    const leftover = findLeftovers(input, pattern);
    if (isAtomicPatternError(leftover)) {
      return leftover;
    }
    return { ...leftover, specialDirection, matches };
  }

  /** details about how an atomic pattern matched */
  export interface AtomicMatches {
    /** an array where the index is the pattern number from the input and the item is the matching pat structure */
    readonly matches: Pat[];
    /** stuff to the left that's not relevant */
    readonly otherLeft: Remainder;
    readonly patsLeft?: ConnectedPats;
    /** stuff to the right that's not relevant */
    readonly otherRight: Remainder;
    readonly patsRight?: ConnectedPats;
    /** used in the special case of a single leaf pattern that ignores direction, because it's needed when creating output */
    readonly specialDirection?: PatDirection;
  }


  /** find matches on left side & right side, then combine results */
  function findMatches(
    inLeft: ConnectedPats | null, inRight: ConnectedPats | null,
    patternLeft: ConnectedPats | null, patternRight: ConnectedPats | null,
    singleLeaf: boolean
  ): [Pat[], PatDirection | undefined] | AtomicPatternError {
    let leftMatches: Pat[] = [];
    let direction: PatDirection | undefined;
    if (inLeft !== null && patternLeft !== null) {
      const matches = matchOneSide(inLeft, patternLeft, singleLeaf);
      if (isAtomicPatternError(matches)) {
        return matches;
      }
      leftMatches = matches;
      if (singleLeaf) {
        direction = inLeft[0].direction;
      }
    }
    let rightMatches: Pat[] = [];
    if (inRight !== null && patternRight !== null) {
      const matches = matchOneSide(inRight, patternRight, singleLeaf);
      if (isAtomicPatternError(matches)) {
        return matches;
      }
      rightMatches = matches;
      if (singleLeaf) {
        direction = inRight[0].direction;
      }
    }
    return [combineMatches([leftMatches, rightMatches]), direction];
  }

  /** find matches from a list of pats */
  function matchOneSide(inPats: ConnectedPats, patternPats: ConnectedPats, ignoreDirection: boolean): Pat[] | AtomicPatternError {
    const all = patternPats.map((p, i) => matchOnePat(inPats[i], p, ignoreDirection));
    // any errors?
    const errors = all.filter(e => isAtomicPatternError(e));
    if (errors.length > 0) {
      return errors[0] as AtomicPatternError;
    }
    // we only have Pat[]'s, which we need to merge
    const matches = combineMatches(all as Pat[][]);
    return matches;
  }

  /** extract out the matches in a single pat */
  function matchOnePat(input: ConnectedPat, pattern: ConnectedPat, ignoreDirection: boolean): Pat[] | AtomicPatternError {
    if (input.direction !== pattern.direction && !ignoreDirection) {
      return { atomicPatternError: "DirectionMismatch", expectedConnected: pattern, actualConnected: input };
    }
    const matches = input.pat.matchPattern(pattern.pat.getAsLeafTree());
    if (isPatternError(matches)) {
      return { atomicPatternError: "PatMismatch", expectedConnected: pattern, actualConnected: input, expectedPats: matches.expected, actualPats: matches.actual };
    }
    return matches;
  }

  function combineMatches(all: Pat[][]): Pat[] {
    const combined: Pat[] = [];
    all.map(pats => pats.map((p, i) => combined[i] = p));
    return combined;
  }

  /** collect all the leftovers not matched by the patterns, flip & swap as necessary */
  function findLeftovers(input: AtomicPattern, pattern: AtomicPattern): AtomicMatches | AtomicPatternError {
    const [iol, ior] = [input.otherLeft, input.otherRight];
    const [pol, por] = [pattern.otherLeft, pattern.otherRight];
    const ipl = getLeftoverPats(input.left, pattern.left);
    const ipr = getLeftoverPats(input.right, pattern.right);
    let otherLeft: Remainder = 'a', otherRight: Remainder = 'a';
    let patsLeft: ConnectedPats | undefined = undefined, patsRight: ConnectedPats | undefined = undefined;
    if (pol === 'a' || pol === '-a') {
      // left & right match between input & pattern
      otherLeft = pol === 'a' ? iol : flipRemainder(iol);
      patsLeft = pol === 'a' ? ipl : flipConnectedPats(ipl);
      otherRight = por === 'b' ? ior : flipRemainder(ior);
      patsRight = por === 'b' ? ipr : flipConnectedPats(ipr);
    } else {
      // swap left & right
      otherLeft = pol === 'b' ? ior : flipRemainder(ior);
      patsLeft = pol === 'b' ? ipr : flipConnectedPats(ipr);
      otherRight = por === 'a' ? iol : flipRemainder(iol);
      patsRight = por === 'a' ? ipl : flipConnectedPats(ipl);
    }
    return { matches: [], otherLeft, patsLeft, otherRight, patsRight };
  }

  function getLeftoverPats(input: ConnectedPats | null, pattern: ConnectedPats | null): ConnectedPats | undefined {
    if (pattern === null) {
      return input === null ? undefined : input;
    }
    if (input === null || input.length <= pattern.length) {
      return undefined;
    }
    return input.slice(pattern.length);
  }

}
