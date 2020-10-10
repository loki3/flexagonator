namespace Flexagonator {

  describe('getAtomicPatternDirections', () => {
    it("should handle empty left & right", () => {
      const pattern: AtomicPattern = {
        otherLeft: 'a',
        left: null,
        right: null,
        otherRight: '-b',
        singleLeaf: false,
      }
      const dirs = getAtomicPatternDirections(pattern);
      expect(dirs.length).toBe(0);
    });

    it("should handle left side going backwards", () => {
      const pattern: AtomicPattern = {
        otherLeft: '-a',
        left: [
          { pat: makePat(0) as Pat, direction: '/' },
          { pat: makePat(0) as Pat, direction: '\\' },
        ],
        right: [
          { pat: makePat(0) as Pat, direction: '/' },
          { pat: makePat(0) as Pat, direction: '\\' },
        ],
        otherRight: 'b',
        singleLeaf: false,
      }
      const dirs = getAtomicPatternDirections(pattern);
      expect(dirs.length).toBe(4);
      expect(dirs[0]).toBe('\\');
      expect(dirs[1]).toBe('/');
      expect(dirs[2]).toBe('/');
      expect(dirs[3]).toBe('\\');
    });
  });

}
