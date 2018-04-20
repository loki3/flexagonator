namespace Flexagonator {
  describe('getCorners', () => {
    it('should compute properly', () => {
      const corners = new Polygon(3, 100, 100, 100).getCorners();
      expect(corners[0]).toBeCloseTo(186.6, 0.1);
      expect(corners[1]).toBeCloseTo(150, 0.1);
      expect(corners[2]).toBeCloseTo(13.4, 0.1);
      expect(corners[3]).toBeCloseTo(150, 0.1);
      expect(corners[4]).toBeCloseTo(100, 0.1);
      expect(corners[5]).toBeCloseTo(0, 0.1);
    });
  });
}
