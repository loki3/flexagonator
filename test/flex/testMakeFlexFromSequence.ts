namespace Flexagonator {

  describe('makeFlexFromSequence', () => {
    it("should create Lh from LtbT'", () => {
      const flexes = makeAllFlexes(6);
      const result = makeFlexFromSequence("Ltb T'", flexes);
      if (isFlexError(result)) {
        fail("failed to make flex");
        return;
      }
      expect(result.input).toEqual([[[1, [7, 8]], 9], 2, 3, 4, [[5, 11], 10], 6]);
      expect(result.output).toEqual([[[6, -9], -11], 1, -8, [-2, 7], [[4, -10], -3], 5]);
    });

    it("can handle pat directions", () => {
      const flexes = makeMorphFlexes(6);
      const result = makeFlexFromSequence("Tr2", flexes, "Flex", undefined, "|////|");
      if (isFlexError(result)) {
        fail("failed to make flex using pat directions");
        return;
      }
      expect(result.input).toEqual([[1, [7, 8]], 2, 3, 4, 5, 6]);
      expect(result.output).toEqual([7, 2, 3, 4, 5, [[-1, 6], -8]]);
    });

    it("complains if pat directions don't match", () => {
      const flexes = makeMorphFlexes(6);
      // complains when the directions don't support the given sequence
      const result = makeFlexFromSequence("Tr2", flexes, "Flex", undefined, "|/////");
      expect(isFlexError(result)).toBe(true);
    });

    /*
    // this runs thru all morph-kite combos (AB' and A'B) & dumps the pat structure in a shortform
    it("can recombine all the morph-kite flexes", () => {
      const morphKites = ['Mkf', 'Mkb', 'Mkr', 'Mkl', 'Mkfs', 'Mkbs'];
      const flexes = makeMorphFlexes(6);

      let allFore: string[] = [];
      let allBack: string[] = [];
      for (const one of morphKites) {
        for (const two of morphKites) {
          if (one !== two) {
            const foreSeq = `${one} ${two}'`;
            const foreFlex = makeFlexFromSequence(foreSeq, flexes) as Flex;
            const backSeq = `${one}' ${two}`;
            const backFlex = makeFlexFromSequence(backSeq, flexes) as Flex;

            allFore.push(`${foreSeq}: ${getCount(foreFlex.input)} \t ${getSummary(foreFlex.input)}  \t\t=>\t${getSummary(foreFlex.output)}`);
            allBack.push(`${backSeq}: ${getCount(backFlex.input)}\t ${getSummary(backFlex.input)}  \t\t=>\t${getSummary(backFlex.output)}`);
          }
        }
      }

      console.log("\n\nmorph-kite + inverse");
      allFore.forEach(s => console.log(s));
      console.log("\n\ninverse + morph-kite");
      allBack.forEach(s => console.log(s));
    });

    // describe pat,pat # pat,pat
    function getSummary(trees: LeafTree[]): string {
      return `${getPat(trees[4])} . ${getPat(trees[5])}  # ${getPat(trees[0])} . ${getPat(trees[1])}`;
    }
    // succinctly describe the pat structure, e.g., 21 for [[0,0],0]
    function getPat(tree: LeafTree): string {
      if (typeof (tree) === "number") {
        return "1";
      }
      const a = typeof (tree[0]) === "number";
      const b = typeof (tree[1]) === "number";
      if (a && b) {
        return "2";
      } else if (a) {
        const two = <any[]>tree[1];
        if (typeof (two[0]) === "number" && typeof (two[1]) === "number") {
          return "12";
        }
      } else if (b) {
        const one = <any[]>tree[0];
        if (typeof (one[0]) === "number" && typeof (one[1]) === "number") {
          return "21";
        }
      }
      return `[${getPat(tree[0])},${getPat(tree[1])}]`;
    }

    // count how many leafs are in the first two & last two pats, the ones relevant for the morph-kites
    function getCount(allPats: LeafTree[]): number {
      return getCountOfPat(allPats[0]) + getCountOfPat(allPats[1]) + getCountOfPat(allPats[4]) + getCountOfPat(allPats[5]);
    }
    // count how many leafs in a pat
    function getCountOfPat(pat: LeafTree): number {
      if (typeof (pat) === "number") {
        return 1;
      }
      return getCountOfPat(pat[0]) + getCountOfPat(pat[1]);
    }
    */
  });

}
