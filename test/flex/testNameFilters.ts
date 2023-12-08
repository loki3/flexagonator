namespace Flexagonator {

  describe('getNamePieces', () => {
    it('returns complete lists when passed nothing', () => {
      const all = getNamePieces({});
      // just test that there are a bunch of names, since this is subject to change
      expect(all.overallShapes.length).toBeGreaterThan(10);
      expect(all.leafShapes.length).toBeGreaterThan(4);
      expect(all.patCounts.length).toBeGreaterThan(10);
    });

    it('filters when given an overall shape', () => {
      const filtered = getNamePieces({ overallShape: 'star' });
      // must be overallShape:start
      expect(filtered.overallShapes.length).toBe(1);
      expect(filtered.overallShapes[0]).toBe('star');
      // must be leafShape:isosceles
      expect(filtered.leafShapes.length).toBe(1);
      expect(filtered.leafShapes[0]).toBe('isosceles');
      // many possible pat counts, including 10 but not 9
      expect(filtered.patCounts.length).toBeGreaterThan(5);
      expect(filtered.patCounts.indexOf(10) !== -1).toBe(true);
      expect(filtered.patCounts.indexOf(9) === -1).toBe(true);
    });
  });
}
