namespace Flexagonator {

  /**
   * direction to next leaf or pat - if previous triangle is to the left,
   * \ means the next one is to the upper right, / is to the lower right;
   * or you can use | instead of \ to avoid escaping
   */
  export type Direction = '/' | '\\' | '|';

  /** understands the directions between adjacent pats or leaves */
  export class Directions {
    /**
     * how each pat is connected to the previous pat;
     * either as a string - \: up, /: down, assuming previous to left
     * or array - false: left or up, true: right or down
     */
    public static make(input: boolean[] | string): Directions {
      if (typeof input !== 'string') {
        return new Directions(input);
      }
      const directions: boolean[] = [];
      for (let i = 0; i < input.length; i++) {
        directions.push(input[i] === '/');
      }
      return new Directions(directions);
    }

    private constructor(private directions: boolean[]) {
    }

    /** does the pat after the ith pat go to the lower right if previous was to the left? */
    public isDown(i: number): boolean { return this.directions[i]; }

    public getCount(): number { return this.directions.length; }

    /** if 'jsonFriendly', use | instead of \ so escaping doesn't obfuscate the patterns */
    public asString(jsonFriendly: boolean): string {
      return jsonFriendly
        ? this.directions.map(d => d ? '/' : '|').join('')
        : this.directions.map(d => d ? '/' : '\\').join('');
    }

    public asRaw(): boolean[] { return this.directions; }
  }


  /** optional direction between pats, Direction + ? (don't care about direction) */
  export type DirectionOpt = '/' | '\\' | '|' | '?';

  /** used to specify optional directions between adjacent pats or leaves */
  export class DirectionsOpt {
    /**
     * how each pat is connected to the previous pat;
     * either as a string - \: up, /: down, ?:don't care, assuming previous to left
     * or array - false: left or up, true: right or down, null: don't care
     */
    public static make(input: (boolean | null)[] | string): DirectionsOpt {
      if (typeof input !== 'string') {
        return new DirectionsOpt(input);
      }
      const directions: (boolean | null)[] = [];
      for (let i = 0; i < input.length; i++) {
        directions.push(input[i] === '?' ? null : input[i] === '/');
      }
      return new DirectionsOpt(directions);
    }

    private constructor(private directions: (boolean | null)[]) {
    }

    public getCount(): number { return this.directions.length; }

    /** if 'jsonFriendly', use | instead of \ so escaping doesn't obfuscate the patterns */
    public asString(jsonFriendly: boolean): string {
      return jsonFriendly
        ? this.directions.map(d => d === null ? '?' : d ? '/' : '|').join('')
        : this.directions.map(d => d === null ? '?' : d ? '/' : '\\').join('');
    }

    public asRaw(): (boolean | null)[] { return this.directions; }
  }

}
