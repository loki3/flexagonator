namespace Flexagonator {

  /**
   * turn an AtomicPattern into a string, e.g. "a [1,2] \ # 3 / -b"
   */
  export function atomicPatternToString(pattern: AtomicPattern): string {
    const reversed = reverseConnected(pattern.left);
    const leftPats = reversed === null ? '' : reversed.map(p => p.pat.getString() + ' ' + p.direction).join(' ');
    const rightPats = pattern.right === null ? '' : pattern.right.map(p => p.pat.getString() + ' ' + p.direction).join(' ');
    const left = pattern.left === null ? pattern.otherLeft : pattern.otherLeft + ' ' + leftPats;
    const right = pattern.right === null ? pattern.otherRight : rightPats + ' ' + pattern.otherRight;
    return [left, '#', right].join(' ');
  }

  /**
   * parse a string to create an AtomicPattern, e.g. "a [1,2] \ # 3 / -b"
   */
  export function stringToAtomicPattern(s: string): AtomicPattern | AtomicParseError {
    const pieces = s.split('#');
    if (pieces.length !== 2) {
      return { atomicParseCode: "NeedOneHinge", input: s };
    }

    // break into the appropriate pieces
    const left = getLeft(pieces[0].trim());
    if (isAtomicParseError(left)) {
      return { atomicParseCode: left.atomicParseCode, input: s, context: left.input };
    }
    const right = getRight(pieces[1].trim());
    if (isAtomicParseError(right)) {
      return { atomicParseCode: right.atomicParseCode, input: s, context: right.input };
    }

    const ignoreDirection = (getLeafCount(left[1]) + getLeafCount(right[1])) <= 1;

    return { otherLeft: left[0], left: left[1], right: right[1], otherRight: right[0], singleLeaf: ignoreDirection };
  }

  export interface AtomicParseError {
    readonly atomicParseCode: AtomicParseCode;
    readonly input: string;
    readonly context?: string;
  }
  export type AtomicParseCode =
    | "MissingOtherLeft"
    | "MissingOtherRight"
    | "NeedOneHinge"
    | "NeedMatchedPatsAndDirections"
    | "CantParsePatStructure"
    ;
  export function isAtomicParseError(result: any): result is AtomicParseError {
    return (result !== null) && (result as AtomicParseError).atomicParseCode !== undefined;
  }

  // get otherLeft & left
  function getLeft(s: string): [Remainder, ConnectedPats | null] | AtomicParseError {
    // figure out otherLeft
    let otherLeft;
    if (s.startsWith('a') || s.startsWith('b')) {
      otherLeft = s[0];
      s = s.substring(2);
    } else if (s.startsWith('-a') || s.startsWith('-b')) {
      otherLeft = s.substring(0, 2);
      s = s.substring(3);
    } else {
      return { atomicParseCode: "MissingOtherLeft", input: s };
    }

    const left = parseConnectedPats(s);
    if (isAtomicParseError(left)) {
      return left;
    }

    const reversed = reverseConnected(left);
    return [otherLeft as Remainder, reversed];
  }

  // get otherRight & right
  function getRight(s: string): [Remainder, ConnectedPats | null] | AtomicParseError {
    // figure out otherRight
    let otherRight;
    const len = s.length;
    if (s.endsWith('-a') || s.endsWith('-b')) {
      otherRight = s.substring(len - 2);
      s = s.substring(0, len - 3);
    } else if (s.endsWith('a') || s.endsWith('b')) {
      otherRight = s.substring(len - 1);
      s = s.substring(0, len - 2);
    } else {
      return { atomicParseCode: "MissingOtherRight", input: s };
    }

    const right = parseConnectedPats(s);
    if (isAtomicParseError(right)) {
      return right;
    }

    return [otherRight as Remainder, right];
  }

  function parseConnectedPats(s: string): ConnectedPats | null | AtomicParseError {
    if (s.length === 0) {
      return null;
    }
    if (s === '1') {
      return [{ pat: makePat(1) as Pat, direction: '/' }];
    }

    const pieces = breakIntoPieces(s);
    if (isAtomicParseError(pieces)) {
      return pieces;
    }

    return piecesToPats(pieces);
  }

  // "[1,-2] \ 3 /" into ["[1,-2]", "\", "3", "/"]
  function breakIntoPieces(s: string): string[] | AtomicParseError {
    const p = s.split(/([0-9-\[\]\,\s]+)(\\|\/)/g);
    const p2 = p.filter(e => e != '').map(e => e.trim());
    if (p2.length % 2 === 1) {
      return { atomicParseCode: "NeedMatchedPatsAndDirections", input: s };
    }
    return p2;
  }

  function piecesToPats(pieces: string[]): ConnectedPats | AtomicParseError {
    const pats: ConnectedPat[] = [];
    for (let i = 0; i < pieces.length; i += 2) {
      const leaftree = parseLeafTree(pieces[i]);
      if (isAtomicParseError(leaftree)) {
        return leaftree;
      }
      const pat = makePat(leaftree);
      if (isTreeError(pat)) {
        return { atomicParseCode: "CantParsePatStructure", input: pieces[i] };
      }
      const current = { pat, direction: pieces[i + 1] } as ConnectedPat;
      pats.push(current);
    }
    return pats;
  }

  function parseLeafTree(s: string): LeafTree | AtomicParseError {
    try {
      return JSON.parse(s);
    } catch (e) {
      return { atomicParseCode: "CantParsePatStructure", input: s };
    }
  }

  function reverseConnected(pats: ConnectedPats | null): ConnectedPats | null {
    return pats === null ? null : pats.map((_, i) => pats[pats.length - i - 1]);
  }

}
