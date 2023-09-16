namespace Flexagonator {
  describe('makeFromTree', () => {
    it('should fail if handed a single pat', () => {
      const trees: LeafTree[] = [[[4, 5], [6, 7]]];
      const error = Flexagon.makeFromTree(trees);
      if (!isTreeError(error)) {
        fail();
        return;
      }
      expect(error.reason).toBe(TreeCode.TooFewPats);
    });
  });

  describe('makeFromTreeCheckZeros', () => {
    it('should fill in 0s', () => {
      const input: LeafTree[] = [0, [0, 0], [[0, 0], [0, 0]]];
      const expected: LeafTree[] = [1, [2, 3], [[4, 5], [6, 7]]];

      const flexagon = Flexagon.makeFromTreeCheckZeros(input) as Flexagon;
      const result = flexagon.getAsLeafTrees();
      for (let i in result) {
        expect(areEqual(expected[i], result[i])).toBeTruthy();
      }
    });
    it('should start after the largest id', () => {
      const input: LeafTree[] = [0, [0, 10], [[0, 20], [0, 0]]];
      const expected: LeafTree[] = [21, [22, 10], [[23, 20], [24, 25]]];

      const flexagon = Flexagon.makeFromTreeCheckZeros(input) as Flexagon;
      const result = flexagon.getAsLeafTrees();
      for (let i in result) {
        expect(areEqual(expected[i], result[i])).toBeTruthy();
      }
    });
  });

  describe('getAsLeafTrees', () => {
    it('should make a flexagon that returns the original trees', () => {
      const trees: LeafTree[] = [1, [2, 3], [[4, 5], [6, 7]]];
      const flexagon = Flexagon.makeFromTree(trees);
      if (isTreeError(flexagon)) {
        fail();
        return;
      }
      const result = flexagon.getAsLeafTrees();
      for (let i in result) {
        expect(areEqual(result[i], trees[i])).toBeTruthy();
      }
    });
  });

  describe('getTopIds', () => {
    it('should return the tops of the top leaves', () => {
      const trees: LeafTree[] = [1, [-2, 3], [[4, 5], [6, -7]]];
      const flexagon = Flexagon.makeFromTree(trees);
      if (isTreeError(flexagon)) {
        fail();
        return;
      }
      const result = flexagon.getTopIds();
      expect(result[0]).toBe(1);
      expect(result[1]).toBe(-2);
      expect(result[2]).toBe(4);
    });
  });

  describe('getBottomIds', () => {
    it('should return the bottoms of the bottom leaves', () => {
      const trees: LeafTree[] = [1, [-2, 3], [[4, 5], [6, -7]]];
      const flexagon = Flexagon.makeFromTree(trees);
      if (isTreeError(flexagon)) {
        fail();
        return;
      }
      const result = flexagon.getBottomIds();
      expect(result[0]).toBe(-1);
      expect(result[1]).toBe(-3);
      expect(result[2]).toBe(7);
    });
  });

  describe('matchPattern', () => {
    const trees: LeafTree[] = [1, [-2, 3], [[4, 5], [6, -7]]];
    const flexagon = Flexagon.makeFromTree(trees) as Flexagon;

    it('reports the portion that matches', () => {
      const pattern: LeafTree[] = [0, [1, 2], [3, 4]];
      const match = flexagon.matchPattern(pattern);
      if (isPatternError(match)) {
        fail();
        return;
      }
      // e.g. 0 matches 1 and 3 matches [4,5]
      expect(match.map(p => p.getString()).join(',')).toBe('1,-2,3,[4,5],[6,-7]');
    });

    it('reports if mismatch', () => {
      const pattern: LeafTree[] = [[0, 1], 2, 3];
      const match = flexagon.matchPattern(pattern);
      if (!isPatternError(match)) {
        fail();
        return;
      }
      expect(match.expected.toString()).toBe('0,1');
      expect(match.actual).toBe(1);
    });
  });
}
