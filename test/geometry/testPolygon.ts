namespace Flexagonator {
  describe('getCorners.basic', () => {
    it('should compute properly', () => {
      const corners = new Polygon(3, 100, 100, 100, [60, 60, 60]).getCorners();
      expect(corners[0]).toBeCloseTo(100, 0.1);
      expect(corners[1]).toBeCloseTo(0, 0.1);
      expect(corners[2]).toBeCloseTo(186.6, 0.1);
      expect(corners[3]).toBeCloseTo(150, 0.1);
      expect(corners[4]).toBeCloseTo(13.4, 0.1);
      expect(corners[5]).toBeCloseTo(150, 0.1);
    });
  });

  describe('getCorners.angles', () => {
    it('should use angles properly', () => {
      const corners = new Polygon(4, 100, 100, 100, [50, 30, 100]).getCorners();
      expect(corners[0]).toBeCloseTo(126.8, 0.1);
      expect(corners[1]).toBeCloseTo(73.2, 0.1);
      expect(corners[2]).toBeCloseTo(170.7, 0.1);
      expect(corners[3]).toBeCloseTo(170.7, 0.1);
      expect(corners[4]).toBeCloseTo(73.2, 0.1);
      expect(corners[5]).toBeCloseTo(126.8, 0.1);
      expect(corners[6]).toBeCloseTo(29.3, 0.1);
      expect(corners[7]).toBeCloseTo(29.3, 0.1);
    });
  });
}
