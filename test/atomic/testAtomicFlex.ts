namespace Flexagonator {

  describe('AtomicFlex.apply', () => {
    it("should apply a simple flex", () => {
      const flex = makeAtomicFlex({ shorthand: 'X', name: 'X', input: 'a 1 > / [-3,2] < b', output: 'a 1 > 2 < / 3 < b' }) as AtomicFlex;
      const input = stringToAtomicPattern('a 1 > 2 > / [4,3] < 5 < b') as AtomicPattern;
      const result = flex.apply(input);
      if (isAtomicPatternError(result)) {
        fail('failed to apply flex: ' + JSON.stringify(result));
        return;
      }
      const asString = atomicPatternToString(result);
      expect(asString).toBe('a 1 > 2 > 3 < / -4 < 5 < b');
    });

    it("should be able to turn over the flexagon", () => {
      const flex = makeAtomicFlex({ shorthand: '^', name: '^', input: 'a / b', output: '-b / -a' }) as AtomicFlex;
      const input = stringToAtomicPattern('a 1 > 2 < / [4,3] < 5 < b') as AtomicPattern;
      const result = flex.apply(input);
      if (isAtomicPatternError(result)) {
        fail('failed to apply flex: ' + JSON.stringify(result));
        return;
      }
      const asString = atomicPatternToString(result);
      expect(asString).toBe('-b -5 < [-3,-4] < / -2 < -1 > -a');
    });

    /*
    currently fails because it loses track of the direction of the matched pat, special case for single pat/ignore direction
    it("should shift current hinge", () => {
      const toRight = makeAtomicFlex({ shorthand: '>', name: '>', input: 'a / 1 b', output: 'a 1 / b' }) as AtomicFlex;
      const input = stringToAtomicPattern('a 1 > 2 < / 3 > 4 < b') as AtomicPattern;
      const result = toRight.apply(input);
      if (isAtomicPatternError(result)) {
        fail('failed to apply flex: ' + JSON.stringify(result));
        return;
      }
      const asString = atomicPatternToString(result);
      expect(asString).toBe('a 1 > 2 < 3 > / 4 < b');
    });
    */
  });
}
