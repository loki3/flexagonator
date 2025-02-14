namespace Flexagonator {

  /**
   * Find flex sequences that cycle starting from a given state within a list of flexagon states.
   * Restrict search to states that start & end with the same pat structure.
   */
  export class FindGroupCycles {
    private error: GroupCycleError | null = null;
    // state referenced during iterations
    private readonly right;
    private readonly over;
    // step 1
    private searchStates?: number[];
    // step 2
    private cyclesDone = false;
    private cyclesIndex = 0;
    private findSequence?: FindShortest;
    private cycles: CycleInfo[] = [];

    /**
     * @param states a list of flexagon states (perhaps the output of Explore())
     * @param start index of state to start from
     * @param flexes try sequences that use these flexes
     */
    constructor(private readonly states: Flexagon[], private readonly start: number, private readonly flexes: Flexes) {
      this.right = flexes['>'];
      this.over = flexes['^'];
      if (this.right === undefined || this.over === undefined) {
        this.error = { groupCycleError: "need definitions for > and ^" };
      }
    }

    /**
     * do next incremental step of finding cycles,
     * returns false once it's completely done or there's an error
     */
    checkNext(): boolean {
      if (this.error !== null || this.cyclesDone) {
        return false; // done
      }

      // next slice of work
      if (this.searchStates === undefined) {
        return this.findSearchStates();
      } else if (!this.cyclesDone) {
        return this.checkNextCycle();
      }
      return false;
    }

    /** get info about cycles that were found */
    getCycles(): CycleInfo[] {
      return this.cycles;
    }

    /** get error explanation, if any */
    getError(): GroupCycleError | null {
      return this.error;
    }

    /** total number of cycles, or 0 if we don't know yet */
    getCycleCount(): number {
      return this.searchStates !== undefined ? this.searchStates.length : 0;
    }
    /** how many cycles we've found */
    getFoundCount(): number {
      return this.cycles.length;
    }

    /** find all the flexagons with the same pat structure, which we'll search thru */
    private findSearchStates(): boolean {
      const searchStates = findStructureGroup(this.states, this.start);
      if (searchStates === null) {
        this.error = { groupCycleError: "invalid start" };
        return false;
      } else if (searchStates.length === 0) {
        this.error = { groupCycleError: "no other states with same pat structure" };
        return false;
      }
      this.searchStates = searchStates;
      return true;  // still more steps
    }

    /** find sequence that goes from start to next target & see how long it takes to cycle */
    private checkNextCycle(): boolean {
      if (this.searchStates === undefined) {
        return false;
      }

      const start = this.states[this.start];
      if (this.findSequence === undefined) {
        // start a new search for a sequence from start to next target
        const end = this.states[this.searchStates[this.cyclesIndex]];
        this.findSequence = new FindShortest(start, end, this.flexes, this.right, this.over);
        return true;  // keep going
      } else if (this.findSequence.checkLevel()) {
        return true;  // keep going
      }

      // done with search
      const result = this.findSequence.getFlexes();
      this.findSequence = undefined;

      // see if we need to shift to get back to original pat structure
      const extra = extraNeeded(start, result, this.flexes, this.right, this.over);
      const sequence = extra === null ? "" : extra === "" ? result : `${result} ${extra}`;

      // get length of cycle
      const cycleLength = getCycleLength(start, this.flexes, sequence);
      this.cycles.push({ sequence, cycleLength });
      // are we completely done?
      this.cyclesDone = ++this.cyclesIndex >= this.searchStates.length;
      return !this.cyclesDone;
    }
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
