namespace Flexagonator {
  describe('Matrix2Dz', () => {
    it('does nothing when not changed', () => {
      const mat = Matrix2D.new();
      const p = mat.transform({ x: 2, y: 1 });
      expect(p).toEqual({ x: 2, y: 1 });
    });

    it('offsets points', () => {
      const mat = Matrix2D.new().offset(1, 3);
      const p = mat.transform({ x: 2, y: 1 });
      expect(p).toEqual({ x: 3, y: 4 });
    });

    it('scales points', () => {
      const mat = Matrix2D.new().scale(3);
      const p = mat.transform({ x: 2, y: 1 });
      expect(p).toEqual({ x: 6, y: 3 });
    });

    it('rotates points', () => {
      const mat = Matrix2D.new().rotate(Math.PI / 2);
      const p = mat.transform({ x: 2, y: 1 });
      expect(p.x).toBeCloseTo(-1, 0.0001);
      expect(p.y).toBeCloseTo(2, 0.0001);
    });

    it('mirrors points over x-axis', () => {
      const mat = Matrix2D.new().mirror('x');
      const p = mat.transform({ x: 2, y: 1 });
      expect(p).toEqual({ x: -2, y: 1 });
    });

    it('mirrors points over y-axis', () => {
      const mat = Matrix2D.new().mirror('y');
      const p = mat.transform({ x: 2, y: 1 });
      expect(p).toEqual({ x: 2, y: -1 });
    });

    it('composes multiple transforms', () => {
      const mat = Matrix2D.new().offset(1, 3).scale(2).rotate(Math.PI / 2);
      // (2,1) + (1,3) * 2 & rotate-90
      //         (3,4) (6,8) (-8,6)
      const p = mat.transform({ x: 2, y: 1 });
      expect(p.x).toBeCloseTo(-8, 0.0001);
      expect(p.y).toBeCloseTo(6, 0.0001);
    });

    it('inverts the matrix', () => {
      const mat = Matrix2D.new().offset(1, 3).scale(2).rotate(Math.PI / 2);
      const inverse = mat.getInverse();
      if (inverse === false) {
        fail();
      } else {
        const p = inverse.transform({ x: -8, y: 6 });
        expect(p.x).toBeCloseTo(2, 0.0001);
        expect(p.y).toBeCloseTo(1, 0.0001);
      }
    });

    it('computes length', () => {
      // only the scale matters to the length transform
      const mat = Matrix2D.new().offset(1, 3).scale(2).rotate(Math.PI / 2);
      expect(mat.transformLength(2.5)).toBeCloseTo(5, 0.0001);
      expect(mat.transformLength(3)).toBeCloseTo(6, 0.0001);
    });

    it('multiplies matrices', () => {
      const a = Matrix2D.new().offset(1, 2);
      const b = Matrix2D.new().scale(2);

      const mat = a.times(b);
      const p = mat.transform({ x: 3, y: 1 });
      expect(p).toEqual({ x: 8, y: 6 });
    });
  });
}
