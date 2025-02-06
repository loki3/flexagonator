namespace Flexagonator {

  describe('getSinglePats', () => {
    const flexes = new FoldFlexes();

    function areSame(pr1: PatResults | null, pr2: PatResults | null): boolean {
      if (pr1 === null && pr2 === null) {
        return true;
      } else if (pr1 === null || pr2 === null) {
        return false;
      } else if (pr1.direction !== pr2.direction) {
        return false;
      }
      return pr1.pats.every((p1, i) => p1.isEqual(pr2.pats[i]));
    }
    /** if results don't match, dump them to the console */
    function check(pr1: PatResults | null, expected: LeafTree[] | null, direction?: Direction): boolean {
      const pr2 = expected === null || !direction ? null
        : { pats: expected.map(lt => makePat(lt) as Pat), direction };
      if (areSame(pr1, pr2)) {
        return true;
      }
      const pats1 = pr1 === null ? 'null' : pr1.pats.map(p => p.getString()).join(', ');
      const pats2 = pr2 === null ? 'null' : pr2.pats.map(p => p.getString()).join(', ');
      const dir1 = pr1 === null ? '' : pr1.direction;
      const dir2 = pr2 === null ? '' : pr2.direction;
      console.log(`\ACTUAL: ${pats1}${dir1}  EXPECTED: ${pats2}${dir2}`);
      return false;
    }

    it("reports that there's only one way to fold templates with 4 or less leaves", () => {
      const result1a = getAllSinglePats('/', flexes);
      expect(check(result1a, [1], '/')).toBe(true);
      const result1b = getAllSinglePats('\\', flexes);
      expect(check(result1b, [1], '\\')).toBe(true);

      const result2a = getAllSinglePats('/|', flexes);
      expect(check(result2a, [[1, -2]], '\\')).toBe(true);
      const result2b = getAllSinglePats('|/', flexes);
      expect(check(result2b, [[-2, 1]], '/')).toBe(true);

      const result3 = getAllSinglePats('||/', flexes);
      expect(check(result3, [[[-2, 3], 1]], '/')).toBe(true);

      const result4a = getAllSinglePats('/|/|', flexes);
      expect(check(result4a, [[[3, -4], [1, -2]]], '/')).toBe(true);
      const result4b = getAllSinglePats('|/||', flexes);
      expect(check(result4b, [[[[3, -2], -4], 1]], '/')).toBe(true);
      const result4c = getAllSinglePats('|||/', flexes);
      expect(check(result4c, [[[-2, [-4, 3]], 1]], '/')).toBe(true);

      // and a 5-leaf w/ one folding
      const result5 = getAllSinglePats('////|', flexes);
      expect(check(result5, [[1, [[3, [5, -4]], -2]]], '\\')).toBe(true);
    })

    it("reports that some small templates can't be folded into a single pat", () => {
      const result2 = getAllSinglePats('//', flexes);
      expect(check(result2, null)).toBe(true);

      const result3a = getAllSinglePats('///', flexes);
      expect(check(result3a, null)).toBe(true);
      const result3b = getAllSinglePats('/|/', flexes);
      expect(check(result3b, null)).toBe(true);

      const result5 = getAllSinglePats('/////', flexes);
      expect(check(result5, null)).toBe(true);
    })

    it("returns two foldings for some 5 leaf templates", () => {
      const result5a = getAllSinglePats('||/||', flexes);
      expect(check(result5a, [[5, [[[-2, 3], 1], -4]], [[-2, [5, [3, -4]]], 1]], '/')).toBe(true);
      const result5b = getAllSinglePats('|//|/', flexes);
      expect(check(result5b, [[[-4, 5], [[-2, 1], 3]], [[[[3, -4], -2], 5], 1]], '/')).toBe(true);
      const result5c = getAllSinglePats('|/|/|', flexes);
      expect(check(result5c, [[5, [[-2, 1], [-4, 3]]], [[[3, -2], [5, -4]], 1]], '/')).toBe(true);
    });

    it("returns multiple foldings for a long template", () => {
      // 8-leaf zigzag strip
      const result = getAllSinglePats('/|/|/|/|', flexes);
      const a = [[[-6, 7], [[[3, -4], [1, -2]], 5]], -8];
      const b = [[[3, -4], [1, -2]], [[7, -8], [5, -6]]];
      const c = [[[[[5, -6], [3, -4]], 7], [1, -2]], -8];
      const d = [[[3, [[-6, 7], [-4, 5]]], [1, -2]], -8]
      const e = [[[-6, 7], [1, [[-4, 5], [-2, 3]]]], -8];
      const f = [1, [[7, -8], [[[-4, 5], [-2, 3]], -6]]];
      const g = [1, [[[[-6, 7], [-4, 5]], -8], [-2, 3]]];
      const h = [1, [[-4, [[7, -8], [5, -6]]], [-2, 3]]];
      const i = [1, [[7, -8], [-2, [[5, -6], [3, -4]]]]];
      expect(check(result, [a, b, c, d, e, f, g, h, i], '\\')).toBe(true);
    });

  });

}
