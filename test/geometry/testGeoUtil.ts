namespace Flexagonator {

  describe('computeTrianglePoint', () => {
    it('should compute the 3rd point of a triangle', () => {
      const p = computeTrianglePoint(toRadians(60), toRadians(60));
      expect(p.x).toBeCloseTo(0.5);
      expect(p.y).toBeCloseTo(0.866, 0.01);
    });
  });

  describe('mirror', () => {
    it('should reflect a point across a line', () => {
      const p = mirror({ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 1, y: 2 });
      expect(p.x).toBeCloseTo(2);
      expect(p.y).toBeCloseTo(1);
    });
  });

}
