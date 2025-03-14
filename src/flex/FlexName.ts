namespace Flexagonator {

  /** take a string representing a flex and break it into its details */
  export function makeFlexName(fullName: string): FlexName {
    fullName = normalizeFlexName(fullName);
    const last = fullName[fullName.length - 1];
    const shouldGenerate = (last === '+') || (last === '*');
    const shouldApply = (last !== '+');

    let isInverse: boolean;
    let baseName: string;
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

  /** make the symbols consistent, e.g., deal with various tick marks */
  export function normalizeFlexName(name: string): string {
    return name.replace(/’/g, "'");
  }

  /**
   * can interpret a string representing a flex, whether it's an inverse, etc.
   *  '  inverse
   *  +  generate necessary structure but don't apply
   *  *  generate necessary structure and apply
   */
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

    /** make the flex a generator - leave ^>< and + alone, otherwise add * */
    getGenerator(): FlexName {
      const b = this.baseName;
      return this.shouldGenerate || b === '^' || b === '>' || b === '<' ? this : makeFlexName(`${this.flexName}*`);
    }
  }


  /**
   * get a list of all the unique flex names (ingoring * and +, but including ')
   * @param flexStr string representing list of flexes
   * @param excludeRotates optionally exclude ><^~
   */
  export function getUniqueFlexes(flexStr: string, excludeRotates: boolean): string[] {
    let result: string[] = [];
    const names: FlexName[] = parseFlexSequence(flexStr);
    for (let name of names) {
      const flexName = name.flexName;
      if (excludeRotates && (flexName == '<' || flexName == '>' || flexName == '^' || flexName == '~')) {
        continue;
      }
      if (result.find(x => (x === flexName)) === undefined) {
        result.push(flexName);
      }
    }
    return result;
  }

}
