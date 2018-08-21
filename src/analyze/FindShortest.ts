namespace Flexagonator {

  // represents a single step in one level of the breadth first search
  interface Step {
    readonly flex: RelativeFlex;
    readonly previous: number;   // points into Step[] from previous level
  }
  // represents every step explored at one level of the breadth first search
  type Level = Step[];

  // object that searches for the shortest flex sequence from a starting state
  // to an ending state using a given set of sequences.
  // NOTE: returns the first sequence it finds, though
  // there may be others of the same length
  export class FindShortest {
    private readonly flexes: Flexes;          // flexes to explore with other than <>^
    private readonly right: Flex;             // >
    private readonly over?: Flex;             // ^

    // array of levels of the breadth-first search
    private levels: Level[] = [];
    // the following 2 collections are aligned with each other
    private flexagons: Flexagon[] = [];
    private tracker: Tracker;
    private readonly target: number;  // where the desired end state is in 'tracker'
    private found: boolean = false;

    static make(start: LeafTree[], end: LeafTree[], flexes: Flexes, right: Flex, over?: Flex): FindShortest | TreeError {
      const startFlexagon = Flexagon.makeFromTree(start);
      if (isTreeError(startFlexagon)) {
        return startFlexagon;
      }
      const endFlexagon = Flexagon.makeFromTree(end);
      if (isTreeError(endFlexagon)) {
        return endFlexagon;
      }
      return new FindShortest(startFlexagon, endFlexagon, flexes, right, over);
    }

    // we're at 'start' and we want to find the shortest flex sequence from 'flexes'
    // that will take us to 'end'
    constructor(start: Flexagon, end: Flexagon, flexes: Flexes, right: Flex, over?: Flex) {
      // initialize flexes
      this.right = right;
      this.over = over;
      this.flexes = {};
      for (const f in flexes) {
        if (f !== '>' && f !== '<' && f !== '^') {
          this.flexes[f] = flexes[f];
        }
      }

      // initialize flexagon tracking
      this.flexagons.push(start);
      this.tracker = Tracker.make(start);
      this.flexagons.push(end);
      this.target = this.tracker.findMaybeAdd(end) === null ? 1 : 0;
      // add first level of search
      const relflex = new RelativeFlex(0, false, "", 0);
      const level: Step[] = [{ flex: relflex, previous: -1 }];
      this.levels.push(level);
    }

    wasFound(): boolean {
      return this.found;
    }

    // the max number of flexes we considered
    getMaxDepth(): number {
      return this.levels.length;
    }

    // if the target flexagon was found, get the flex sequence used
    getFlexes(): string {
      if (!this.found) {
        return "";
      }

      let flexes = "";
      const finalLevel = this.levels[this.levels.length - 1];
      let stepN = finalLevel.length - 1;
      for (let i = this.levels.length - 1; i >= 0; i--) {
        const step = this.levels[i][stepN];
        flexes = step.flex.getSequence() + ' ' + flexes;
        stepN = step.previous;
      }
      return flexes;
    }

    // returns false once the search is done
    checkLevel(): boolean {
      const lastLevel = this.levels[this.levels.length - 1];
      if (lastLevel.length === 0) {
        // we found nothing in the last level, so the search failed
        return false;
      }
      const thisLevel: Level = [];
      this.levels.push(thisLevel);

      // check every step in the last level of our breadth first search
      for (let whichStep = 0, len = lastLevel.length; whichStep < len; whichStep++) {
        const flexagon = this.flexagons[lastLevel[whichStep].flex.toState];
        if (!this.checkStep(flexagon, thisLevel, whichStep)) {
          this.found = true;
          return false;
        }
      }
      return true;
    }

    // find all the flexes we can perform from this flexagon,
    // add any new states to 'level', referencing 'previousStep'.
    // return false if we've found the target flexagon
    private checkStep(flexagon: Flexagon, level: Level, previousStep: number): boolean {
      const count = flexagon.getPatCount();
      const original = flexagon;

      // rotate & flip over, applying all flexes each time
      if (!this.checkAllFlexes(flexagon, level, previousStep, 0, false))
        return false;
      for (let i = 1; i < count; i++) {
        flexagon = this.right.apply(flexagon) as Flexagon;
        if (!this.checkAllFlexes(flexagon, level, previousStep, i, false))
          return false;
      }
      if (this.over) {
        flexagon = this.over.apply(original) as Flexagon;
        if (!this.checkAllFlexes(flexagon, level, previousStep, 0, true))
          return false;
        for (let i = 1; i < count; i++) {
          flexagon = this.right.apply(flexagon) as Flexagon;
          if (!this.checkAllFlexes(flexagon, level, previousStep, i, true))
            return false;
        }
      }

      return true;
    }

    // apply every flex at the current vertex,
    // every time we find a new state, track it.
    // return false if we've found the target flexagon
    private checkAllFlexes(flexagon: Flexagon, level: Level, previousStep: number, rights: number, over: boolean): boolean {
      for (const f in this.flexes) {
        const newFlexagon = this.flexes[f].apply(flexagon);
        if (!isFlexError(newFlexagon)) {
          let result = this.tracker.findMaybeAdd(newFlexagon);
          if (result === null) {
            // we have a new state
            this.flexagons.push(newFlexagon);
            result = this.flexagons.length - 1;
            // push new step onto the current level of the search
            const relflex = new RelativeFlex(rights, over, f, result);
            level.push({ flex: relflex, previous: previousStep });
          } else if (result === this.target) {
            // we're done with the search
            const relflex = new RelativeFlex(rights, over, f, result);
            level.push({ flex: relflex, previous: previousStep });
            return false;
          }
        }
      }
      return true;
    }

  }
}
