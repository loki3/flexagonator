namespace Flexagonator {

  describe('makeAtomicFlexes', () => {
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

    it("should compose to create the exchange flex", () => {
      // Ex = Ur > ^ Ur' ^
      // a 1 > / [-3,2] > b  ->  -a [2,-1] > / 3 > -b
      const input = stringToAtomicPattern("a 1 > / [-3,2] > b") as AtomicPattern;
      const result = applyFlexes(input, "Ur > ^ Ur' ^");
      if (isAtomicPatternError(result)) {
        fail('failed to apply flex: ' + JSON.stringify(result));
        return;
      }
      const asString = atomicPatternToString(result);
      expect(asString).toBe("-a [2,-1] > / 3 > -b");
    });

    it("should compose to create the pocket flex", () => {
      // K = Ur > ^ Ur' > Ul ^
      // a [-2,1] > -3 > / [5,-4] > b  ->  a 1 < 2 > / [-4,3] > -5 > -b
      const input = stringToAtomicPattern("a [-2,1] > -3 > / [5,-4] > b") as AtomicPattern;
      const result = applyFlexes(input, "Ur > ^ Ur' > Ul ^", false);
      if (isAtomicPatternError(result)) {
        fail('failed to apply flex: ' + JSON.stringify(result));
        return;
      }
      const asString = atomicPatternToString(result);
      expect(asString).toBe("a 1 < 2 > / [-4,3] > -5 > -b");
    });

  });

}
