namespace Flexagonator {

  describe('AtomicFlex.apply', () => {
    it("should apply a simple flex", () => {
      const flex = makeAtomicFlex('X', 'a 1 > / [-3,2] < b', 'a 1 > 2 < / 3 < b') as AtomicFlex;
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
      const flex = makeAtomicFlex('^', 'a / b', '-b / -a') as AtomicFlex;
      const input = stringToAtomicPattern('a 1 > 2 < / [4,3] < 5 < b') as AtomicPattern;
      const result = flex.apply(input);
      if (isAtomicPatternError(result)) {
        fail('failed to apply flex: ' + JSON.stringify(result));
        return;
      }
      const asString = atomicPatternToString(result);
      expect(asString).toBe('-b -5 < [-3,-4] < / -2 < -1 > -a');
    });

    it("should shift current hinge", () => {
      const toRight = makeAtomicFlex('>', 'a / 1 b', 'a 1 / b') as AtomicFlex;
      const input = stringToAtomicPattern('a 1 > 2 < / 3 > 4 < b') as AtomicPattern;
      const result = toRight.apply(input);
      if (isAtomicPatternError(result)) {
        fail('failed to apply flex: ' + JSON.stringify(result));
        return;
      }
      const asString = atomicPatternToString(result);
      expect(asString).toBe('a 1 > 2 < 3 > / 4 < b');
    });
  });
}
