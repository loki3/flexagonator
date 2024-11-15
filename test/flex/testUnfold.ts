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
      for (let i in result) {
        const n = Number.parseInt(i);
        expect(areLeafsEqual(result[n], { id: n + 1, top: 1, bottom: 2, isClock: true })).toBeTrue();
      }
    });

    it('unfolds a simple pair of pats', () => {
      const result1 = unfold([[3, -4], 5]);
      if (isTreeError(result1)) {
        fail();
        return;
      }
      expect(result1.length).toBe(3);
      expect(areLeafsEqual(result1[0], { id: -4, top: 3, bottom: 2, isClock: false })).toBeTrue();
      expect(areLeafsEqual(result1[1], { id: -3, top: 3, bottom: 1, isClock: true })).toBeTrue();
      expect(areLeafsEqual(result1[2], { id: -5, top: 2, bottom: 1, isClock: false })).toBeTrue();

      const result2 = unfold([3, [-4, 5]]);
      if (isTreeError(result2)) {
        fail();
        return;
      }
      expect(result2.length).toBe(3);
      expect(areLeafsEqual(result2[0], { id: 3, top: 1, bottom: 2, isClock: true })).toBeTrue();
      expect(areLeafsEqual(result2[1], { id: 5, top: 3, bottom: 2, isClock: false })).toBeTrue();
      expect(areLeafsEqual(result2[2], { id: 4, top: 3, bottom: 1, isClock: true })).toBeTrue();
    });

    it('unfolds more complex pats', () => {
      const result1 = unfold([[[1, [2, 3]], 4], 5, [6, [7, 8]]]);
      if (isTreeError(result1)) {
        fail();
        return;
      }
      expect(result1.length).toBe(8);
      expect(areLeafsEqual(result1[0], { id: 4, top: 3, bottom: 2, isClock: false })).toBeTrue();
      expect(areLeafsEqual(result1[1], { id: -1, top: 4, bottom: 1, isClock: false })).toBeTrue();
      expect(areLeafsEqual(result1[2], { id: 3, top: 5, bottom: 3, isClock: false })).toBeTrue();
      expect(areLeafsEqual(result1[3], { id: -2, top: 5, bottom: 4, isClock: true })).toBeTrue();
      expect(areLeafsEqual(result1[4], { id: -5, top: 2, bottom: 1, isClock: false })).toBeTrue();
      expect(areLeafsEqual(result1[5], { id: -7, top: 7, bottom: 6, isClock: false })).toBeTrue();
      expect(areLeafsEqual(result1[6], { id: 8, top: 7, bottom: 2, isClock: true })).toBeTrue();
      expect(areLeafsEqual(result1[7], { id: -6, top: 6, bottom: 1, isClock: true })).toBeTrue();
    });

    it('passes thru custom directions between pats', () => {
      const result = unfold([1, 2, 3, 4, 5], Directions.make([false, true, false, true, false]));
      if (isTreeError(result)) {
        fail();
        return;
      }

      expect(result.length).toBe(5);
      for (let i in result) {
        const n = Number.parseInt(i);
        const isClock = (n % 2) === 1;
        expect(areLeafsEqual(result[n], { id: n + 1, top: 1, bottom: 2, isClock })).toBeTrue();
      }
    });
  });

}
