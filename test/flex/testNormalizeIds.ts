namespace Flexagonator {
  describe('normalizeIds', () => {
    it('should renumber leaves in unfolded order', () => {
      // unfolds to [3, -1, 2, -5, 4, -7], which gets renumbered to 1-6 & folded back up
      const original = [[[1, 2], 3], [-4, -5], 7];
      const expected = [[[-2, 3], 1], [-5, 4], -6];
      const pats = original.map(p => makePat(p) as Pat);
      const result = normalizeIds(pats);

      const final = result.map(p => p.getAsLeafTree());
      expect(final).toEqual(expected);
    });
  });
}
