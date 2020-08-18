namespace Flexagonator {

  describe('FlexagonAngles.getAngles', () => {
    it('understands basics', () => {
      const f = Flexagon.makeFromTree([1, 2, 3, 4, 5, 6]) as Flexagon;
      const fa = FlexagonAngles.makeAngles(50, 60);
      const angles = fa.getAngles(f);
      expect(angles[0]).toBe(50);
      expect(angles[1]).toBe(60);
      expect(angles[2]).toBe(70);
    });
    it('understands current vertex', () => {
      const f = Flexagon.makeFromTreePlus([1, 2, 3, 4, 5, 6], 1, false) as Flexagon;
      const fa = FlexagonAngles.makeAngles(50, 60);
      const angles = fa.getAngles(f);
      expect(angles[0]).toBe(60);
      expect(angles[1]).toBe(70);
      expect(angles[2]).toBe(50);
    });
    it('understands mirror', () => {
      const f = Flexagon.makeFromTreePlus([1, 2, 3, 4, 5, 6], 0, true) as Flexagon;
      const fa = FlexagonAngles.makeAngles(50, 60);
      const angles = fa.getAngles(f);
      expect(angles[0]).toBe(50);
      expect(angles[1]).toBe(70);
      expect(angles[2]).toBe(60);
    });
    it('understands current vertex with mirror', () => {
      const f = Flexagon.makeFromTreePlus([1, 2, 3, 4, 5, 6], 1, true) as Flexagon;
      const fa = FlexagonAngles.makeAngles(50, 60);
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

  describe('FlexagonAngles.getAnglesUsingDirection', () => {
    it('should work with isosceles triangle', () => {
      const f = Flexagon.makeFromTree([1, 2, 3, 4, 5]) as Flexagon;
      const fa = FlexagonAngles.makeIsosceles(f);

      const angles1 = fa.getAnglesUsingDirection(f, true);
      expect(angles1[0]).toBe(54);
      expect(angles1[1]).toBe(72);
      expect(angles1[2]).toBe(54);

      const angles2 = fa.getAnglesUsingDirection(f, false);
      expect(angles2[0]).toBe(54);
      expect(angles2[1]).toBe(54);
      expect(angles2[2]).toBe(72);
    });
  });

  describe('FlexagonAngles.getAnglesUsingDirection', () => {
    it('should work with 3 different angles', () => {
      const f = Flexagon.makeFromTree([1, 2, 3, 4, 5, 6]) as Flexagon;
      const fa = FlexagonAngles.makeAngles(30, 60);

      const angles1 = fa.getAnglesUsingDirection(f, true);
      expect(angles1[0]).toBe(60);
      expect(angles1[1]).toBe(30);
      expect(angles1[2]).toBe(90);

      const angles2 = fa.getAnglesUsingDirection(f, false);
      expect(angles2[0]).toBe(90);
      expect(angles2[1]).toBe(60);
      expect(angles2[2]).toBe(30);
    });
  });

}
