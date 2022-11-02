namespace Flexagonator {
  describe('spin', () => {
    it('should create a square', () => {
      // from an edge midpoint to corner to edge midpoint
      const corner: Polar[] = [
        { r: 1, θ: 0 },
        { r: Math.sqrt(2), θ: 45 },
        { r: 1, θ: 90 },
      ];
      const center = { x: 5, y: 5 };

      const points = spin(4, center, 10, corner);
      expect(points.length).toBe(4);
      expect(points[0].length).toBe(3);
      // 1
      expect(points[0][0].x).toBeCloseTo(10, 0.01);
      expect(points[0][0].y).toBeCloseTo(5, 0.01);
      expect(points[0][1].x).toBeCloseTo(10, 0.01);
      expect(points[0][1].y).toBeCloseTo(10, 0.01);
      expect(points[0][2].x).toBeCloseTo(5, 0.01);
      expect(points[0][2].y).toBeCloseTo(10, 0.01);
      // 2
      expect(points[1][0].x).toBeCloseTo(5, 0.01);
      expect(points[1][0].y).toBeCloseTo(10, 0.01);
      expect(points[1][1].x).toBeCloseTo(0, 0.01);
      expect(points[1][1].y).toBeCloseTo(10, 0.01);
      expect(points[1][2].x).toBeCloseTo(0, 0.01);
      expect(points[1][2].y).toBeCloseTo(5, 0.01);
      // 3
      expect(points[2][0].x).toBeCloseTo(0, 0.01);
      expect(points[2][0].y).toBeCloseTo(5, 0.01);
      expect(points[2][1].x).toBeCloseTo(0, 0.01);
      expect(points[2][1].y).toBeCloseTo(0, 0.01);
      expect(points[2][2].x).toBeCloseTo(5, 0.01);
      expect(points[2][2].y).toBeCloseTo(0, 0.01);
      // 4
      expect(points[3][0].x).toBeCloseTo(5, 0.01);
      expect(points[3][0].y).toBeCloseTo(0, 0.01);
      expect(points[3][1].x).toBeCloseTo(10, 0.01);
      expect(points[3][1].y).toBeCloseTo(0, 0.01);
      expect(points[3][2].x).toBeCloseTo(10, 0.01);
      expect(points[3][2].y).toBeCloseTo(5, 0.01);
    });
  });
}
