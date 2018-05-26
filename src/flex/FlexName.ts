namespace Flexagonator {

  export function makeFlexName(fullName: string): FlexName {
    const last = fullName[fullName.length - 1];
    const shouldGenerate = (last === '+') || (last === '*');
    const shouldApply = (last !== '+');

    var isInverse: boolean;
    var baseName: string;
    if (shouldGenerate) {
      const next = fullName[fullName.length - 2];
      isInverse = (next === "'");
      if (isInverse) {
        baseName = fullName.substring(0, fullName.length - 2);
      } else {
        baseName = fullName.substring(0, fullName.length - 1);
      }
    } else {
      isInverse = (last === "'");
      if (isInverse) {
        baseName = fullName.substring(0, fullName.length - 1);
      } else {
        baseName = fullName;
      }
    }

    return new FlexName(baseName, isInverse, shouldGenerate, shouldApply);
  }

  // can interpret a string representing a flex, whether it's an inverse, etc.
  // '  inverse
  // +  generate necessary structure but don't apply
  // *  generate necessary structure and apply
  export class FlexName {
    readonly fullName: string;      // e.g. S'*
    readonly baseName: string;      // e.g. S
    readonly flexName: string;      // e.g. S'
    readonly isInverse: boolean;
    readonly shouldGenerate: boolean;
    readonly shouldApply: boolean;

    constructor(baseName: string, isInverse: boolean, shouldGenerate: boolean, shouldApply: boolean) {
      this.baseName = baseName;
      this.isInverse = isInverse;
      this.shouldGenerate = shouldGenerate;
      this.shouldApply = shouldApply;

      this.flexName = this.baseName;
      if (this.isInverse) {
        this.flexName += "'";
      }

      this.fullName = this.flexName;
      if (this.shouldGenerate) {
        if (this.shouldApply) {
          this.fullName += "*";
        } else {
          this.fullName += "+";
        }
      }
    }

    getInverse(): FlexName {
      return new FlexName(this.baseName, !this.isInverse, this.shouldGenerate, this.shouldApply);
    }
  }


  // get a list of all the unique flex names (ingoring * and +, but including ')
  // and optionally excluding ><^
  export function getUniqueFlexes(flexStr: string, excludeRotates: boolean): string[] {
    var result: string[] = [];
    const names: string[] = flexStr.split(" ");
    for (var name of names) {
      const flexName = makeFlexName(name).flexName;
      if (excludeRotates && (flexName == '<' || flexName == '>' || flexName == '^')) {
        continue;
      }
      if (result.find(x => (x === flexName)) === undefined) {
        result.push(flexName);
      }
    }
    return result;
  }

}
