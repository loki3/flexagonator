namespace Flexagonator {

  /**
   * match an AtomicPattern against an input pattern, extracting out the matches
   */
  export function matchAtomicPattern(input: AtomicPattern, pattern: AtomicPattern): AtomicMatches | AtomicPatternError {
    if (getPatsCount(input.left) < getPatsCount(pattern.left) || getPatsCount(input.right) < getPatsCount(pattern.right)) {
      return { atomicPatternError: "NotEnoughPats" };
    }

    const matches = findMatches(input.left, input.right, pattern.left, pattern.right, pattern.singleLeaf);
    if (isAtomicPatternError(matches)) {
      return matches;
    }
    const leftover = findLeftovers(input, pattern);
    if (isAtomicPatternError(leftover)) {
      return leftover;
    }
    return { ...leftover, matches };
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
  }

  /** explanation of a problem detected by matchAtomicPattern */
  export interface AtomicPatternError {
    readonly atomicPatternError: AtomicPatternCode;

    readonly expectedConnected?: ConnectedPat;
    readonly actualConnected?: ConnectedPat;

    readonly expectedPats?: LeafTree;
    readonly actualPats?: LeafTree;
  }
  export type AtomicPatternCode =
    | "NotEnoughPats"
    | "PatMismatch"
    | "DirectionMismatch"
    ;
  export function isAtomicPatternError(result: any): result is AtomicPatternError {
    return (result !== null) && (result as AtomicPatternError).atomicPatternError !== undefined;
  }

  /** find matches on left side & right side, then combine results */
  function findMatches(
    inLeft: ConnectedPats | null, inRight: ConnectedPats | null,
    patternLeft: ConnectedPats | null, patternRight: ConnectedPats | null,
    ignoreDirection: boolean
  ): Pat[] | AtomicPatternError {
    let leftMatches: Pat[] = [];
    if (inLeft !== null && patternLeft !== null) {
      const matches = matchOneSide(inLeft, patternLeft, ignoreDirection);
      if (isAtomicPatternError(matches)) {
        return matches;
      }
      leftMatches = matches;
    }
    let rightMatches: Pat[] = [];
    if (inRight !== null && patternRight !== null) {
      const matches = matchOneSide(inRight, patternRight, ignoreDirection);
      if (isAtomicPatternError(matches)) {
        return matches;
      }
      rightMatches = matches;
    }
    return combineMatches([leftMatches, rightMatches]);
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
    if (input === null || pattern === null || input.length <= pattern.length) {
      return undefined;
    }
    return input.slice(pattern.length);
  }

  function flipRemainder(r: Remainder): Remainder {
    return (r[0] === '-' ? r[1] : '-' + r) as Remainder;
  }
  function flipConnectedPats(cp?: ConnectedPats): ConnectedPats | undefined {
    if (cp === undefined) {
      return undefined;
    }
    return cp.map(p => { return { pat: p.pat.makeFlipped(), direction: p.direction } });
  }

}
