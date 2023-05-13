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
      expect(flexes["S3'"]).toBeDefined();
      expect(flexes["T1"]).toBeDefined();
      expect(flexes["T2"]).toBeDefined();
      expect(flexes["T3"]).toBeDefined();

      const Pin = [[1, 2], 3, [4, 5], 6, [7, 8], 9, [10, 11], 12];
      const Pout = [-1, [5, -3], -4, [8, -6], -7, [11, -9], -10, [2, -12]];
      expect(areLTArraysEqual(flexes["P"].input, Pin)).toBeTruthy();
      expect(areLTArraysEqual(flexes["P"].output, Pout)).toBeTruthy();

      const Sin = [[1, 2], 3, 4, 5, 6, 7, [[[8, 9], 10], 11], 12];
      const Sout = [[1, [10, [2, -12]]], 3, 4, 5, 6, 7, [9, 11], -8];
      expect(areLTArraysEqual(flexes["S"].input, Sin)).toBeTruthy();
      expect(areLTArraysEqual(flexes["S"].output, Sout)).toBeTruthy();

      const S3in = [[2, -1], 3, 4, 5, 6, [[[9, -8], -10], 7], -11, -12];
      const S3out = [[2, [-11, [-1, 12]]], 3, 4, 5, 6, [-8, 7], -9, -10];
      expect(areLTArraysEqual(flexes["S3"].input, S3in)).toBeTruthy();
      expect(areLTArraysEqual(flexes["S3"].output, S3out)).toBeTruthy();

      const Vin = [1, [-3, 2], 4, [-6, 5], [8, -7], 9, 10, [-12, 11]];
      const Vout = [[5, -4], 6, 7, [-9, 8], [11, -10], 12, [2, -1], 3];
      expect(areLTArraysEqual(flexes["V"].input, Vin)).toBeTruthy();
      expect(areLTArraysEqual(flexes["V"].output, Vout)).toBeTruthy();

      const Fin = [[1, 2], 3, 4, 5, 6, 7, [[8, 9], [10, 11]], 12];
      const Fout = [9, [[-1, 3], [12, -2]], 4, 5, 6, 7, 10, [-8, -11]];
      expect(areLTArraysEqual(flexes["F"].input, Fin)).toBeTruthy();
      expect(areLTArraysEqual(flexes["F"].output, Fout)).toBeTruthy();

      const Stin = [[1, [2, 3]], 4, 5, 6, 7, 8, [9, [10, 11]], 12];
      const Stout = [2, [[-1, 4], -3], 5, 6, 7, 8, 10, [[-9, 12], -11]];
      expect(areLTArraysEqual(flexes["St"].input, Stin)).toBeTruthy();
      expect(areLTArraysEqual(flexes["St"].output, Stout)).toBeTruthy();

      const Ltin = [[[[1, 2], 3], 4], 5, 6, 7, 8, 9, [10, 11], 12];
      const Ltout = [12, [2, 4], -1, 3, 5, 6, 7, [10, [8, [11, -9]]]];
      expect(areLTArraysEqual(flexes["Ltf"].input, Ltin)).toBeTruthy();
      expect(areLTArraysEqual(flexes["Ltf"].output, Ltout)).toBeTruthy();

      const Fmin = [[2, -1], 3, 4, 5, 6, [[9, -10], [7, -8]], -11, -12];
      const Fmout = [[2, [-11, [-1, 12]]], 3, 4, 5, 6, 7, [-9, 8], -10];
      expect(areLTArraysEqual(flexes["Fm"].input, Fmin)).toBeTruthy();
      expect(areLTArraysEqual(flexes["Fm"].output, Fmout)).toBeTruthy();
    });
  });

  describe('v-flex', () => {
    function checkV(numPats: number) {
      const flexes = makeAllFlexes(numPats);
      const vflex = flexes["V"];
      const flexagon = Flexagon.makeFromTree(vflex.input) as Flexagon;

      const afterV = vflex.apply(flexagon) as Flexagon;
      const actual = (flexes["^"].apply(afterV) as Flexagon).getAsLeafTrees();
      const expected = vflex.input;
      // just check that the pattern of leaves-per-pat matches all around the flexagon
      const check = expected.every((p, i) => {
        const other = actual[i];
        const count1 = typeof p === 'number' ? 1 : p.length;
        const count2 = typeof other === 'number' ? 1 : other.length;
        return count1 === count2;
      });
      if (!check) {
        console.log('v-flex failed for numPats=', numPats, '\nexpected', vflex.input, '\nactual', actual);
        fail('failed');
      }
    }

    it("should end up with V' = ^V^", () => {
      checkV(6);
      checkV(8);
      checkV(10);
    });
  });

  /*
  // enable this test to normalize all the flex definitions
  // so leaves are numbered in the order they occur in the template
  describe('makeFlexes - normalize', () => {
    function normalizeFlex(flex: string, flexes: Flexes, flexagon: Flexagon) {
      const fm = new FlexagonManager(flexagon, undefined, flexes);

      fm.applyFlex(flex + '+');
      const pre = fm.flexagon.normalizeIds();
      fm.flexagon = pre;

      fm.applyFlex(flex);
      const post = fm.flexagon;

      console.log(`${flex}\n${JSON.stringify(pre.getAsLeafTrees())}\n${JSON.stringify(post.getAsLeafTrees())}\n`);
    }

    function normalizeAllFlexes(numPats: number) {
      const pats = [];
      for (var i = 1; i <= numPats; i++) {
        pats.push(i);
      }
      const flexagon = Flexagon.makeFromTree(pats) as Flexagon;

      const flexes: Flexes = makeAllFlexes(numPats);
      for (let flex of Object.keys(flexes)) {
        normalizeFlex(flex, flexes, flexagon);
      }
    }

    it('can normalize flex definitions', () => {
      normalizeAllFlexes(6);
    });
  });
  */
}
