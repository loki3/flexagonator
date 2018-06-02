namespace Flexagonator {

  // tracks flexagons we've seen before
  export class Tracker {
    private states: State[] = [];
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
      const state = new State(flexagon);
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
    readonly top: number[];
    readonly bottom: number[];

    constructor(flexagon: Flexagon) {
      const top = flexagon.getTopIds();
      const bottom = flexagon.getBottomIds();
      const where = State.findLowest(top, bottom);
      if (where.onTop) {
        this.top = this.rotate(where.index, top);
        this.bottom = this.rotate(where.index, bottom);
      } else {
        const index = top.length - where.index - 1;
        this.top = this.rotate(index, bottom.reverse());
        this.bottom = this.rotate(index, top.reverse());
      }
    }

    isEqualTo(other: State): boolean {
      for (var i in this.top) {
        if (this.top[i] !== other.top[i]) {
          return false;
        }
        if (this.bottom[i] !== other.bottom[i]) {
          return false;
        }
      }
      return true;
    }

    // search for the lowest number among top & bottom,
    // (where <0 simply represents the backside, so we flip the sign)
    // return { index: <pat #>, onTop: <true|false> }
    private static findLowest(top: number[], bottom: number[]) {
      var lowest: number | null = null;
      var index = 0;
      var onTop = true;
      for (var i = 0; i < top.length; i++) {
        const theTop = Math.abs(top[i]);
        if (lowest === null || theTop < lowest) {
          lowest = theTop;
          index = i;
          onTop = true;
        }
        const theBottom = Math.abs(bottom[i]);
        if (lowest === null || theBottom < lowest || (theBottom == lowest && bottom[i] > 0)) {
          lowest = theBottom;
          index = i;
          onTop = false;
        }
      }
      return { index: index, onTop: onTop };
    }

    // e.g. (2, [a,b,c,d]) -> [c,d,a,b]
    private rotate(index: number, nums: number[]): number[] {
      if (index === 0) {
        return nums;
      }
      var rotated: number[] = [];
      for (var i = 0; i < nums.length; i++) {
        rotated[i] = nums[(i + index) % nums.length];
      }
      return rotated;
    }
  }

}
