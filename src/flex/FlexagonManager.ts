namespace Flexagonator {

  export function makeFlexagonManager(flexagon: Flexagon) {
    return new FlexagonManager(flexagon);
  }

  /*
    Manages a flexagon, its valid flexes, & applying flexes
  */
  export class FlexagonManager {
    flexagon: Flexagon;
    readonly allFlexes: Flexes;
    readonly primeFlexes: Flexes;

    constructor(flexagon: Flexagon) {
      this.flexagon = flexagon;
      this.allFlexes = makeAllFlexes(flexagon.getPatCount());
      this.primeFlexes = getPrimeFlexes(this.allFlexes);
    }

    // possibly flip the flexagon and rotate 'rightSteps',
    // then check which prime flexes can be performed at the current vertex
    checkForPrimeFlexes(flip: boolean, rightSteps: number): string[] {
      var modified = this.flexagon;
      if (flip) {
        modified = this.allFlexes["^"].apply(modified) as Flexagon;
      }
      for (var i = 0; i < rightSteps; i++) {
        modified = this.allFlexes[">"].apply(modified) as Flexagon;
      }
      return checkForFlexes(this.flexagon, this.primeFlexes);
    }

    // apply a series of space delimited flexes, e.g. "P > > S' ^ T"
    applyFlexes(flexStr: string): boolean | FlexError {
      const flexNames: string[] = flexStr.split(" ");

      // first check if all the flexes actually exist
      for (var flexName of flexNames) {
        if (this.allFlexes[flexName] === undefined) {
          return { reason: FlexCode.UnknownFlex, flexName: flexName };
        }
      }

      // if they all exist, apply them
      for (var flexName of flexNames) {
        const result = this.allFlexes[flexName].apply(this.flexagon);
        if (isFlexError(result)) {
          return { reason: FlexCode.CantApplyFlex, flexName: flexName };
        }
        this.flexagon = result;
      }
      return true;
    }
  }
}
