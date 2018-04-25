namespace Flexagonator {

  function areLeafsEqual(a: Leaf, b: Leaf): boolean {
    return a.id === b.id && a.top === b.top && a.bottom === b.bottom && a.isClock === b.isClock;
  }

  describe('unfold', () => {
    it('preserves a simple pentagon', () => {
      const result = unfold([1, 2, 3, 4, 5]);
      if (isTreeError(result)) {
        fail();
        return;
      }

      expect(result.length).toBe(5);
      for (var i in result) {
        const n = Number.parseInt(i);
        expect(areLeafsEqual(result[n], { id: n + 1, top: 1, bottom: 2, isClock: true })).toBeTruthy();
      }
    });
  });

  describe('unfold', () => {
    it('unfolds a simple pair of pats', () => {
      const result1 = unfold([[3, -4], 5]);
      if (isTreeError(result1)) {
        fail();
        return;
      }
      expect(result1.length).toBe(3);
      expect(areLeafsEqual(result1[0], { id: -4, top: 3, bottom: 2, isClock: false })).toBeTruthy();
      expect(areLeafsEqual(result1[1], { id: -3, top: 3, bottom: 1, isClock: true })).toBeTruthy();
      expect(areLeafsEqual(result1[2], { id: -5, top: 2, bottom: 1, isClock: false })).toBeTruthy();

      const result2 = unfold([3, [-4, 5]]);
      if (isTreeError(result2)) {
        fail();
        return;
      }
      expect(result2.length).toBe(3);
      expect(areLeafsEqual(result2[0], { id: 3, top: 1, bottom: 2, isClock: true })).toBeTruthy();
      expect(areLeafsEqual(result2[1], { id: 5, top: 3, bottom: 2, isClock: false })).toBeTruthy();
      expect(areLeafsEqual(result2[2], { id: 4, top: 3, bottom: 1, isClock: true })).toBeTruthy();
    });
  });

}
