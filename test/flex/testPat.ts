namespace Flexagonator {
  describe('makePat', () => {
    it('should make a pat that returns the original array', () => {
      const original = [1, [[-2, 3], 4]];
      const pat = makePat(original);
      const result = pat.getAsRaw();
      expect(JSON.stringify(result)).toBe(JSON.stringify(original));
    });
  });
}
