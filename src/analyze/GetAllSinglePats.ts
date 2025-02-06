namespace Flexagonator {

  export interface PatResults {
    /** all the different leaf arrangements in a single pat */
    readonly pats: Pat[];
    /** the direction to the next pat after this one */
    readonly direction: Direction;
  }

  /**
   * Get a list of all the ways to fold a template into a single pat, or null if none
   * @param directions directions between leaves in the template to fold, e.g. /\\///
   */
  export function getAllSinglePats(directions: string, flexes: FoldFlexes): PatResults | null {
    const dirs = toDirections(directions);
    if (dirs === null) {
      return null;
    }
    const template = toPattern(dirs);
    return tryFolds(template, flexes);
  }

  /** the basic flexes needed to fold a strip */
  export class FoldFlexes {
    private readonly allFlexes = makeAtomicFlexes('blocks');

    shiftRight(pattern: AtomicPattern): AtomicPattern | false {
      const result = this.allFlexes['>'].apply(pattern);
      return isAtomicPatternError(result) ? false : result;
    }
    shiftLeft(pattern: AtomicPattern): AtomicPattern | false {
      const result = this.allFlexes['<'].apply(pattern);
      return isAtomicPatternError(result) ? false : result;
    }
    foldRight(pattern: AtomicPattern): AtomicPattern | false {
      const result = this.allFlexes["Ur'"].apply(pattern);
      return isAtomicPatternError(result) ? false : result;
    }
    foldLeft(pattern: AtomicPattern): AtomicPattern | false {
      const result = this.allFlexes["Ul'"].apply(pattern);
      return isAtomicPatternError(result) ? false : result;
    }

    /** reset current hinge to far left */
    reset(pattern: AtomicPattern): AtomicPattern {
      let attempt: AtomicPattern | false = pattern;
      while (attempt !== false) {
        pattern = attempt;
        attempt = this.shiftLeft(pattern);
      }
      return pattern;
    }
  }

  function toDirections(directions: string): Direction[] | null {
    const dirs: Direction[] = [];
    for (const d of directions) {
      if (d === '/') dirs.push('/');
      else if (d === '\\' || d === '|') dirs.push('\\');
      else return null;
    }
    return dirs;
  }

  /** e.g., /\\ into 'a # 1 / 2 \ 3 \ b' */
  function toPattern(directions: Direction[]): AtomicPattern {
    const right: ConnectedPats = directions.map((d, i) => {
      return { pat: makePat(i + 1) as Pat, direction: d }
    });
    return {
      otherLeft: 'a',
      left: null,
      right,
      otherRight: 'b',
      singleLeaf: false,
    }
  }

  /**
   * try folding at every hinge, recursing whenever successful
   * @returns list of all ways it can be folded into a single pat
   */
  function tryFolds(pattern: AtomicPattern, flexes: FoldFlexes): PatResults | null {
    const count = getPatsCount(pattern.left) + getPatsCount(pattern.right);
    if (count <= 1) {
      // we're down to a single pat, so return it
      const pats = getAtomicPatternPats(pattern);
      const dirs = getAtomicPatternDirections(pattern);
      const direction = dirs[dirs.length - 1];
      return { pats, direction };
    }

    // at each hinge, try folding left & right, recursing on success
    let pats: Pat[] = [];
    let direction: Direction = '/';
    pattern = flexes.reset(pattern);
    for (let i = 0; i < count; i++) {
      const tryLeft = flexes.foldLeft(pattern);
      if (tryLeft) {
        const pr = tryFolds(tryLeft, flexes);
        if (pr !== null) {
          pats = addNonDupes(pats, pr.pats);
          direction = pr.direction;
        }
      } else {
        const tryRight = flexes.foldRight(pattern);
        if (tryRight) {
          const pr = tryFolds(tryRight, flexes);
          if (pr !== null) {
            pats = addNonDupes(pats, pr.pats);
            direction = pr.direction;
          }
        }
      }

      // step to next hinge
      const next = flexes.shiftRight(pattern);
      pattern = next ? next : pattern;
    }

    return pats.length === 0 ? null : { pats, direction };
  }

  function addNonDupes(pats1: Pat[], pats2: Pat[]): Pat[] {
    const pats = pats1.concat([]);
    for (const p2 of pats2) {
      if (pats.every(p => !p.isEqual(p2))) {
        pats.push(p2);
      }
    }
    return pats;
  }

}
