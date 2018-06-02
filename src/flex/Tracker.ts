namespace Flexagonator {

  // tracks flexagons we've seen before
  export class Tracker {
    private states: State[] = [];
    private readonly keyId: number = 1;
    private current: number = 0;  // 0-based index into states

    constructor(flexagon: Flexagon) {
      this.findMaybeAdd(flexagon);
    }

    getTotalStates(): number {
      return this.states.length;
    }

    getCurrentState(): number {
      return this.current;
    }

    getCopy(): Tracker {
      // a temporary flexagon that gets replaced by a shallow copy
      // of this object's state (since its members are immutable)
      const temp = makeFlexagon([1, 2]) as Flexagon;
      const other = new Tracker(temp);
      other.states = this.states.map(x => x);
      other.current = this.current;
      return other;
    }

    // if we've seen this flexagon before, return which one,
    // else add it to our list and return null
    findMaybeAdd(flexagon: Flexagon): number | null {
      const state = new State(flexagon, this.keyId);
      const i = this.getIndex(state);
      if (i !== null) {
        this.current = i;
        return i;
      }
      this.states.push(state);
      this.current = this.states.length - 1;
      return null;
    }

    // returns which state we have, or null if we haven't seen it before
    private getIndex(state: State): number | null {
      for (var i = 0; i < this.states.length; i++) {
        const thisState = this.states[i];
        if (thisState.isEqualTo(state)) {
          return i;
        }
      }
      return null;
    }
  }


  // represents a flexagon state in such a way that's quick to compare
  // against others, while ignoring how it's rotated or flipped
  class State {
    private readonly state: string = "";

    constructor(flexagon: Flexagon, key: number) {
      const patcount = flexagon.getPatCount();

      // find which pat 'key' is in and whether it's face up or down
      var whichpat: number = 0;
      var faceup = true;
      for (var i = 0; i < patcount; i++) {
        const whereKey = flexagon.pats[i].findId(key);
        if (whereKey != WhereLeaf.NotFound) {
          whichpat = i;
          faceup = (whereKey == WhereLeaf.Found);
          break;
        }
      }

      // build up a string that represents the normalized form,
      // where 'id' is faceup in the first pat
      if (faceup) {
        for (var i = 0; i < patcount; i++) {
          const patnum = (i + whichpat) % patcount;
          this.state += flexagon.pats[patnum].getString() + ",";
        }
      } else {
        for (var i = 0; i < patcount; i++) {
          const patnum = (whichpat - i + patcount) % patcount;
          this.state += flexagon.pats[patnum].makeFlipped().getString() + ",";
        }
      }
    }

    isEqualTo(other: State): boolean {
      return this.state === other.state;
    }
  }
}
