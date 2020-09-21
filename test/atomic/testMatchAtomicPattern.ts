namespace Flexagonator {

  describe('matchAtomicPattern', () => {
    it("should complain if pattern has more pats than what we're matching", () => {
      const pats = stringToAtomicPattern("a / b") as AtomicPattern;
      const pattern = stringToAtomicPattern("a 1 > / 2 < b") as AtomicPattern;
      const result = matchAtomicPattern(pats, pattern);
      if (!isAtomicPatternError(result)) {
        fail("it should have returned an error");
        return;
      }
      expect(result.atomicPatternError).toBe("NotEnoughPats");
    });

    it("should find matches when the number of pats is an exact match", () => {
      const pats = stringToAtomicPattern("a [1,-2] > -3 < / [-4,[5,-6]] > b") as AtomicPattern;
      const pattern = stringToAtomicPattern("a 1 > 2 < / [-3,-4] > b") as AtomicPattern;
      const result = matchAtomicPattern(pats, pattern);
      if (isAtomicPatternError(result)) {
        fail("should have matched: " + JSON.stringify(result));
        return;
      }

      const matches = result.matches;
      expect(matches[1].getString()).toBe("[1,-2]");
      expect(matches[2].getString()).toBe("-3");
      expect(matches[3].getString()).toBe("4");
      expect(matches[4].getString()).toBe("[6,-5]");
      expect(result.otherLeft).toBe('a');
      expect(result.patsLeft).toBeUndefined();
      expect(result.otherRight).toBe('b');
      expect(result.patsRight).toBeUndefined();
    });

    it("should flip the ends", () => {
      const pats = stringToAtomicPattern("a / -b") as AtomicPattern;
      const pattern = stringToAtomicPattern("-b / -a") as AtomicPattern;
      const result = matchAtomicPattern(pats, pattern);
      if (isAtomicPatternError(result)) {
        fail("should have matched: " + JSON.stringify(result));
        return;
      }

      expect(result.otherLeft).toBe('b');
      expect(result.patsLeft).toBeUndefined();
      expect(result.otherRight).toBe('-a');
      expect(result.patsRight).toBeUndefined();
    });

    it("should complain if substructure doesn't match", () => {
      const pats = stringToAtomicPattern("a 1 < / 4 > b") as AtomicPattern;
      const pattern = stringToAtomicPattern("a 1 < / [-3,-4] > b") as AtomicPattern;
      const result = matchAtomicPattern(pats, pattern);
      if (!isAtomicPatternError(result)) {
        fail("it should have returned an error");
        return;
      }
      expect(result.atomicPatternError).toBe("PatMismatch");
      expect(JSON.stringify(result.expectedPats)).toBe("[-3,-4]");
      expect(JSON.stringify(result.actualPats)).toBe("4");
    });

    it("should complain if directions don't match", () => {
      const pats = stringToAtomicPattern("a 1 < / 4 > b") as AtomicPattern;
      const pattern = stringToAtomicPattern("a 1 < / 4 < b") as AtomicPattern;
      const result = matchAtomicPattern(pats, pattern);
      if (!isAtomicPatternError(result)) {
        fail("it should have returned an error");
        return;
      }
      expect(result.atomicPatternError).toBe("DirectionMismatch");
      expect(result.expectedConnected === undefined ? '' : result.expectedConnected.direction).toBe('<');
      expect(result.actualConnected === undefined ? '' : result.actualConnected.direction).toBe('>');
    });
  });

}
