namespace Flexagonator {

  // tracks flexagons we've seen before
  export class Tracker {
    private outsides: Outside[] = [];

    getTotalStates(): number {
      return this.outsides.length;
    }

    // if we've seen this flexagon before, return which one,
    // else add it to our list and return null
    findMaybeAdd(flexagon: Flexagon): number | null {
      const outside = new Outside(flexagon.getTopIds(), flexagon.getBottomIds());
      const i = this.getIndex(outside);
      if (i !== null) {
        return i;
      }
      this.outsides.push(outside);
      return null;
    }

    // returns which state we have, or null if we haven't seen it before
    private getIndex(outside: Outside): number | null {
      for (var i in this.outsides) {
        const thisOutside = this.outsides[i];
        if (thisOutside.isEqualTo(outside)) {
          return Number.parseInt(i);
        }
      }
      return null;
    }
  }

  // represents the leaves visible on the outside of a flexagon
  class Outside {
    readonly top: number[];
    readonly bottom: number[];

    constructor(top: number[], bottom: number[]) {
      this.top = top;
      this.bottom = bottom;
    }

    isEqualTo(other: Outside): boolean {
      for (var i in this.top) {
        if (this.top[i] != other.top[i]) {
          return false;
        }
        if (this.bottom[i] != other.bottom[i]) {
          return false;
        }
      }
      return true;
    }
  }

}
