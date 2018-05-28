namespace Flexagonator {

  // tracks flexagons we've seen before
  export class Tracker {
    private outsides: Outside[] = [];
    private current: number = 0;  // 0-based index into outsides

    constructor(flexagon: Flexagon) {
      this.findMaybeAdd(flexagon);
    }

    getTotalStates(): number {
      return this.outsides.length;
    }

    getCurrentState(): number {
      return this.current;
    }

    getCopy(): Tracker {
      // a temporary flexagon that gets replaced by a shallow copy
      // of this object's state (since its members are immutable)
      const temp = makeFlexagon([1, 2]) as Flexagon;
      const other = new Tracker(temp);
      other.outsides = this.outsides.map(x => x);
      other.current = this.current;
      return other;
    }

    // if we've seen this flexagon before, return which one,
    // else add it to our list and return null
    findMaybeAdd(flexagon: Flexagon): number | null {
      const outside = new Outside(flexagon.getTopIds(), flexagon.getBottomIds());
      const i = this.getIndex(outside);
      if (i !== null) {
        this.current = i;
        return i;
      }
      this.outsides.push(outside);
      this.current = this.outsides.length - 1;
      return null;
    }

    // returns which state we have, or null if we haven't seen it before
    private getIndex(outside: Outside): number | null {
      for (var i = 0; i < this.outsides.length; i++) {
        const thisOutside = this.outsides[i];
        if (thisOutside.isEqualTo(outside)) {
          return i;
        }
      }
      return null;
    }
  }


  // represents the leaves visible on the outside of a flexagon
  // normalized, so the 1st top leaf is the lowest value
  class Outside {
    readonly top: number[];
    readonly bottom: number[];

    constructor(top: number[], bottom: number[]) {
      const where = Outside.findLowest(top, bottom);
      if (where.onTop) {
        this.top = this.rotate(where.index, top);
        this.bottom = this.rotate(where.index, bottom);
      } else {
        const index = top.length - where.index - 1;
        this.top = this.rotate(index, bottom.reverse());
        this.bottom = this.rotate(index, top.reverse());
      }
    }

    isEqualTo(other: Outside): boolean {
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
        if (lowest === null || theBottom < lowest) {
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
