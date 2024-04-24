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

      // PS>
      const afterP = flexes["P"].apply(flexagon) as Flexagon;
      const afterPS = flexes["S"].apply(afterP) as Flexagon;
      const afterPSshift = flexes[">"].apply(afterPS) as Flexagon;

      const expected = [[6, 7], 8, [9, 10], [11, 12], 13, [1, [2, [3, [4, 5]]]]];
      expect(areLTArraysEqual(afterPSshift.getAsLeafTrees(), expected)).toBeTruthy();
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

      const Sin = [[7, -6], 8, 9, 10, 11, 12, [[[3, -2], -4], 1], -5];
      const Sout = [[7, [-4, [-6, 5]]], 8, 9, 10, 11, 12, [-2, 1], -3];
      expect(areLTArraysEqual(flexes["S"].input, Sin)).toBeTruthy();
      expect(areLTArraysEqual(flexes["S"].output, Sout)).toBeTruthy();

      const S3in = [[8, -7], 9, 10, 11, 12, [[[3, -2], -4], 1], -5, -6];
      const S3out = [[8, [-5, [-7, 6]]], 9, 10, 11, 12, [-2, 1], -3, -4];
      expect(areLTArraysEqual(flexes["S3"].input, S3in)).toBeTruthy();
      expect(areLTArraysEqual(flexes["S3"].output, S3out)).toBeTruthy();

      const Vin = [1, [-3, 2], 4, [-6, 5], [8, -7], 9, 10, [-12, 11]];
      const Vout = [[5, -4], 6, 7, [-9, 8], [11, -10], 12, [2, -1], 3];
      expect(areLTArraysEqual(flexes["V"].input, Vin)).toBeTruthy();
      expect(areLTArraysEqual(flexes["V"].output, Vout)).toBeTruthy();

      const Fin = [[7, -6], 8, 9, 10, 11, 12, [[3, -4], [1, -2]], -5];
      const Fout = [-4, [[-7, 8], [-5, 6]], 9, 10, 11, 12, 1, [-3, 2]];
      expect(areLTArraysEqual(flexes["F"].input, Fin)).toBeTruthy();
      expect(areLTArraysEqual(flexes["F"].output, Fout)).toBeTruthy();

      const Stin = [[7, [5, -6]], 8, 9, 10, 11, 12, [3, [1, -2]], 4];
      const Stout = [5, [[-7, 8], 6], 9, 10, 11, 12, 1, [[-3, 4], 2]];
      expect(areLTArraysEqual(flexes["St"].input, Stin)).toBeTruthy();
      expect(areLTArraysEqual(flexes["St"].output, Stout)).toBeTruthy();

      const Ltin = [[[[1, 2], 3], 4], 5, 6, 7, 8, 9, [10, 11], 12];
      const Ltout = [12, [2, 4], -1, 3, 5, 6, 7, [10, [8, [11, -9]]]];
      expect(areLTArraysEqual(flexes["Ltf"].input, Ltin)).toBeTruthy();
      expect(areLTArraysEqual(flexes["Ltf"].output, Ltout)).toBeTruthy();

      const Fmin = [[8, -7], 9, 10, 11, 12, [[3, -4], [1, -2]], -5, -6];
      const Fmout = [[8, [-5, [-7, 6]]], 9, 10, 11, 12, 1, [-3, 2], -4];
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

  describe('createSinglePinch', () => {
    const flexes: Flexes = makeAllFlexes(12);

    it('defines pat structure', () => {
      const p3333 = flexes["P3333"];
      expect(areLTArraysEqual(p3333.input, [[-2, 1], -3, -4, [6, -5], 7, 8, [-10, 9], -11, -12, [14, -13], 15, 16])).toBe(true);
      expect(areLTArraysEqual(p3333.output, [2, 3, [-5, 4], -6, -7, [9, -8], 10, 11, [-13, 12], -14, -15, [1, 16]])).toBe(true);

      const p444 = flexes["P444"];
      expect(areLTArraysEqual(p444.input, [[-2, 1], -3, -4, -5, [7, -6], 8, 9, 10, [-12, 11], -13, -14, -15])).toBe(true);
      expect(areLTArraysEqual(p444.output, [2, 3, 4, [-6, 5], -7, -8, -9, [11, -10], 12, 13, 14, [1, 15]])).toBe(true);
    });

    it('defines directions', () => {
      const p3333 = flexes["P3333"];
      expect(p3333.inputDirs ? p3333.inputDirs.asString(true) : "").toBe("/?//?//?//?/");
      expect(p3333.outputDirs ? p3333.outputDirs.asString(true) : "").toBe("/?//?//?//?/");
      expect(p3333.orderOfDirs ? p3333.orderOfDirs.toString() : "").toBe("1,-2,3,4,-5,6,7,-8,9,10,-11,12");

      const p444 = flexes["P444"];
      expect(p444.inputDirs ? p444.inputDirs.asString(true) : "").toBe("/??//??//??/");
      expect(p444.outputDirs ? p444.outputDirs.asString(true) : "").toBe("/??//??//??/");
      expect(p444.orderOfDirs ? p444.orderOfDirs.toString() : "").toBe("1,-2,-3,4,5,-6,-7,8,9,-10,-11,12");
    });

    it('correctly modifies a flexagon', () => {
      const flexes9: Flexes = makeAllFlexes(9);
      const p333 = flexes9["P333"];
      const flexagon = Flexagon.makeFromTree([[-2, 1], -3, -4, [6, -5], 7, 8, [-10, 9], -11, -12],
        undefined, Directions.make("/|//|//|/")) as Flexagon;
      const after = p333.apply(flexagon) as Flexagon;
      expect(JSON.stringify(after.getAsLeafTrees())).toBe("[2,3,[-5,4],-6,-7,[9,-8],10,11,[1,12]]");
      expect(after.directions ? after.directions.asString(true) : "").toBe("/////////");
      expect(after.angleTracker.corners.toString()).toBe("1,0,2");
    });
  });

  describe('createDoublePinch', () => {
    const flexes: Flexes = makeAllFlexes(12);

    it('defines pat structure', () => {
      const p3333 = flexes["P3333d"];
      expect(areLTArraysEqual(p3333.input, [[[1, 3], 2], 4, 5, [[6, 8], 7], 9, 10, [[11, 13], 12], 14, 15, [[16, 18], 17], 19, 20])).toBe(true);
      expect(areLTArraysEqual(p3333.output, [3, 4, [-6, [5, -7]], 8, 9, [-11, [10, -12]], 13, 14, [-16, [15, -17]], 18, 19, [-1, [20, -2]]])).toBe(true);

      const p444 = flexes["P444d"];
      expect(areLTArraysEqual(p444.input, [[[1, 3], 2], 4, 5, 6, [[7, 9], 8], 10, 11, 12, [[13, 15], 14], 16, 17, 18])).toBe(true);
      expect(areLTArraysEqual(p444.output, [3, 4, 5, [-7, [6, -8]], 9, 10, 11, [-13, [12, -14]], 15, 16, 17, [-1, [18, -2]]])).toBe(true);
    });

    it('defines directions', () => {
      const p3333 = flexes["P3333d"];
      expect(p3333.inputDirs ? p3333.inputDirs.asString(true) : "").toBe("/?//?//?//?/");
      expect(p3333.outputDirs ? p3333.outputDirs.asString(true) : "").toBe("/?//?//?//?/");

      const p444 = flexes["P444d"];
      expect(p444.inputDirs ? p444.inputDirs.asString(true) : "").toBe("/??//??//??/");
      expect(p444.outputDirs ? p444.outputDirs.asString(true) : "").toBe("/??//??//??/");
    });
  });

  describe('makeFlexes(12)', () => {
    const flexes: Flexes = makeAllFlexes(12);

    it('creates working F3', () => {
      const f3 = flexes["F3"];
      const flexagon = Flexagon.makeFromTree([[1, 2], 3, 4, 5, 6, 7, 8, 9, 10, [[11, 12], [13, 14]], 15, 16],
        undefined, Directions.make("//|||||||///")) as Flexagon;
      const after = f3.apply(flexagon) as Flexagon;
      expect(JSON.stringify(after.getAsLeafTrees())).toBe("[12,15,[[-1,3],[16,-2]],4,5,6,7,8,9,10,13,[-11,-14]]");
      expect(after.directions ? after.directions.asString(true) : "").toBe("///|||||||//");
      expect(after.angleTracker.corners.toString()).toBe("0,2,1");
    });

    it('creates working F4', () => {
      const f4 = flexes["F4"];
      const flexagon = Flexagon.makeFromTree([[1, 2], 3, 4, 5, 6, 7, 8, 9, [[10, 11], [12, 13]], 14, 15, 16],
        undefined, Directions.make("//||||||////")) as Flexagon;
      const after = f4.apply(flexagon) as Flexagon;
      expect(JSON.stringify(after.getAsLeafTrees())).toBe("[11,14,15,[[-1,3],[16,-2]],4,5,6,7,8,9,12,[-10,-13]]");
      expect(after.directions ? after.directions.asString(true) : "").toBe("////||||||//");
      expect(after.angleTracker.corners.toString()).toBe("0,1,2");
    });
  });

  describe('makeFlexes', () => {
    const flexes: Flexes = makeAllFlexes(6);

    it('shifts adjust pats & directions', () => {
      const flexagon = Flexagon.makeFromTree([1, 2, 3, 4, 5, 6], undefined, Directions.make("/|////")) as Flexagon;

      const afterRight = flexes[">"].apply(flexagon) as Flexagon;
      expect(areLTArraysEqual(afterRight.getAsLeafTrees(), [2, 3, 4, 5, 6, 1])).toBeTruthy();
      const actualRight = (afterRight.directions as Directions).asString(true);
      expect(actualRight).toBe("|/////");

      const afterLeft = flexes["<"].apply(flexagon) as Flexagon;
      expect(areLTArraysEqual(afterLeft.getAsLeafTrees(), [6, 1, 2, 3, 4, 5])).toBeTruthy();
      const actualLeft = (afterLeft.directions as Directions).asString(true);
      expect(actualLeft).toBe("//|///");
    });

    it('shifts adjust angles', () => {
      const angles = AngleTracker.make([0, 1, 2], false);
      const flexagon = Flexagon.makeFromTree([1, 2, 3, 4, 5, 6], angles, Directions.make("/|////")) as Flexagon;

      // dir is / so ABC -> ACB
      const afterRight = flexes[">"].apply(flexagon) as Flexagon;
      expect(afterRight.angleTracker.corners[0]).toBe(0);
      expect(afterRight.angleTracker.corners[1]).toBe(2);
      // dir is \ so ABC -> ACB -> CAB
      const afterRightRight = flexes[">"].apply(afterRight) as Flexagon;
      expect(afterRightRight.angleTracker.corners[0]).toBe(2);
      expect(afterRightRight.angleTracker.corners[1]).toBe(0);

      // < should undo the >
      const afterLeft = flexes["<"].apply(afterRightRight) as Flexagon;
      expect(afterLeft.angleTracker.corners[0]).toBe(0);
      expect(afterLeft.angleTracker.corners[1]).toBe(2);
      // and back to ABC
      const afterLeftLeft = flexes["<"].apply(afterLeft) as Flexagon;
      expect(afterLeftLeft.angleTracker.corners[0]).toBe(0);
      expect(afterLeftLeft.angleTracker.corners[1]).toBe(1);
    });

    it('turning it over adjusts pats & directions', () => {
      const flexagon = Flexagon.makeFromTree([1, 2, 3, 4, 5, 6], undefined, Directions.make("/|////")) as Flexagon;

      const afterOver = flexes["^"].apply(flexagon) as Flexagon;
      expect(areLTArraysEqual(afterOver.getAsLeafTrees(), [-6, -5, -4, -3, -2, -1])).toBeTruthy();
      const actualOver = (afterOver.directions as Directions).asString(true);
      expect(actualOver).toBe("////|/");

      const afterChange = flexes["~"].apply(flexagon) as Flexagon;
      expect(areLTArraysEqual(afterChange.getAsLeafTrees(), [-1, -2, -3, -4, -5, -6])).toBeTruthy();
      const actualChange = (afterChange.directions as Directions).asString(true);
      expect(actualChange).toBe("|/||||");
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
