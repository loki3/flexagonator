namespace Flexagonator {

  // describes a flex relative to the current vertex,
  // possibly rotating & turning over, and what state it leads to
  export class RelativeFlex {
    // 'where' represents > and ^ used before the given flex
    // >0 for the number of >'s; <0 is a ^ followed by (where-1) >'s
    private readonly where: number;
    private readonly flex: string;
    private readonly toState: number;

    constructor(rights: number, over: boolean, flex: string, toState: number) {
      this.where = over ? -rights - 1 : rights;
      this.flex = flex;
      this.toState = toState;
    }

    toString(): string {
      var str = this.toState + '(';
      if (this.where < 0) {
        str += '^';
      }
      const rights = this.where > 0 ? this.where : -1 - this.where;
      for (var i = 0; i < rights; i++) {
        str += '>';
      }
      str += this.flex + ')';
      return str;
    }
  }

  // all the flexes found from a single state
  export type RelativeFlexes = Array<RelativeFlex>;

  export function relativeFlexesToString(flexes: RelativeFlexes): string {
    var str = "";
    var first = true;
    for (var relFlex of flexes) {
      if (first) {
        str = relFlex.toString();
        first = false;
      } else {
        str += ", " + relFlex.toString();
      }
    }
    return str;
  }

}
