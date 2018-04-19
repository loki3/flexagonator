namespace Flexagonator {
  describe('makePat', () => {
    it('should make a pat that returns the original array', () => {
      const original = [1, [[-2, 3], 4]];
      const pat = makePat(original);
      if (isStructureError(pat)) {
        fail();
        return;
      }
      const result = pat.getAsLeafTree();
      expect(areEqual(result, original)).toBeTruthy();
    });
  });

  describe('makeFlipped', () => {
    it('should properly flip a pat', () => {
      const original = [1, [[-2, 3], 4]];
      const expected = [[-4, [-3, 2]], -1];
      const pat = makePat(original);
      if (isStructureError(pat)) {
        fail();
        return;
      }
      const result = pat.makeFlipped().getAsLeafTree();
      expect(areEqual(result, expected)).toBeTruthy();
    });
  });

  describe('getTop', () => {
    it('should return the label for the top leaf', () => {
      const original = [[-1, 2], [-3, [4, -5]]];
      const pat = makePat(original);
      if (isStructureError(pat)) {
        fail();
        return;
      }
      const result = pat.getTop();
      expect(result).toBe(-1);
    });
  });

  describe('getBottom', () => {
    it('should return the label for the bottom leaf', () => {
      const original = [[-1, 2], [-3, [4, -5]]];
      const pat = makePat(original);
      if (isStructureError(pat)) {
        fail();
        return;
      }
      const result = pat.getBottom();
      expect(result).toBe(5);
    });
  });
}
