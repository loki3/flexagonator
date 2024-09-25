namespace Flexagonator {

  /** information about the group generated from given flex sequences */
  export interface GroupFromFlexes {
    /** flex sequences used as generators */
    readonly sequences: string[];
    /** the length of the cycle for each generator flex sequence */
    readonly cycleLengths: number[];

    /** refers to flex sequences as a, b, etc., with a2=aa, a3=aaa, etc. */
    readonly groupElements: string[];
    /** actual flex sequences to use for each element */
    readonly flexElements: string[];

    /** row[i][j] contains the result of sequence[i] * sequence[j] as an index into elements */
    readonly rows: number[][];
    /** if ab = ba for every a & b */
    readonly commutative: boolean;
  }

  /** explain why the generators don't create a group */
  export interface GroupError {
    readonly reason: 'not-cyclic' | 'changes-structure' | 'bad-numpats' | 'unsupported-flex';
    readonly sequences?: string[];
  }

  /** maximum number of repeats when checking for a cycle */
  const defaultMaxCycle = 100;

  /**
   * return info about the group created by using the given
   * flex sequences as the generators, or error if it doesn't form a group
   * @returns if it forms a group then return the Cayley table of the resulting group,
   * else explain why it's not a group
   */
  export function getGroupFromSequences(
    sequences: string[], numpats: number, directions?: Directions, maxCycle?: number
  ): GroupFromFlexes | GroupError {
    // make a flexagon with the appropriate size & directions but no pat structure
    const tree = new Array(numpats).fill(0).map((_, i) => i + 1); // unique ids for leaves
    const plain = Flexagon.makeFromTree(tree, undefined, directions);
    if (isTreeError(plain)) {
      return { reason: 'bad-numpats' };
    }
    const plainFm = FlexagonManager.make(plain);

    // check each flex sequence for its cycle
    const flexSequences = sequences.map(s => parseFlexSequence(s));
    const cycleCount = flexSequences.map(s => genTillCycle(plainFm, s, maxCycle !== undefined ? maxCycle : defaultMaxCycle));
    if (cycleCount.some(c => isFlexError(c))) {
      const invalid = cycleCount.map(e => isFlexError(e) ? e.flexName : undefined).filter(e => e !== undefined) as string[];
      return { reason: 'unsupported-flex', sequences: invalid };
    }
    const noCycle = cycleCount.map((c, i) => c === false ? sequences[i] : null).filter(s => s !== null);
    if (noCycle.length > 0) {
      return { reason: 'not-cyclic', sequences: noCycle as string[] };
    }

    // create minimal pat structure & validate that the sequences preserve it
    const flexElements = makeFlexElements(flexSequences, cycleCount as number[]);
    const minimalFlexagon = makeMinimalFlexagon(plainFm, flexElements);
    if (changesStructure(minimalFlexagon, flexSequences)) {
      return { reason: 'changes-structure' };
    }
    const minimalFm = FlexagonManager.make(minimalFlexagon);

    // build table
    const groupElements = makeGroupElements(cycleCount as number[]);
    const rows = makeRows(minimalFm, flexElements);
    const commutative = isCommutative(rows);
    const table: GroupFromFlexes = {
      sequences,
      cycleLengths: cycleCount as number[],
      groupElements: groupElements,
      flexElements: flexElements.map(seq => seq.map(f => f.fullName)).map(seq => seq.join('')),
      rows,
      commutative,
    };
    return table;
  }

  /** check how long it takes for the flex sequence to cycle on the given flexagon, creating pat structure as needed */
  function genTillCycle(plainFm: FlexagonManager, sequence: FlexName[], maxCycle: number): number | false | FlexError {
    const genSequence = sequence.map(s => s.getGenerator());
    let lastCount = plainFm.flexagon.getLeafCount();
    for (let i = 0; i < maxCycle; i++) {
      // apply generating sequence
      const result = plainFm.applyFlexes(genSequence, false);
      if (isFlexError(result)) {
        return result;
      }
      // once we didn't need to add any leaves, we have enough pat structure to check for cycle
      const thisCount = plainFm.flexagon.getLeafCount();
      if (lastCount === thisCount) {
        return checkForCycle(plainFm, genSequence, i - 1, maxCycle);
      }
      lastCount = thisCount;
    }
    // we added leaves every time, so no cycle
    return false;
  }

  /** if 'sequence' cycles on the flexagon, return how many times before it cycles */
  function checkForCycle(fm: FlexagonManager, sequence: FlexName[], minCycle: number, maxCycle: number): number | false {
    const original = fm.flexagon.pats;
    minCycle = minCycle < 1 ? 1 : minCycle;
    for (let i = 0; i < maxCycle; i++) {
      fm.applyFlexes(sequence, false);
      const current = fm.flexagon.pats;
      if (i >= minCycle && original.every((p, pi) => p.isEqual(current[pi]))) {
        return i + 1;
      }
    }
    return false;
  }

  /** create all the flex sequences used to create the table */
  function makeFlexElements(genSequences: FlexName[][], cycleLengths: number[]): FlexName[][] {
    const all: FlexName[][] = [];
    for (let i = 0; i < cycleLengths.length; i++) {
      // create the list for the next sequence, e.g., (AB, ABAB, ABABAB) if sequence is a 4-cycle
      const thisSet: FlexName[][] = [];
      let thisOne: FlexName[] = [];
      for (let j = 0; j < cycleLengths[i] - 1; j++) {
        thisOne = thisOne.concat(genSequences[i]);
        thisSet.push(thisOne);
      }
      // add to overall list
      const prevLen = all.length;
      thisSet.forEach(e => all.push(e));  // add new cycle
      for (let j = 0; j < prevLen; j++) { // add each item in new cycle to each previous element
        thisSet.forEach(el => all.push(el.concat(all[j])));
      }
    }
    return [[makeFlexName('I')]].concat(all);
  }

  /** create all the sequences used to create the table, using a, b, etc. as shorthand */
  function makeGroupElements(cycleLengths: number[]): string[] {
    const all: string[] = [];
    for (let i = 0; i < cycleLengths.length; i++) {
      // create the list for the next sequence, e.g., (b, b2, b3) if 2nd sequence is a 4-cycle
      const thisSet: string[] = [];
      for (let j = 0; j < cycleLengths[i] - 1; j++) {
        const thisChar = String.fromCharCode(97 + i);  // a, b, etc.
        const thisOne = j === 0 ? thisChar : thisChar + (j + 1).toString(); // a, a2, etc.
        thisSet.push(thisOne);
      }
      // add to overall list
      const prevLen = all.length;
      thisSet.forEach(e => all.push(e));
      for (let j = 0; j < prevLen; j++) {
        thisSet.forEach(el => all.push(el + all[j]));
      }
    }
    return ['e'].concat(all);
  }

  /** make the simplest flexagon that supports all the given flexes */
  function makeMinimalFlexagon(
    plainFm: FlexagonManager, sequences: FlexName[][]
  ): Flexagon {
    for (let i = 0; i < sequences.length; i++) {
      // create generating sequence for entire cycle of this flex sequence
      const genSequence = sequences[i].map(f => f.getGenerator());
      let genCycle: FlexName[] = [];
      for (let j = 0; j < sequences.length; j++) {
        genCycle = genCycle.concat(genSequence);
      }
      // apply cycle generating sequence so pat structure is added
      plainFm.applyFlexes(genCycle, false);
    }
    return plainFm.flexagon;
  }

  /** return true if any sequence changes the pat structure */
  function changesStructure(flexagon: Flexagon, sequences: FlexName[][]): boolean {
    const original = flexagon.pats;
    const fm = new FlexagonManager(flexagon);
    for (const sequence of sequences) {
      fm.applyFlexes(sequence, false);
      const current = fm.flexagon.pats;
      if (original.some((pat, i) => !pat.isEqualStructure(current[i]))) {
        return true;
      }
    }
    return false;
  }

  /** create the rows of the Cayley table for the group */
  function makeRows(fm: FlexagonManager, flexElements: FlexName[][]): number[][] {
    const rows: number[][] = [];
    fm.normalizeIds();

    // compute pat structure corresponding to each element
    const pats: Pat[][] = [];
    for (const e1 of flexElements) {
      fm.applyFlexes(e1, false);
      pats.push(fm.flexagon.pats);
      fm.undoAll();
    }

    // compute each row, checking which state each composition produces
    for (const e1 of flexElements) {
      const row: number[] = [];
      for (const e2 of flexElements) {
        fm.applyFlexes(e1, false);
        fm.applyFlexes(e2, false);
        const current = fm.flexagon.pats;
        const index = pats.findIndex(ps => ps.every((p, i) => p.isEqual(current[i])));
        row.push(index);
        fm.undoAll();
      }
      rows.push(row);
    }

    return rows;
  }

  /** check if ab = ba for every a & b */
  function isCommutative(rows: number[][]): boolean {
    for (let i = 1; i < rows.length; i++) {
      for (let j = i + 1; j < rows.length; j++) {
        if (rows[i][j] !== rows[j][i]) {
          return false;
        }
      }
    }
    return true;
  }

}

