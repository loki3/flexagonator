namespace Flexagonator {

  export function parseFlexSequence(sequence: string): FlexName[] {
    const names: FlexName[] = [];
    let start = -1;
    let i = 0;

    for (let c of sequence) {
      if (c == ' ' || c === '>' || c === '<' || c === '^' || ('A' <= c && c <= 'Z')) {
        // we're starting a new flex, so end the previous one
        addFlex(names, sequence, start, i);
        start = i;
      }

      i++;
    }

    addFlex(names, sequence, start, i);
    return names;
  }

  function addFlex(names: FlexName[], sequence: string, start: number, end: number) {
    if (start != -1) {
      const substr = sequence.substring(start, end).trim();
      if (substr.length > 0) {
        names.push(makeFlexName(substr));
      }
    }
  }

}
