namespace Flexagonator {

  describe('findRearrangements', () => {
    const f1 = Flexagon.makeFromTree([[[-2, 3], 1], 4]) as Flexagon;
    const f2 = Flexagon.makeFromTree([1, [[-3, 2], 4]]) as Flexagon;
    const f3 = Flexagon.makeFromTree([[3, [1, -2]], 4]) as Flexagon;
    const f4 = Flexagon.makeFromTree([-4, [-1, [-3, 2]]]) as Flexagon;

    it('complains about bad input', () => {
      const result = findRearrangements([], ['bad']);
      expect(isError(result)).toBe(true);
    })

    it('reports matches', () => {
      // doesn't match 1 because it's the same
      const result = findRearrangements([f2, f3], [[-2, 3], 1]) as number[];
      expect(areLTArraysEqual(result, [1])).toBe(true);
    })

    it('no match if equal', () => {
      const result = findRearrangements([f1, f2], [[-2, 3], 1]) as number[];
      expect(areLTArraysEqual(result, [])).toBe(true);
    })

    it('no match if flipped', () => {
      const result = findRearrangements([f4, f2], [[-2, 3], 1]) as number[];
      expect(areLTArraysEqual(result, [])).toBe(true);
    })
  });

}
