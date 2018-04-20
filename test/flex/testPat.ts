namespace Flexagonator {
  describe('makePat', () => {
    it('should make a pat that returns the original array', () => {
      const original = [1, [[-2, 3], 4]];
      const pat = makePat(original);
      if (isTreeError(pat)) {
        fail();
        return;
      }
      const result = pat.getAsLeafTree();
      expect(areEqual(result, original)).toBeTruthy();
    });
  });

  describe('makePat', () => {
    it('should fail when handed invalid leaf tree', () => {
      const tree1 = [1, [[-2, 3, 5], 4]];
      const error1 = makePat(tree1);
      if (!isTreeError(error1)) {
        fail();
        return;
      }
      expect(error1.reason).toBe(TreeCode.ArrayMustHave2Items);

      const tree2 = [1, [[-2, "invalid"], 4]];
      const error2 = makePat(tree2);
      if (!isTreeError(error2)) {
        fail();
        return;
      }
      expect(error2.reason).toBe(TreeCode.LeafIdMustBeInt);
      expect(error2.context).toBe("invalid");
    });
  });

  describe('makeFlipped', () => {
    it('should properly flip a pat', () => {
      const original = [1, [[-2, 3], 4]];
      const expected = [[-4, [-3, 2]], -1];
      const pat = makePat(original);
      if (isTreeError(pat)) {
        fail();
        return;
      }
      const result = pat.makeFlipped().getAsLeafTree();
      expect(areEqual(result, expected)).toBeTruthy();
    });
  });

  describe('getTop', () => {
    it('should return the label for the top leaf', () => {
      const original = [[-1, 2], [-3, [4, -5]]];
      const pat = makePat(original);
      if (isTreeError(pat)) {
        fail();
        return;
      }
      const result = pat.getTop();
      expect(result).toBe(-1);
    });
  });

  describe('getBottom', () => {
    it('should return the label for the bottom leaf', () => {
      const original = [[-1, 2], [-3, [4, -5]]];
      const pat = makePat(original);
      if (isTreeError(pat)) {
        fail();
        return;
      }
      const result = pat.getBottom();
      expect(result).toBe(5);
    });
  });

  describe('hasPattern', () => {
    it('should detect when pattern is present in pat', () => {
      const pat = makePat([[-1, 2], [-3, [4, -5]]]);
      if (isTreeError(pat)) {
        fail();
        return;
      }

      const pattern1 = [1, 2];
      expect(pat.hasPattern(pattern1)).toBeTruthy();
      const pattern2 = [[1, 2], [3, 4]];
      expect(pat.hasPattern(pattern2)).toBeTruthy();
    });
  });

  describe('hasPattern', () => {
    it('should detect when pattern is not present in pat', () => {
      const pat = makePat([1, [-3, [4, -5]]]);
      if (isTreeError(pat)) {
        fail();
        return;
      }

      const pattern1 = [[1, 2], 3];
      expect(pat.hasPattern(pattern1)).toBeFalsy();
      const pattern2 = [1, [[2, 3], 4]];
      expect(pat.hasPattern(pattern2)).toBeFalsy();
    });
  });

  describe('matchPattern', () => {
    it('should find named sup-pats', () => {
      const pat = makePat([[-1, 2], [-3, [4, -5]]]);
      if (isTreeError(pat)) {
        fail();
        return;
      }

      const pattern1 = [1, 2];
      const match1 = pat.matchPattern(pattern1);
      if (isPatternError(match1)) {
        fail();
        return;
      }
      expect(areEqual(match1[1].getAsLeafTree(), [-1, 2])).toBeTruthy();
      expect(areEqual(match1[2].getAsLeafTree(), [-3, [4, -5]])).toBeTruthy();

      const pattern2 = [[1, 2], [3, 4]];
      const match2 = pat.matchPattern(pattern2);
      if (isPatternError(match2)) {
        fail();
        return;
      }
      expect(areEqual(match2[1].getAsLeafTree(), -1)).toBeTruthy();
      expect(areEqual(match2[2].getAsLeafTree(), 2)).toBeTruthy();
      expect(areEqual(match2[3].getAsLeafTree(), -3)).toBeTruthy();
      expect(areEqual(match2[4].getAsLeafTree(), [4, -5])).toBeTruthy();
    });
  });

  describe('matchPattern', () => {
    it('should report error when pattern not found', () => {
      const pat = makePat([[-1, 2], [-3, [4, -5]]]);
      if (isTreeError(pat)) {
        fail();
        return;
      }

      const pattern = [[[1, 2]]];
      const match = pat.matchPattern(pattern);
      expect(isPatternError(match)).toBeTruthy();
    });
  });
}
