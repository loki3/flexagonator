namespace Flexagonator {

  export function makeFlexagonManager(flexagon: Flexagon) {
    return new FlexagonManager(flexagon);
  }

  /*
    Manages a flexagon, its valid flexes, & applying flexes
  */
  export class FlexagonManager {
    flexagon: Flexagon;
    readonly flexes: Flexes;

    constructor(flexagon: Flexagon) {
      this.flexagon = flexagon;
      this.flexes = makeAllFlexes(flexagon.getPatCount());
    }

    // apply a series of space delimited flexes, e.g. "P > > S' ^ T"
    applyFlexes(flexStr: string): boolean | FlexError {
      const flexNames: string[] = flexStr.split(" ");

      // first check if all the flexes actually exist
      for (var flexName of flexNames) {
        if (this.flexes[flexName] === undefined) {
          return { reason: FlexCode.UnknownFlex, flexName: flexName };
        }
      }

      // if they all exist, apply them
      for (var flexName of flexNames) {
        const result = this.flexes[flexName].apply(this.flexagon);
        if (isFlexError(result)) {
          return { reason: FlexCode.CantApplyFlex, flexName: flexName };
        }
        this.flexagon = result;
      }
      return true;
    }
  }
}
