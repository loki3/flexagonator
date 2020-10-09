namespace Flexagonator {

  /**
   * a description of relevant pat structure relative to a particular hinge
   */
  export interface AtomicPattern {
    /** pats to the left of the relevant pats */
    readonly otherLeft: Remainder;
    /** the important pat structure to the immediate left of a particular hinge */
    readonly left: ConnectedPats | null;
    /** the important pat structure to the immediate right of a particular hinge */
    readonly right: ConnectedPats | null;
    /** pats to the right of the relevant pats */
    readonly otherRight: Remainder;
    /** if there's only a single leaf, ignore direction in connected pats */
    readonly singleLeaf: boolean;
  }

  export function getAtomicPatternDirections(pattern: AtomicPattern): PatDirection[] {
    const left: PatDirection[] = pattern.left == null ? [] : pattern.left.map(cp => cp.direction);
    const right: PatDirection[] = pattern.right == null ? [] : pattern.right.map(cp => cp.direction);
    return left.concat(right);
  }


  /** a label (a or b) and (un)flipped for the pats not relevant for an AtomicPattern */
  export type Remainder = 'a' | '-a' | 'b' | '-b';
  export type PatDirection = '\\' | '/';

  /** a single pat + information about how it's connected to next pat in chain */
  export interface ConnectedPat {
    readonly pat: Pat;
    // with triangle base to the left, which side is next pat attached to?
    // \ means the one to the upper left, / the one to the lower right
    readonly direction: PatDirection;
  }
  export type ConnectedPats = ReadonlyArray<ConnectedPat>;

  export function connectedPatToString(pat: ConnectedPat): string {
    return pat.pat.getString() + ' ' + pat.direction;
  }

  export function getPatsCount(chunk: ConnectedPats | null | undefined): number {
    return (chunk === null || chunk === undefined) ? 0 : chunk.length;
  }
  export function getLeafCount(pats: ConnectedPats | null): number {
    if (pats === null) {
      return 0;
    }
    return pats.reduce((total, pat) => total + pat.pat.getLeafCount(), 0);
  }

  export function flipRemainder(r: Remainder): Remainder {
    return (r[0] === '-' ? r[1] : '-' + r) as Remainder;
  }
  export function flipConnectedPats(cp?: ConnectedPats): ConnectedPats | undefined {
    if (cp === undefined) {
      return undefined;
    }
    return cp.map(p => { return { pat: p.pat.makeFlipped(), direction: p.direction } });
  }

}
