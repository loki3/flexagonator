namespace Flexagonator {

  /**
   * Find flex sequences that cycle starting from a given state within a list of flexagon states.
   * Restrict search to states that start & end with the same pat structure.
   * @param states a list of flexagon states (perhaps the output of Explore())
   * @param start index of state to start from
   * @param flexes try sequences that use these flexes
   * @returns list of cyclic flex sequences or error
   */
  export function findGroupCycles(
    states: Flexagon[], start: number, flexes: Flexes
  ): CycleInfo[] | GroupCycleError {
    const right = flexes['>'];
    const over = flexes['^'];
    if (right === undefined || over === undefined) {
      return { groupCycleError: "need definitions for > and ^" };
    }

    // get list of target states that share pat structure
    const searchStates = findStructureGroup(states, start);
    if (searchStates === null) {
      return { groupCycleError: "invalid start" };
    } else if (searchStates.length === 0) {
      return { groupCycleError: "no other states with same pat structure" };
    }

    // find structure preserving sequence from start to each target
    const original = states[start];
    const sequences = searchStates.map(i => findSequence(original, states[i], flexes, right, over));
    // figure out how long each cycle is
    const cycles = sequences.map(sequence => {
      const cycleLength = getCycleLength(original, flexes, sequence);
      return { sequence, cycleLength };
    });
    return cycles;
  }

  /** flex sequence + how many times you apply it so it cycles back to original state */
  export interface CycleInfo {
    readonly sequence: string;
    readonly cycleLength: number;
  }

  /** explain why findGroupCycles failed */
  export interface GroupCycleError {
    readonly groupCycleError:
    | 'need definitions for > and ^'
    | 'no other states with same pat structure'
    | 'invalid start';
  }
  export function isGroupCycleError(result: any): result is GroupCycleError {
    return result && (result as GroupCycleError).groupCycleError !== undefined;
  }

  /** return the indices into 'states' of all the flexagons that share the pat structure of states[index] */
  function findStructureGroup(states: Flexagon[], index: number): number[] | null {
    const groups: number[][] = groupByStructure(states);
    for (let i = 0; i < groups.length; i++) {
      for (const j of groups[i]) {
        if (j === index) {
          return groups[i].filter(k => k !== index);
        }
      }
    }
    return null;
  }

  /** find a structure-preserving flex sequence that goes from 'start' to 'end' */
  function findSequence(
    start: Flexagon, end: Flexagon, flexes: Flexes, right: Flex, over: Flex
  ): string {
    // find a sequence between two states
    const find = new FindShortest(start, end, flexes, right, over);
    while (find.checkLevel()) { }
    // see if extra shifts are needed to preserve pat structure
    const sequence = find.getFlexes();
    const extra = extraNeeded(start, sequence, flexes, right, over);
    return extra === null ? "" : extra === "" ? sequence : `${sequence} ${extra}`;
  }

  /** return any additional shifts needed to preserve the pat structure, or null if not supported */
  function extraNeeded(f1: Flexagon, sequence: string, flexes: Flexes, right: Flex, over: Flex): string | null {
    const fm = new FlexagonManager(f1, undefined, flexes);
    fm.applyFlexes(sequence, false);

    let extra = "";
    for (let i = 0; i < f1.getPatCount(); i++) {
      if (f1.isSameStructure(fm.flexagon)) {
        return extra;
      }
      fm.applyFlex(">");
      extra += ">";
    }

    fm.applyFlex("^");
    extra = "^";
    for (let i = 0; i < f1.getPatCount(); i++) {
      if (f1.isSameStructure(fm.flexagon)) {
        return extra;
      }
      fm.applyFlex(">");
      extra += ">";
    }

    return null;
  }

  /**
   * find out how long it takes flex sequence to cycle back to original state,
   * assumes we already know that 'sequence' preserves the original pat structure
   */
  function getCycleLength(original: Flexagon, flexes: Flexes, sequence: string): number {
    const fm = new FlexagonManager(original, undefined, flexes);
    for (let i = 0; i < maxIterations; i++) {
      fm.applyFlexes(sequence, false);
      if (original.isSameState(fm.flexagon)) {
        return i + 1;
      }
    }
    return -1;
  }
  const maxIterations = 1000;
}
