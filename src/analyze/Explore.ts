namespace Flexagonator {

  // object that can explore all the states available
  // starting from an initial state
  // and applying any of a given set of flexes
  export class Explore {
    private readonly flexes: Flexes;  // flexes to explore with other than <>^
    private readonly right: Flex;     // >
    private readonly over: Flex;      // ^
    // the following two collections are aligned with each other
    private flexagons: Flexagon[] = [];
    private tracker: Tracker;
    private current: number;

    constructor(flexagon: Flexagon, flexes: Flexes, right: Flex, over: Flex) {
      // initialize flexes
      this.right = right;
      this.over = over;
      this.flexes = {};
      for (var f in flexes) {
        if (f !== '>' && f !== '<' && f !== '^') {
          this.flexes[f] = flexes[f];
        }
      }

      // initialize flexagon tracking
      this.flexagons.push(flexagon);
      this.tracker = new Tracker(flexagon);
      this.current = 0;
    }

    getTotalStates(): number {
      return this.flexagons.length;
    }

    getExploredStates(): number {
      return this.current;
    }

    // check the next unexplored state
    // returns false once there are no more states to explore
    checkNext(): boolean {
      if (this.current === this.flexagons.length) {
        return false;
      }

      // rotate & flip over, applying all flexes at each step
      var flexagon = this.flexagons[this.current];
      const count = flexagon.getPatCount();
      this.checkAllFlexes(flexagon);
      for (var i = 1; i < count; i++) {
        flexagon = this.right.apply(flexagon) as Flexagon;
        this.checkAllFlexes(flexagon);
      }
      flexagon = this.over.apply(flexagon) as Flexagon;
      this.checkAllFlexes(flexagon);
      for (var i = 1; i < count; i++) {
        flexagon = this.right.apply(flexagon) as Flexagon;
        this.checkAllFlexes(flexagon);
      }

      this.current++;
      return true;
    }

    // apply every flex at the current vertex,
    // every time we find a new state, track it
    private checkAllFlexes(flexagon: Flexagon) {
      for (var f in this.flexes) {
        const newFlexagon = this.flexes[f].apply(flexagon);
        if (!isFlexError(newFlexagon)) {
          const result = this.tracker.findMaybeAdd(newFlexagon);
          if (result === null) {
            // we have a new state
            this.flexagons.push(newFlexagon);
          }
        }
      }
    }

  }
}
