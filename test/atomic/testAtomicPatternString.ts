namespace Flexagonator {

  describe('stringToAtomicPattern', () => {
    it('should stringify an AtomicPattern with no pats', () => {
      const pattern: AtomicPattern = {
        otherLeft: 'a',
        left: null,
        right: null,
        otherRight: '-b',
        singleLeaf: true
      };
      const s = atomicPatternToString(pattern);
      expect(s).toBe('a # -b');
    });

    it('should stringify an AtomicPattern with simple pats', () => {
      const pattern: AtomicPattern = {
        otherLeft: '-a',
        left: [{ pat: makePat([1, -2]) as Pat, direction: '\\' }],
        right: [{ pat: makePat(-3) as Pat, direction: '/' }],
        otherRight: 'b',
        singleLeaf: false
      };
      const s = atomicPatternToString(pattern);
      expect(s).toBe('-a [1,-2] \\ # -3 / b');
    });

    it('should stringify an AtomicPattern with multiple pats', () => {
      const pattern: AtomicPattern = {
        otherLeft: 'a',
        left: [{ pat: makePat([1, -2]) as Pat, direction: '\\' }, { pat: makePat(-3) as Pat, direction: '/' }],
        right: [{ pat: makePat(4) as Pat, direction: '/' }, { pat: makePat([5, [6, -7]]) as Pat, direction: '/' }],
        otherRight: '-b',
        singleLeaf: false
      };
      const s = atomicPatternToString(pattern);
      expect(s).toBe('a -3 / [1,-2] \\ # 4 / [5,[6,-7]] / -b');
    });
  });

  describe('stringToAtomicPattern', () => {
    it('should complain about missing stuff', () => {
      const error1 = stringToAtomicPattern("a -b");
      if (!isAtomicParseError(error1)) {
        fail("expected error");
        return;
      }
      expect(error1.atomicParseCode).toBe("NeedOneHinge");

      const error2 = stringToAtomicPattern("a # c");
      if (!isAtomicParseError(error2)) {
        fail("expected error");
        return;
      }
      expect(error2.atomicParseCode).toBe("MissingOtherRight");
      expect(error2.context).toBe("c");
    });

    it('should parse just remainders', () => {
      const pattern = stringToAtomicPattern("a # -b");
      if (isAtomicParseError(pattern)) {
        fail(JSON.stringify(pattern));
        return;
      }

      expect(pattern.otherLeft).toBe('a');
      expect(pattern.left).toBe(null);
      expect(pattern.right).toBe(null);
      expect(pattern.otherRight).toBe('-b');
    });

    it('should parse just remainders and a single pat', () => {
      const pattern = stringToAtomicPattern("-a 1 # b");
      if (isAtomicParseError(pattern)) {
        fail(JSON.stringify(pattern));
        return;
      }

      expect(pattern.otherLeft).toBe('-a');
      if (pattern.left === null) {
        fail("didn't get left pat");
        return;
      }
      expect(pattern.left[0].pat.getString()).toBe("1");
      expect(pattern.right).toBe(null);
      expect(pattern.otherRight).toBe('b');
    });

    it('should complain about bad pats input', () => {
      const error1 = stringToAtomicPattern("a # [1, -2] \\ 3 b");
      if (!isAtomicParseError(error1)) {
        fail("should have complained");
        return;
      }
      expect(error1.atomicParseCode).toBe("NeedMatchedPatsAndDirections");

      const error2 = stringToAtomicPattern("a # [1, -2 \\ 3 / b");
      if (!isAtomicParseError(error2)) {
        fail("should have complained");
        return;
      }
      expect(error2.atomicParseCode).toBe("CantParsePatStructure");
      expect(error2.context).toBe("[1, -2");
    });

    it('should parse pats + direction', () => {
      const pattern = stringToAtomicPattern("a # [1, -2] \\ 3 / b");
      if (isAtomicParseError(pattern)) {
        fail(JSON.stringify(pattern));
        return;
      }

      expect(pattern.otherLeft).toBe('a');
      expect(pattern.otherRight).toBe('b');
      if (pattern.right === null) {
        fail("didn't get right pat");
        return;
      }
      expect(pattern.right[0].pat.getLeafCount()).toBe(2);
      expect(pattern.right[0].direction).toBe('\\');
      expect(pattern.right[1].pat.getLeafCount()).toBe(1);
      expect(pattern.right[1].direction).toBe('/');
    });

    it('should reverse the order of the left pats', () => {
      const pattern = stringToAtomicPattern("a [1, -2] \\ 3 / # 4 \\ b");
      if (isAtomicParseError(pattern)) {
        fail(JSON.stringify(pattern));
        return;
      }

      expect(pattern.otherLeft).toBe('a');
      expect(pattern.otherRight).toBe('b');
      if (pattern.left === null) {
        fail("didn't get left pat");
        return;
      }
      expect(pattern.left[0].pat.getLeafCount()).toBe(1);
      expect(pattern.left[0].direction).toBe('/');
      expect(pattern.left[1].pat.getLeafCount()).toBe(2);
      expect(pattern.left[1].direction).toBe('\\');
    });
  });
}
