namespace Flexagonator {

  describe('FlexagonAngles.getAngles', () => {
    it('understands basics', () => {
      const f = Flexagon.makeFromTree([1, 2, 3, 4, 5, 6]) as Flexagon;
      const fa = new FlexagonAngles(50, 60);
      const angles = fa.getAngles(f);
      expect(angles[0]).toBe(50);
      expect(angles[1]).toBe(60);
      expect(angles[2]).toBe(70);
    });
    it('understands current vertex', () => {
      const f = Flexagon.makeFromTreePlus([1, 2, 3, 4, 5, 6], 1, false) as Flexagon;
      const fa = new FlexagonAngles(50, 60);
      const angles = fa.getAngles(f);
      expect(angles[0]).toBe(60);
      expect(angles[1]).toBe(70);
      expect(angles[2]).toBe(50);
    });
    it('understands mirror', () => {
      const f = Flexagon.makeFromTreePlus([1, 2, 3, 4, 5, 6], 0, true) as Flexagon;
      const fa = new FlexagonAngles(50, 60);
      const angles = fa.getAngles(f);
      expect(angles[0]).toBe(50);
      expect(angles[1]).toBe(70);
      expect(angles[2]).toBe(60);
    });
    it('understands current vertex with mirror', () => {
      const f = Flexagon.makeFromTreePlus([1, 2, 3, 4, 5, 6], 1, true) as Flexagon;
      const fa = new FlexagonAngles(50, 60);
      const angles = fa.getAngles(f);
      expect(angles[0]).toBe(60);
      expect(angles[1]).toBe(50);
      expect(angles[2]).toBe(70);
    });
  });

  describe('FlexagonAngles.makeIsosceles', () => {
    it('makes an isosceles triangle', () => {
      const f = Flexagon.makeFromTree([1, 2, 3, 4, 5]) as Flexagon;
      const fa = FlexagonAngles.makeIsosceles(f);
      const angles = fa.getAngles(f);
      expect(angles[0]).toBe(72);
      expect(angles[1]).toBe(54);
      expect(angles[2]).toBe(54);
    });
  });

}
