namespace Flexagonator {

  /**
   * Create a new flex definition from a flex sequence.
   * Note: doesn't currently handle a + in the sequence.
   */
  export function makeFlexFromSequence(sequence: string, flexes: Flexes): Flex | FlexError {
    const flexNames = parseFlexSequence(sequence);

    const flexagon = makeEmptyFlexagon(flexes);
    const fm = new FlexagonManager(flexagon, undefined, flexes);

    const generator = makeGeneratingSequence(flexNames);
    const result = fm.applyFlexes(generator, false);
    if (isFlexError(result)) {
      return result;
    }
    const output = fm.flexagon.getAsLeafTrees();

    const undo = flexNames.map(flexName => flexName.getInverse()).reverse();
    const result2 = fm.applyFlexes(undo, false);
    if (isFlexError(result2)) {
      return result2;
    }
    const input = fm.flexagon.getAsLeafTrees();

    return makeFlex("new flex", input, output, FlexRotation.None);
  }

  function makeEmptyFlexagon(flexes: Flexes): Flexagon {
    const allNames = Object.getOwnPropertyNames(flexes);
    const someFlex = flexes[allNames[0]];
    const numPats = someFlex.input.length;
    const pats = [];
    for (var i = 1; i <= numPats; i++) {
      pats.push(i);
    }
    return Flexagon.makeFromTree(pats) as Flexagon;
  }

  function makeGeneratingSequence(flexNames: FlexName[]): FlexName[] {
    return flexNames.map(flexName => {
      if (flexName.baseName === '>' || flexName.baseName === '<'
        || flexName.baseName === '^' || flexName.shouldGenerate) {
        return flexName;
      }
      return makeFlexName(flexName.flexName + '*');
    });
  }

}
