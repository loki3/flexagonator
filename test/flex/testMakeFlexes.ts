namespace Flexagonator {

  describe('makeFlexes', () => {
    it('should generate valid flexes', () => {
      const flexes: Flexes = makeAllFlexes(6);
      for (let flex of Object.keys(flexes)) {
        if (isFlexError(flexes[flex])) {
          fail();
          return;
        }
      }
    });
  });

  describe('makeFlexes(6)', () => {
    it('should allow some simple flexes', () => {
      const flexes: Flexes = makeAllFlexes(6);
      const flexagon = Flexagon.makeFromTree([[[-3, -1], -5], -7, [-8, 6], -10, [[-12, [-2, [-11, 13]]], 9], 4]);
      if (isTreeError(flexagon)) {
        fail();
        return;
      }

      // apply P and Sh flexes
      const afterP = flexes["P"].apply(flexagon);
      if (isFlexError(afterP)) {
        fail();
        return;
      }
      const afterPS = flexes["Sh"].apply(afterP);
      if (isFlexError(afterPS)) {
        fail();
        return;
      }

      const expected = [13, [1, [2, [3, [4, 5]]]], [6, 7], 8, [9, 10], [11, 12]];
      expect(areLTArraysEqual(afterPS.getAsLeafTrees(), expected)).toBeTruthy();
    });
  });

  describe('makeFlexes(8)', () => {
    it('should create flexes appropriate for an octaflexagon', () => {
      const flexes: Flexes = makeAllFlexes(8);
      expect(flexes[">"]).toBeDefined();
      expect(flexes["<"]).toBeDefined();
      expect(flexes["^"]).toBeDefined();

      expect(flexes["P'"]).toBeDefined();
      expect(flexes["Sh'"]).toBeDefined();
      expect(flexes["T1"]).toBeDefined();
      expect(flexes["T2"]).toBeDefined();
      expect(flexes["T3"]).toBeDefined();

      const Pin = [[1, 2], 3, [4, 5], 6, [7, 8], 9, [10, 11], 12];
      const Pout = [-1, [5, -3], -4, [8, -6], -7, [11, -9], -10, [2, -12]];
      expect(areLTArraysEqual(flexes["P"].pattern, Pin)).toBeTruthy();
      expect(areLTArraysEqual(flexes["P"].output, Pout)).toBeTruthy();

      const Sin = [[1, 2], 3, 4, 5, 6, 7, [[[8, 9], 10], 11], 12];
      const Sout = [-8, [1, [10, [2, -12]]], 3, 4, 5, 6, 7, [9, 11]];
      expect(areLTArraysEqual(flexes["Sh"].pattern, Sin)).toBeTruthy();
      expect(areLTArraysEqual(flexes["Sh"].output, Sout)).toBeTruthy();

      const Fin = [[1, 2], 3, 4, 5, 6, 7, [[8, 9], [10, 11]], 12];
      const Fout = [9, [[-1, 3], [12, -2]], 4, 5, 6, 7, 10, [-8, -11]];
      expect(areLTArraysEqual(flexes["F"].pattern, Fin)).toBeTruthy();
      expect(areLTArraysEqual(flexes["F"].output, Fout)).toBeTruthy();

      const Stin = [[1, [2, 3]], 4, 5, 6, 7, 8, [9, [10, 11]], 12];
      const Stout = [2, [[-1, 4], -3], 5, 6, 7, 8, 10, [[-9, 12], -11]];
      expect(areLTArraysEqual(flexes["St"].pattern, Stin)).toBeTruthy();
      expect(areLTArraysEqual(flexes["St"].output, Stout)).toBeTruthy();

      const Ltin = [[[[1, 2], 3], 4], 5, 6, 7, 8, 9, [10, 11], 12];
      const Ltout = [12, [2, 4], -1, 3, 5, 6, 7, [10, [8, [11, -9]]]];
      expect(areLTArraysEqual(flexes["Lt"].pattern, Ltin)).toBeTruthy();
      expect(areLTArraysEqual(flexes["Lt"].output, Ltout)).toBeTruthy();
    });
  });
}
