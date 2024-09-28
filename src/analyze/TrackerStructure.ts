namespace Flexagonator {

  /**
   * group a list of flexagons by their structure (ignoring leaf ids)
   * and return the grouped flexagon indices
   */
  export function groupByStructure(flexagons: Flexagon[]): number[][] {
    const groups: number[][] = [];
    const tracker = new TrackerStructure();
    flexagons.forEach((flexagon, i) => {
      const which = tracker.findMaybeAdd(flexagon);
      if (groups[which] === undefined) {
        groups[which] = [i];
      } else {
        groups[which].push(i);
      }
    });
    return groups;
  }

  /** tracks pat structure we've seen before, ignoring leaf ids */
  export class TrackerStructure {
    private states: StructureState[] = [];

    getTotalStates(): number {
      return this.states.length;
    }

    // if we've seen this flexagon before, return which one,
    // else add it to our list and return it's new index
    findMaybeAdd(flexagon: Flexagon): number {
      const state = new StructureState(flexagon);
      const i = this.getIndex(state);
      if (i !== null) {
        return i;
      }
      this.states.push(state);
      return this.states.length - 1;
    }

    // returns which state we have, or null if we haven't seen it before
    private getIndex(state: StructureState): number | null {
      const i = this.states.findIndex(thisState => thisState.isEqualTo(state));
      return i !== -1 ? i : null;
    }
  }

  export class StructureState {
    // we serialize the pats from both sides since we don't know how the
    // flexagon is oriented relative to other states we'll see
    private readonly stateA: string[];
    private readonly stateB: string[];

    constructor(flexagon: Flexagon) {
      this.stateA = flexagon.pats.map(p => p.getStructure());
      this.stateB = flexagon.pats.map(p => p.makeFlipped().getStructure()).reverse();
    }

    /** are the pat structures of 'this' & 'state' the same? */
    isEqualTo(state: StructureState): boolean {
      const patCount = state.stateA.length;
      for (let i = 0; i < patCount; i++) {
        if (areEqual(patCount, this.stateA, state.stateA, i)) {
          return true;
        }
      }
      for (let i = 0; i < patCount; i++) {
        if (areEqual(patCount, this.stateB, state.stateA, i)) {
          return true;
        }
      }
      return false;
    }
  }

  /** is state1[i] = state2[start+i] for every i? */
  function areEqual(len: number, state1: string[], state2: string[], start: number): boolean {
    for (let i = 0; i < len; i++) {
      if (state1[i] !== state2[(i + start) % len]) {
        return false;
      }
    }
    return true;
  }

}
