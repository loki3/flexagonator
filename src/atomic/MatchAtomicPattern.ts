namespace Flexagonator {

  /**
   * match an AtomicPattern against an input pattern, extracting out the matches
   */
  export function matchAtomicPattern(input: AtomicPattern, pattern: AtomicPattern): AtomicMatches | AtomicPatternError {
    if (getPatsCount(input.left) < getPatsCount(pattern.left) || getPatsCount(input.right) < getPatsCount(pattern.right)) {
      return { atomicPatternError: "NotEnoughPats" };
    }

    const matches = findMatches(input.left, input.right, pattern.left, pattern.right);
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
    inLeft: ConnectedPats | null, inRight: ConnectedPats | null, patternLeft: ConnectedPats | null, patternRight: ConnectedPats | null
  ): Pat[] | AtomicPatternError {
    let leftMatches: Pat[] = [];
    if (inLeft !== null && patternLeft !== null) {
      const matches = matchOneSide(inLeft, patternLeft);
      if (isAtomicPatternError(matches)) {
        return matches;
      }
      leftMatches = matches;
    }
    let rightMatches: Pat[] = [];
    if (inRight !== null && patternRight !== null) {
      const matches = matchOneSide(inRight, patternRight);
      if (isAtomicPatternError(matches)) {
        return matches;
      }
      rightMatches = matches;
    }
    return combineMatches([leftMatches, rightMatches]);
  }

  /** find matches from a list of pats */
  function matchOneSide(inPats: ConnectedPats, patternPats: ConnectedPats): Pat[] | AtomicPatternError {
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

  /** collect all the leftovers not matched by the patterns */
  function findLeftovers(input: AtomicPattern, pattern: AtomicPattern): AtomicMatches | AtomicPatternError {
    const [iol, ior] = [input.otherLeft, input.otherRight];
    const [pol, por] = [pattern.otherLeft, pattern.otherRight];
    let otherLeft = pol === 'a' ? iol : pol === '-a' ? flip(iol) : pol === 'b' ? ior : pol === '-b' ? flip(ior) : 'a';
    let otherRight = por === 'a' ? iol : por === '-a' ? flip(iol) : por === 'b' ? ior : por === '-b' ? flip(ior) : 'a';
    return { matches: [], otherLeft, otherRight };
  }

  function flip(r: Remainder): Remainder {
    return (r[0] === '-' ? r[1] : '-' + r) as Remainder;
  }

}
