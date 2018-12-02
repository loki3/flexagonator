namespace Flexagonator {

  describe('interpolateLeaves', () => {
    it('should handle a single split pat', () => {
      const props = [
        { front: { label: "1", color: 3 }, back: { label: "3", color: 5 } }
      ];
      const pfl = new PropertiesForLeaves(props);
      const split = makePat([1, 2]) as Pat;
      interpolateLeaves(split, pfl);

      expect(pfl.getFaceLabel(1)).toBe("1");
      expect(pfl.getColorProp(1)).toBe(3);
      expect(pfl.getFaceLabel(-1)).toBe("2");
      expect(pfl.getColorProp(-1)).toBe(4);
      expect(pfl.getFaceLabel(2)).toBe("2");
      expect(pfl.getColorProp(2)).toBe(4);
      expect(pfl.getFaceLabel(-2)).toBe("3");
      expect(pfl.getColorProp(-2)).toBe(5);
    });

    it('should handle a doubly split pat', () => {
      const props = [
        { front: { color: 3 }, back: { color: 7 } }
      ];
      const pfl = new PropertiesForLeaves(props);
      const split = makePat([[1, 2], [3, 4]]) as Pat;
      interpolateLeaves(split, pfl);

      expect(pfl.getColorProp(1)).toBe(3);
      expect(pfl.getColorProp(-1)).toBe(4);
      expect(pfl.getColorProp(2)).toBe(4);
      expect(pfl.getColorProp(-2)).toBe(5);
      expect(pfl.getColorProp(3)).toBe(5);
      expect(pfl.getColorProp(-3)).toBe(6);
      expect(pfl.getColorProp(4)).toBe(6);
      expect(pfl.getColorProp(-4)).toBe(7);
    });
  });
}
