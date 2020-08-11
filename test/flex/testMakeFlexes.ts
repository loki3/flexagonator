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

  describe('makeFlexes(8)', () => {
    it('should create flexes appropriate for an octaflexagon', () => {
      const flexes: Flexes = makeAllFlexes(8);
      expect(flexes[">"]).toBeDefined();
      expect(flexes["<"]).toBeDefined();
      expect(flexes["^"]).toBeDefined();

      expect(flexes["P'"]).toBeDefined();
      expect(flexes["S'"]).toBeDefined();
      expect(flexes["T1"]).toBeDefined();
      expect(flexes["T2"]).toBeDefined();
      expect(flexes["T3"]).toBeDefined();
      expect(flexes["Un1'"]).toBeDefined();

      const Pin = [[1, 2], 3, [4, 5], 6, [7, 8], 9, [10, 11], 12];
      const Pout = [-1, [5, -3], -4, [8, -6], -7, [11, -9], -10, [2, -12]];
      expect(areLTArraysEqual(flexes["P"].pattern, Pin)).toBeTruthy();
      expect(areLTArraysEqual(flexes["P"].output, Pout)).toBeTruthy();

      const Sin = [[1, 2], 3, 4, 5, 6, 7, [[[8, 9], 10], 11], 12];
      const Sout = [[1, [10, [2, -12]]], 3, 4, 5, 6, 7, [9, 11], -8];
      expect(areLTArraysEqual(flexes["S"].pattern, Sin)).toBeTruthy();
      expect(areLTArraysEqual(flexes["S"].output, Sout)).toBeTruthy();

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
      expect(areLTArraysEqual(flexes["Ltf"].pattern, Ltin)).toBeTruthy();
      expect(areLTArraysEqual(flexes["Ltf"].output, Ltout)).toBeTruthy();

      const Un1in = [[2, -1], 3, 4, 5, 6, [[[9, -8], -10], 7], -11, -12];
      const Un1out = [-9, -10, [2, [-11, [-1, 12]]], 3, 4, 5, 6, [-8, 7]];
      expect(areLTArraysEqual(flexes["Un1"].pattern, Un1in)).toBeTruthy();
      expect(areLTArraysEqual(flexes["Un1"].output, Un1out)).toBeTruthy();

      const Un2in = [1, [-5, [2, [4, -3]]], -6, -7, -8, -9, -10, [12, -11]];
      const Un2out = [3, [-5, 4], -6, -7, -8, -9, [[-12, 1], [-10, 11]], 2];
      expect(areLTArraysEqual(flexes["Un2"].pattern, Un2in)).toBeTruthy();
      expect(areLTArraysEqual(flexes["Un2"].output, Un2out)).toBeTruthy();
    });
  });
}
