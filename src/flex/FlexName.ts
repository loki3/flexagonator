namespace Flexagonator {

  export function makeFlexName(fullName: string): FlexName {
    const last = fullName[fullName.length - 1];
    const shouldGenerate = (last === '+') || (last === '*');
    const shouldApply = (last !== '+');

    var isInverse: boolean;
    var justName: string;
    if (shouldGenerate) {
      const next = fullName[fullName.length - 2];
      isInverse = (next === "'");
      if (isInverse) {
        justName = fullName.substring(0, fullName.length - 2);
      } else {
        justName = fullName.substring(0, fullName.length - 1);
      }
    } else {
      isInverse = (last === "'");
      if (isInverse) {
        justName = fullName.substring(0, fullName.length - 1);
      } else {
        justName = fullName;
      }
    }

    return new FlexName(justName, isInverse, shouldGenerate, shouldApply);
  }

  // can interpret a string representing a flex, whether it's an inverse, etc.
  // '  inverse
  // +  generate necessary structure but don't apply
  // *  generate necessary structure and apply
  export class FlexName {
    readonly fullName: string;        // e.g. S'*
    readonly justName: string;        // e.g. S
    readonly lookupName: string;      // e.g. S'
    readonly isInverse: boolean;
    readonly shouldGenerate: boolean;
    readonly shouldApply: boolean;

    constructor(justName: string, isInverse: boolean, shouldGenerate: boolean, shouldApply: boolean) {
      this.justName = justName;
      this.isInverse = isInverse;
      this.shouldGenerate = shouldGenerate;
      this.shouldApply = shouldApply;

      this.lookupName = this.justName;
      if (this.isInverse) {
        this.lookupName += "'";
      }

      this.fullName = this.lookupName;
      if (this.shouldGenerate) {
        if (this.shouldApply) {
          this.fullName += "*";
        } else {
          this.fullName += "+";
        }
      }
    }

    getInverse(): FlexName {
      return new FlexName(this.justName, !this.isInverse, this.shouldGenerate, this.shouldApply);
    }
  }


  // get a list of all the unique flex names (ingoring * and +, but including ')
  // and optionally excluding ><^
  export function getUniqueFlexes(flexStr: string, excludeRotates: boolean): string[] {
    var result: string[] = [];
    const names: string[] = flexStr.split(" ");
    for (var name of names) {
      const lookup = makeFlexName(name).lookupName;
      if (excludeRotates && (lookup == '>' || lookup == '>' || lookup == '^')) {
        continue;
      }
      if (result.find(x => (x === lookup)) === undefined) {
        result.push(lookup);
      }
    }
    return result;
  }

}
