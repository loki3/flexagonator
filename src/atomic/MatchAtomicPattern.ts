namespace Flexagonator {
  // matchPattern(pattern: LeafTree): Pat[] | PatternError;

  /**
   * match an AtomicPattern against an input pattern, extracting out the matches
   */
  export function matchAtomicPattern(input: AtomicPattern, pattern: AtomicPattern): AtomicMatches | AtomicPatternError {
    if (getPatsCount(input.left) < getPatsCount(pattern.left) || getPatsCount(input.right) < getPatsCount(pattern.right)) {
      return { atomicPatternError: "NotEnoughPats" };
    }

    // find matches on left side & right side, then combine results
    let leftMatches: Pat[] = [];
    if (input.left !== null && pattern.left !== null) {
      const matches = matchOneSide(input.left, input.otherLeft, pattern.left, pattern.otherLeft);
      if (isAtomicPatternError(matches)) {
        return matches;
      }
      leftMatches = matches;
    }
    let rightMatches: Pat[] = [];
    if (input.right !== null && pattern.right !== null) {
      const matches = matchOneSide(input.right, input.otherRight, pattern.right, pattern.otherRight);
      if (isAtomicPatternError(matches)) {
        return matches;
      }
      rightMatches = matches;
    }
    const matches = combineMatches([leftMatches, rightMatches]);
    return { matches };
  }

  /** details about how an atomic pattern matched */
  export interface AtomicMatches {
    /** an array where the index is the pattern number from the input and the item is the matching pat structure */
    readonly matches: Pat[];
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

  /** find matches from a list of pats & a remainder */
  function matchOneSide(inPats: ConnectedPats, inOther: Remainder, patternPats: ConnectedPats, patternOther: Remainder): Pat[] | AtomicPatternError {
    const all = patternPats.map((p, i) => matchOnePat(inPats[i], p));
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
  function matchOnePat(input: ConnectedPat, pattern: ConnectedPat): Pat[] | AtomicPatternError {
    if (input.direction !== pattern.direction) {
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

}
