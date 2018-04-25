namespace Flexagonator {

  function areLeafsEqual(a: Leaf, b: Leaf): boolean {
    return a.id === b.id && a.top === b.top && a.bottom === b.bottom && a.isClock === b.isClock;
  }

  describe('unfold', () => {
    it('preserves a simple hexagon', () => {
      const hexagon = [1, 2, 3, 4, 5, 6];
      const result = unfold(hexagon);
      if (isTreeError(result)) {
        fail();
        return;
      }

      expect(result.length).toBe(6);
      for (var i in result) {
        const n = Number.parseInt(i);
        expect(areLeafsEqual(result[n], { id: n + 1, top: 1, bottom: 2, isClock: true })).toBeTruthy();
      }
    });
  });

}
