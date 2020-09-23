namespace Flexagonator {

  describe('makeAtomicFlexes', () => {
    it("should compose to create the exchange flex", () => {
      testFormula("Ex", "Ur > ^ Ur' ^",
        "a 1 > / [-3,2] > b",
        "-a [2,-1] > / 3 > -b");
    });

    it("should compose to create the pocket flex", () => {
      testFormula("K", "Ur > ^ Ur' > Ul ^",
        "a [-2,1] > -3 > / [5,-4] > b",
        "a 1 < 2 > / [-4,3] > -5 > -b");
    });

    // for flex 'name', test that 'flexes' applied to 'input' generates 'output'
    function testFormula(name: string, flexes: string, input: string, output: string, log?: boolean): void {
      const inputPattern = stringToAtomicPattern(input);
      if (isAtomicParseError(inputPattern)) {
        fail('bad input for flex ' + name + ' with error ' + JSON.stringify(inputPattern));
        return;
      }
      const result = applyFlexes(inputPattern, flexes, log);
      if (isAtomicPatternError(result)) {
        fail('failed to apply flex ' + name + ' with error ' + JSON.stringify(result));
        return;
      }
      const asString = atomicPatternToString(result);
      expect(asString).toBe(output, "flex: " + name);
    }

    // apply a series of flexes to given input
    const atomics = makeAtomicFlexes();
    function applyFlexes(input: AtomicPattern, flexes: string, log?: boolean): AtomicPattern | AtomicPatternError {
      if (log) {
        console.log('\n---- applying flexes:', flexes, '------');
        console.log('\t\t', atomicPatternToString(input));
      }
      const list = flexes.split(' ');
      for (let flex of list) {
        const result = atomics[flex].apply(input);
        if (isAtomicPatternError(result)) {
          return result;
        }
        input = result;
        if (log) {
          console.log('\t', flex, '\t', atomicPatternToString(input));
        }
      }
      return input;
    }

  });

}
