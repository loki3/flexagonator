namespace Flexagonator {

  describe('makeFlexes', () => {
    it('should generate valid flexes', () => {
      const flexes: Flexes = makeAllFlexes(6);
      for (var flex of Object.keys(flexes)) {
        if (isFlexError(flexes[flex])) {
          fail();
          return;
        }
      }
    });
  });

  describe('makeFlexes', () => {
    it('should allow some simple flexes', () => {
      const flexes: Flexes = makeAllFlexes(6);
      const flexagon = makeFlexagon([[[-3, -1], -5], -7, [-8, 6], -10, [[-12, [-2, [-11, 13]]], 9], 4]);
      if (isTreeError(flexagon)) {
        fail();
        return;
      }

      // apply P and S flexes
      const afterP = flexes["P"].apply(flexagon);
      if (isFlexError(afterP)) {
        fail();
        return;
      }
      const afterPS = flexes["S"].apply(afterP);
      if (isFlexError(afterPS)) {
        fail();
        return;
      }

      const expected = [[1, [2, [3, [4, 5]]]], [6, 7], 8, [9, 10], [11, 12], 13];
      expect(areLTArraysEqual(afterPS.getAsLeafTrees(), expected)).toBeTruthy();
    });
  });
}
