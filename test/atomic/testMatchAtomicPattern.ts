namespace Flexagonator {

  describe('matchAtomicPattern', () => {
    it("should complain if pattern has more pats than what we're matching", () => {
      const pats = stringToAtomicPattern("a # b") as AtomicPattern;
      const pattern = stringToAtomicPattern("a 1 / # 2 \\ b") as AtomicPattern;
      const result = matchAtomicPattern(pats, pattern);
      if (!isAtomicPatternError(result)) {
        fail("it should have returned an error");
        return;
      }
      expect(result.atomicPatternError).toBe("NotEnoughPats");
    });

    it("should find matches when the number of pats is an exact match", () => {
      const pats = stringToAtomicPattern("a [1,-2] / -3 \\ # [-4,[5,-6]] / b") as AtomicPattern;
      const pattern = stringToAtomicPattern("a 1 / 2 \\ # [-3,-4] / b") as AtomicPattern;
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

    it("should ignore direction when pattern only has a single leaf", () => {
      const pats = stringToAtomicPattern("a [1,-2] / -3 \\ # [-4,[5,-6]] / b") as AtomicPattern;
      const pattern = stringToAtomicPattern("a 1 # b") as AtomicPattern;
      const result = matchAtomicPattern(pats, pattern);
      if (isAtomicPatternError(result)) {
        fail("should have matched: " + JSON.stringify(result));
        return;
      }

      const matches = result.matches;
      expect(matches[1].getString()).toBe("-3");
    });

    it("should flip the ends when simple", () => {
      const pats = stringToAtomicPattern("a # -b") as AtomicPattern;
      const pattern = stringToAtomicPattern("-b # -a") as AtomicPattern;
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

    it("should find remainder not matched by pats", () => {
      const pats = stringToAtomicPattern("a 1 / [2,-3] \\ 4 / # 5 \\ 6 / [-7,8] \\ b") as AtomicPattern;
      const pattern = stringToAtomicPattern("a 1 / # 2 \\ b") as AtomicPattern;
      const result = matchAtomicPattern(pats, pattern);
      if (isAtomicPatternError(result)) {
        fail("should have matched: " + JSON.stringify(result));
        return;
      }

      expect(result.otherLeft).toBe('a');
      if (!result.patsLeft) {
        fail('should have gotten patsLeft');
      } else {
        expect(result.patsLeft.length).toBe(2);
        // they go backwards because they flow from # outward
        expect(result.patsLeft[0].pat.getString()).toBe('[2,-3]');
        expect(result.patsLeft[0].direction).toBe('\\');
        expect(result.patsLeft[1].pat.getString()).toBe('1');
        expect(result.patsLeft[1].direction).toBe('/');
      }
      expect(result.otherRight).toBe('b');
      if (!result.patsRight) {
        fail('should have gotten patsRight');
      } else {
        expect(result.patsRight.length).toBe(2);
        expect(result.patsRight[0].pat.getString()).toBe('6');
        expect(result.patsRight[0].direction).toBe('/');
        expect(result.patsRight[1].pat.getString()).toBe('[-7,8]');
        expect(result.patsRight[1].direction).toBe('\\');
      }
    });

    it("should store remainders when no pats to match", () => {
      const pats = stringToAtomicPattern("a 1 / # 2 \\ b") as AtomicPattern;
      const pattern = stringToAtomicPattern("a # b") as AtomicPattern;
      const result = matchAtomicPattern(pats, pattern);
      if (isAtomicPatternError(result)) {
        fail("should have matched: " + JSON.stringify(result));
        return;
      }

      expect(result.otherLeft).toBe('a');
      if (!result.patsLeft) {
        fail('should have gotten patsLeft');
      } else {
        expect(result.patsLeft.length).toBe(1);
        expect(result.patsLeft[0].pat.getString()).toBe('1');
        expect(result.patsLeft[0].direction).toBe('/');
      }
      expect(result.otherRight).toBe('b');
      if (!result.patsRight) {
        fail('should have gotten patsRight');
      } else {
        expect(result.patsRight.length).toBe(1);
        expect(result.patsRight[0].pat.getString()).toBe('2');
        expect(result.patsRight[0].direction).toBe('\\');
      }
    });

    it("should find remainder not matched by pats & swap when needed", () => {
      const pats = stringToAtomicPattern("a 1 / [2,-3] \\ 4 / # 5 \\ 6 / [-7,8] \\ b") as AtomicPattern;
      const pattern = stringToAtomicPattern("-b 1 / # 2 \\ -a") as AtomicPattern;
      const result = matchAtomicPattern(pats, pattern);
      if (isAtomicPatternError(result)) {
        fail("should have matched: " + JSON.stringify(result));
        return;
      }

      expect(result.otherLeft).toBe('-b');
      if (!result.patsLeft) {
        fail('should have gotten patsLeft');
      } else {
        expect(result.patsLeft.length).toBe(2);
        expect(result.patsLeft[0].pat.getString()).toBe('-6');
        expect(result.patsLeft[0].direction).toBe('/');
        expect(result.patsLeft[1].pat.getString()).toBe('[-8,7]');
        expect(result.patsLeft[1].direction).toBe('\\');
      }
      expect(result.otherRight).toBe('-a');
      if (!result.patsRight) {
        fail('should have gotten patsRight');
      } else {
        expect(result.patsRight.length).toBe(2);
        // they go backwards because they flow from # outward
        expect(result.patsRight[0].pat.getString()).toBe('[3,-2]');
        expect(result.patsRight[0].direction).toBe('\\');
        expect(result.patsRight[1].pat.getString()).toBe('-1');
        expect(result.patsRight[1].direction).toBe('/');
      }
    });

    it("should complain if substructure doesn't match", () => {
      const pats = stringToAtomicPattern("a 1 \\ # 4 / b") as AtomicPattern;
      const pattern = stringToAtomicPattern("a 1 \\ # [-3,-4] / b") as AtomicPattern;
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
      const pats = stringToAtomicPattern("a 1 \\ # 4 / b") as AtomicPattern;
      const pattern = stringToAtomicPattern("a 1 \\ # 4 \\ b") as AtomicPattern;
      const result = matchAtomicPattern(pats, pattern);
      if (!isAtomicPatternError(result)) {
        fail("it should have returned an error");
        return;
      }
      expect(result.atomicPatternError).toBe("DirectionMismatch");
      expect(result.expectedConnected === undefined ? '' : result.expectedConnected.direction).toBe('\\');
      expect(result.actualConnected === undefined ? '' : result.actualConnected.direction).toBe('/');
    });
  });

}
