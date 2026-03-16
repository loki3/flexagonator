namespace Flexagonator {
  /** consolidate & simplify ><^~ */
  export function normalizeSequence(flexes: string, numPats: number): string {
    const flexNames = parseFlexSequence(flexes);

    let names: FlexName[] = [];
    for (const name of flexNames) {
      names = addAndConsolidate(names, [name], numPats);
    }

    const result = sequenceToString(names);
    return result;
  }

  /** standardize spacing in a flex sequence */
  export function sequenceToString(flexes: FlexName[]): string {
    const list = flexes.map(flex => flex.fullName);
    let str = '';
    for (const f of list) {
      str += f;
      // add a space after non-rotates
      if (f !== '>' && f !== '<' && f !== '^' && f !== '~') {
        str += ' ';
      }
    }
    return str.trim();
  }
}
