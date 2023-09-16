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
    const directions = Directions.make('/|/')
    const flexagon = Flexagon.makeFromTree(trees, undefined, directions) as Flexagon;

    it('reports pats that match', () => {
      const pattern: LeafTree[] = [0, [1, 2], [3, 4]];
      const match = flexagon.matchPattern(pattern);
      if (isPatternError(match)) {
        fail();
        return;
      }
      // e.g. 0 matches 1 and 3 matches [4,5]
      expect(match.map(p => p.getString()).join(',')).toBe('1,-2,3,[4,5],[6,-7]');
    });

    it('reports if pats mismatch', () => {
      const pattern: LeafTree[] = [[0, 1], 2, 3];
      const match = flexagon.matchPattern(pattern);
      if (!isPatternError(match) || match.expected === undefined) {
        fail();
        return;
      }
      expect(match.expected.toString()).toBe('0,1');
      expect(match.actual).toBe(1);
    });

    it('reports pats that match if directions match', () => {
      const pattern: LeafTree[] = [0, [1, 2], [3, 4]];
      const directions = DirectionsOpt.make('/|/') as DirectionsOpt;
      const match = flexagon.matchPattern(pattern, directions);
      if (isPatternError(match)) {
        fail();
        return;
      }
      // e.g. 0 matches 1 and 3 matches [4,5]
      expect(match.map(p => p.getString()).join(',')).toBe('1,-2,3,[4,5],[6,-7]');
    });

    it('supports optional directions', () => {
      // match
      const pattern: LeafTree[] = [0, [1, 2], [3, 4]];
      const directions = DirectionsOpt.make('??/') as DirectionsOpt;
      const match = flexagon.matchPattern(pattern, directions);
      if (isPatternError(match)) {
        console.log(match)
        fail();
        return;
      }
      expect(match.map(p => p.getString()).join(',')).toBe('1,-2,3,[4,5],[6,-7]');

      // mismatch
      const directions2 = DirectionsOpt.make('??|') as DirectionsOpt;
      const match2 = flexagon.matchPattern(pattern, directions2);
      if (!isPatternError(match2) || match2.expectedDirs === undefined || match2.actualDirs === undefined) {
        fail();
        return;
      }
      expect(match2.expectedDirs.asString(true)).toBe('??|');
      expect(match2.actualDirs.asString(true)).toBe('/|/');
    });

    it('reports if directions mismatch', () => {
      const pattern: LeafTree[] = [0, 1, 2];
      const directions = DirectionsOpt.make('//|') as DirectionsOpt;
      const match = flexagon.matchPattern(pattern, directions) as DirectionsOpt;
      if (!isPatternError(match) || match.expectedDirs === undefined || match.actualDirs === undefined) {
        fail();
        return;
      }
      expect(match.expectedDirs.asString(true)).toBe('//|');
      expect(match.actualDirs.asString(true)).toBe('/|/');
    });
  });
}
