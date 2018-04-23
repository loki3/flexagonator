namespace Flexagonator {

  export function makeFlexagonManager(flexagon: Flexagon, leafProps?: LeafProperties[]) {
    return new FlexagonManager(flexagon, leafProps);
  }

  /*
    Manages a flexagon, its valid flexes, & applying flexes
  */
  export class FlexagonManager {
    flexagon: Flexagon;
    leafProps?: LeafProperties[];
    readonly allFlexes: Flexes;
    readonly primeFlexes: Flexes;

    constructor(flexagon: Flexagon, leafProps?: LeafProperties[]) {
      this.flexagon = flexagon;
      this.leafProps = leafProps;
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
      return checkForFlexes(modified, this.primeFlexes);
    }

    // apply a series of space delimited flexes, e.g. "P > > S' ^ T"
    applyFlexes(flexStr: string): boolean | FlexError {
      const flexNames = this.parseFlexes(flexStr);
      if (isFlexError(flexNames)) {
        return flexNames;
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

    // apply a series of flexes, generating structure as necessary
    generateAndApplyFlexes(flexStr: string): boolean | FlexError {
      const flexNames = this.parseFlexes(flexStr);
      if (isFlexError(flexNames)) {
        return flexNames;
      }

      for (var flexName of flexNames) {
        const result1 = this.allFlexes[flexName].createPattern(this.flexagon);
        const result2 = this.allFlexes[flexName].apply(result1);
        if (isFlexError(result2)) {
          return { reason: FlexCode.CantApplyFlex, flexName: flexName };
        }
        this.flexagon = result2;
      }
      return true;
    }

    //  check if all the flexes actually exist
    private parseFlexes(flexStr: string): string[] | FlexError {
      const flexNames: string[] = flexStr.split(" ");
      for (var flexName of flexNames) {
        if (this.allFlexes[flexName] === undefined) {
          return { reason: FlexCode.UnknownFlex, flexName: flexName };
        }
      }
      return flexNames;
    }
  }
}
