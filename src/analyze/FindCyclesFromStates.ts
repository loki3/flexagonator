namespace Flexagonator {

  /**
   * Find flex sequences that cycle starting from a state within a list of flexagon states.
   * It loops through all flexagon states, finding the shortest flex sequence from
   * 'start' to each other state, checking if that sequence can be used to create a cycle.
   */
  export class FindCyclesFromStates implements FindCycles {
    private error: FindCycleError | null = null;
    // state referenced during iterations
    private readonly right;
    private readonly over;
    private readonly numPats;
    // iteration state
    private stepState = -1;
    private cyclesDone = false;
    private findSequence?: FindShortest;
    // results
    private cycles: CycleInfo[] = [];

    /**
     * @param states a list of flexagon states (perhaps the output of Explore())
     * @param start index of state to start from
     * @param flexes try sequences that use these flexes
     */
    constructor(
      private readonly states: Flexagon[],
      private readonly start: number,
      private readonly flexes: Flexes
    ) {
      this.right = flexes['>'];
      this.over = flexes['^'];
      if (this.right === undefined || this.over === undefined) {
        this.error = { findCycleError: "need definitions for > and ^" };
      }
      if (start < 0 || start >= this.states.length) {
        this.error = { findCycleError: "invalid start" };
      }
      this.numPats = states[0].getPatCount();
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
      if (!this.cyclesDone) {
        return this.checkNextCycle();
      }
      return false;
    }

    /** get info about cycles that were found */
    getCycles(): CycleInfo[] {
      return this.cycles;
    }

    /** get error explanation, if any */
    getError(): FindCycleError | null {
      return this.error;
    }

    /** total number of steps to check */
    getTotalSteps(): number {
      return this.states.length - 1;
    }
    /** which step we're on */
    getCurrentStep(): number {
      return this.stepState;
    }
    /** how many cycles we've found */
    getFoundCount(): number {
      return this.cycles.length;
    }

    /** a single step in our search for cycles, returns false once it's done */
    private checkNextCycle(): boolean {
      // if needed, start a new search from 'start' to the next state
      if (this.findSequence === undefined) {
        this.startNew();
      }
      // signal that we're done
      if (this.findSequence === undefined) {
        this.cyclesDone = true;
        return false;
      }

      // continue search for sequence from 'start' to current target
      if (this.findSequence.checkLevel()) {
        return true;  // keep going
      }

      // now that we have a sequence, see if it can be used for a cycle
      const sequence = this.findSequence.getFlexes();
      this.findSequence = undefined;
      this.findCycles(sequence);
      return true;
    }

    /** start a new search from 'start' to the next state in our list of flexagon states */
    private startNew() {
      // figure out flexagon to search to
      if (++this.stepState === this.start) {
        this.stepState++; // don't go from start-to-start
      }
      if (this.stepState >= this.states.length) {
        return; // no more left so we're done
      }

      // start search to next flexagon state
      const start = this.states[this.start];
      const end = this.states[this.stepState];
      this.findSequence = new FindShortest(start, end, this.flexes, this.right, this.over);
    }

    /** if a flex sequence can be used to create a cycle, add it to our list */
    private findCycles(sequence: string) {
      const f1 = this.states[this.start];
      const fm = new FlexagonManager(f1, undefined, this.flexes);
      fm.applyFlexes(sequence, false);

      let extra = "";
      for (let i = 0; i < f1.getPatCount(); i++) {
        fm.applyFlex(">");
        extra += ">";
        const check = getCycleLength(fm.flexagon, this.flexes, sequence + extra);
        if (check !== null) {
          // found a cycle, add to list
          const normalized = normalizeSequence(sequence + extra, this.numPats);
          this.cycles.push({ sequence: normalized, cycleLength: check });
        }
      }

      fm.applyFlex("^");
      extra = "^";
      for (let i = 0; i < f1.getPatCount(); i++) {
        fm.applyFlex(">");
        extra += ">";
        const check = getCycleLength(fm.flexagon, this.flexes, sequence + extra);
        if (check !== null) {
          // found a cycle, add to list
          const normalized = normalizeSequence(sequence + extra, this.numPats);
          this.cycles.push({ sequence: normalized, cycleLength: check });
        }
      }
    }
  }

  /**
   * find out how long it takes flex sequence to cycle back to original state
   * @returns number of repeats in cycle, or null if it doesn't cycle
   */
  function getCycleLength(original: Flexagon, flexes: Flexes, sequence: string): number | null {
    const fm = new FlexagonManager(original, undefined, flexes);
    for (let i = 0; i < maxIterations; i++) {
      if (fm.applyFlexes(sequence, false) !== true) {
        return null;  // can't apply flex so it doesn't cycle
      }
      if (original.isSameState(fm.flexagon)) {
        return i + 1;
      }
    }
    return -1;
  }
  const maxIterations = 1000;
}
