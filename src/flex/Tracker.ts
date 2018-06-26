namespace Flexagonator {

  // tracks flexagons we've seen before
  export class Tracker {
    private states: State[] = [];
    private readonly keyId: number = 1;
    private current: number = 0;  // 0-based index into states

    private constructor(states: State[], current: number) {
      this.states = states;
      this.current = current;
    }

    static make(flexagon: Flexagon): Tracker {
      const tracker = new Tracker([], 0);
      tracker.findMaybeAdd(flexagon);
      return tracker;
    }

    getTotalStates(): number {
      return this.states.length;
    }

    getCurrentState(): number {
      return this.current;
    }

    getCopy(): Tracker {
      // create a shallow copy of this object's state
      // (since its members are immutable)
      const states = this.states.map(x => x);
      return new Tracker(states, this.current);
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
      for (let i = 0; i < this.states.length; i++) {
        const thisState = this.states[i];
        if (thisState.isEqualTo(state)) {
          return i;
        }
      }
      return null;
    }
  }


  // similar to Tracker, but just tracks the visible leaves,
  // which might have duplicates across all the flexagon states
  export class TrackerVisible {
    private readonly states: State[] = [];
    private readonly keyId: number = 1;

    constructor(flexagons: Flexagon[]) {
      for (let flexagon of flexagons) {
        const pseudo = TrackerVisible.toPseudoFlexagon(flexagon.getTopIds(), flexagon.getBottomIds());
        const state = new State(pseudo, this.keyId);
        this.states.push(state);
      }
    }

    // returns the indices of flexagons with the same visible leaves, if any
    find(top: number[], bottom: number[]): number[] {
      const results: number[] = [];
      const pseudo = TrackerVisible.toPseudoFlexagon(top, bottom);
      const toFind = new State(pseudo, this.keyId);
      let i = 0;
      for (let state of this.states) {
        if (state.isEqualTo(toFind)) {
          results.push(i);
        }
        i++;
      }
      return results;
    }

    // pretend the visible leaves describe a flexagon
    private static toPseudoFlexagon(top: number[], bottom: number[]): Flexagon {
      const visible = [];
      for (let i = 0; i < top.length; i++) {
        visible.push([top[i], bottom[i]]);
      }
      return Flexagon.makeFromTree(visible) as Flexagon;
    }
  }


  interface WhereFound {
    whichpat: number;
    faceup: boolean;
  }

  // represents a flexagon state in such a way that's quick to compare
  // against others, while ignoring how it's rotated or flipped
  class State {
    private readonly state: string = "";

    constructor(flexagon: Flexagon, key: number) {
      const patcount = flexagon.getPatCount();

      // find which pat 'key' is in and whether it's face up or down
      const where = this.findKey(flexagon, key);

      // build up a string that represents the normalized form,
      // where 'id' is faceup in the first pat
      if (where.faceup) {
        for (let i = 0; i < patcount; i++) {
          const patnum = (i + where.whichpat) % patcount;
          this.state += flexagon.pats[patnum].getString() + ",";
        }
      } else {
        for (let i = 0; i < patcount; i++) {
          const patnum = (where.whichpat - i + patcount) % patcount;
          this.state += flexagon.pats[patnum].makeFlipped().getString() + ",";
        }
      }
    }

    isEqualTo(other: State): boolean {
      return this.state === other.state;
    }

    private findKey(flexagon: Flexagon, key: number): WhereFound {
      const patcount = flexagon.getPatCount();
      let whichpat: number = -1;
      let faceup = true;
      for (let i = 0; i < patcount; i++) {
        const whereKey = flexagon.pats[i].findId(key);
        if (whereKey != WhereLeaf.NotFound) {
          whichpat = i;
          faceup = (whereKey == WhereLeaf.Found);
          break;
        }
      }
      if (whichpat != -1) {
        return { whichpat: whichpat, faceup: faceup };
      }

      // key wasn't found, so find the min value instead
      let minId = Number.MAX_SAFE_INTEGER;
      for (let i = 0; i < patcount; i++) {
        const thisMin = flexagon.pats[i].findMinId();
        if (thisMin < minId) {
          minId = thisMin;
        }
      }
      return this.findKey(flexagon, minId);
    }
  }
}
