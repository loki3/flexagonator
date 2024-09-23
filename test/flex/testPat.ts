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

  describe('is equal', () => {
    it('checks if pats are equal', () => {
      const a = makePat(1) as Pat;
      const b1 = makePat([1, 2]) as Pat;
      const b2 = makePat([1, 2]) as Pat;
      const c = makePat([1, [2, 3]]) as Pat;
      const d = makePat([1, [[-2, 3], -4]]) as Pat;
      const e = makePat([3, [[-4, -1], 2]]) as Pat;

      expect(a.isEqual(a)).toBe(true);
      expect(a.isEqual(b1)).toBe(false);
      expect(b1.isEqual(b2)).toBe(true);
      expect(c.isEqual(c)).toBe(true);
      expect(c.isEqual(d)).toBe(false);
      expect(d.isEqual(d)).toBe(true);
      expect(d.isEqual(e)).toBe(false);
    });
  });

  describe('remap', () => {
    it('remaps ids', () => {
      const original = [1, [[-2, 3], -4]];
      const expected = [3, [[-4, -1], 2]];
      const map = { 1: 3, 2: 4, 3: -1, 4: -2 };
      const pat = makePat(original) as Pat;
      const result = pat.remap(map).getAsLeafTree();
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

  describe('getStructure', () => {
    it('should give a terse description of the structure of the pat', () => {
      const original = [[-12, [-2, [-11, 13]]], 9];
      const pat = makePat(original) as Pat;
      const result = pat.getStructure();
      expect(result).toBe("[[- [- [- -]]] -]");
    });
  });

  describe('getStructureById', () => {
    it('should include just the portion of a pat that includes the specified ids', () => {
      const original = [[-12, [-2, [-11, 13]]], [1, [3, [4, 5]]]];
      const pat = makePat(original) as Pat;
      const result = pat.getStructureLTEId(2);
      expect(result).toBe("[[: [-2 :]] [1 :]]");
    });
  });

  describe('getString', () => {
    it('should return a string representing the leaves & structure of the pat', () => {
      const original = [[-12, [-2, [-11, 13]]], 9];
      const pat = makePat(original) as Pat;
      const result = pat.getString();
      expect(result).toBe("[[-12,[-2,[-11,13]]],9]");
    });
  });

  describe('findId', () => {
    it('should describe how/if a given id occurs in a pat', () => {
      const pat = makePat([[-12, [-2, [-11, 7]]], 9]) as Pat;
      expect(pat.findId(1)).toBe(WhereLeaf.NotFound);
      expect(pat.findId(7)).toBe(WhereLeaf.Found);
      expect(pat.findId(2)).toBe(WhereLeaf.FoundFlipped);
    });
  });

  describe('unfold', () => {
    it('should refuse to unfold a single leaf', () => {
      const pat = makePat(2) as Pat;
      const unfold = pat.unfold();
      expect(unfold).toBeNull();
    });

    it('should unfold a pair of leaves', () => {
      const pat = makePat([-2, 1]) as Pat;
      const unfold = pat.unfold();
      if (unfold === null) {
        fail('unfolding failed');
      } else {
        expect(unfold[0].getAsLeafTree()).toBe(1);
        expect(unfold[1].getAsLeafTree()).toBe(2);
      }
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
    it('should flip pats with a negative pattern number', () => {
      const pat = makePat([1, [-3, [4, -5]]]);
      if (isTreeError(pat)) {
        fail();
        return;
      }

      const pattern1 = [-1, -2];
      const match1 = pat.matchPattern(pattern1);
      if (isPatternError(match1)) {
        fail();
        return;
      }
      expect(areEqual(match1[1].getAsLeafTree(), -1)).toBeTruthy();
      expect(areEqual(match1[2].getAsLeafTree(), [[5, -4], 3])).toBeTruthy();
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

  describe('createPattern1', () => {
    it('should return existing structure if it matches', () => {
      { // original=1, pattern=3  =>  1
        const pat = makePat(1) as Pat;
        const pattern = 3;
        const splits: Pat[] = [];
        const result = pat.createPattern(pattern, () => { return 2; }, splits);
        expect(result.getAsLeafTree()).toBe(1);
        expect(splits.length).toBe(0);
      }
      { // original=[1,2], pattern=3  => [1,2]
        const pat = makePat([1, 2]) as Pat;
        const pattern = 3;
        const splits: Pat[] = [];
        const result = pat.createPattern(pattern, () => { return 3; }, splits);
        const pair = result.getAsLeafTree() as any[];
        expect(pair[0]).toBe(1);
        expect(pair[1]).toBe(2);
        expect(splits.length).toBe(0);
      }
      { // original=[1,2], pattern=[3,4]  => [1,2]
        const pat = makePat([1, 2]) as Pat;
        const pattern = [3, 4];
        const splits: Pat[] = [];
        const result = pat.createPattern(pattern, () => { return 3; }, splits);
        const pair = result.getAsLeafTree() as any[];
        expect(pair[0]).toBe(1);
        expect(pair[1]).toBe(2);
        expect(splits.length).toBe(0);
      }
    });
  });

  describe('createPattern2', () => {
    it('should create structure if not present already', () => {
      { // original=1, pattern=[3,4]  => [1,5]
        const pat = makePat(1) as Pat;
        const pattern = [3, 4];
        const splits: Pat[] = [];
        const result = pat.createPattern(pattern, () => { return 5; }, splits);
        const pair = result.getAsLeafTree() as any[];
        expect(pair[0]).toBe(1);
        expect(pair[1]).toBe(5);
        expect(splits.length).toBe(1);
        expect(splits[0].getTop()).toBe(1);
        expect(splits[0].getBottom()).toBe(-5);
      }
      { // original=[1,2], pattern=[3,[4,5]]  => [1,[2,6]]
        const pat = makePat([1, 2]) as Pat;
        const pattern = [3, [4, 5]];
        const splits: Pat[] = [];
        const result = pat.createPattern(pattern, () => { return 6; }, splits);
        const tree = result.getAsLeafTree() as any[];
        expect(tree[0]).toBe(1);
        expect(tree[1][0]).toBe(2);
        expect(tree[1][1]).toBe(6);
        expect(splits.length).toBe(1);
        expect(splits[0].getTop()).toBe(2);
        expect(splits[0].getBottom()).toBe(-6);
      }
      { // original=1, pattern=[[2,3],[4,5]]  => [[1,6],[7,8]]
        const pat = makePat(1) as Pat;
        const pattern = [[2, 3], [4, 5]];
        let next = 6;
        const splits: Pat[] = [];
        const result = pat.createPattern(pattern, () => { return next++; }, splits);
        const tree = result.getAsLeafTree() as any[];
        expect(tree[0][0]).toBe(1);
        expect(tree[0][1]).toBe(6);
        expect(tree[1][0]).toBe(7);
        expect(tree[1][1]).toBe(8);
        expect(splits.length).toBe(1);
        expect(splits[0].getTop()).toBe(1);
        expect(splits[0].getBottom()).toBe(-8);
      }
      { // original=1, pattern=[[2,3],4]]  => [[1,6],7]
        const pat = makePat(1) as Pat;
        const pattern = [[2, 3], 4];
        let next = 6;
        const splits: Pat[] = [];
        const result = pat.createPattern(pattern, () => { return next++; }, splits);
        const tree = result.getAsLeafTree() as any[];
        expect(tree[0][0]).toBe(1);
        expect(tree[0][1]).toBe(6);
        expect(tree[1]).toBe(7);
        expect(splits.length).toBe(1);
        expect(splits[0].getTop()).toBe(1);
        expect(splits[0].getBottom()).toBe(-7);
      }
      { // original=[1,2], pattern=[[3,4],[5,6]]  => [[1,7],[2,8]]
        const pat = makePat([1, 2]) as Pat;
        const pattern = [[3, 4], [5, 6]];
        let next = 7;
        const splits: Pat[] = [];
        const result = pat.createPattern(pattern, () => { return next++; }, splits);
        const tree = result.getAsLeafTree() as any[];
        expect(tree[0][0]).toBe(1);
        expect(tree[0][1]).toBe(7);
        expect(tree[1][0]).toBe(2);
        expect(tree[1][1]).toBe(8);
        expect(splits.length).toBe(2);
        expect(splits[0].getTop()).toBe(1);
        expect(splits[0].getBottom()).toBe(-7);
        expect(splits[1].getTop()).toBe(2);
        expect(splits[1].getBottom()).toBe(-8);
      }
    });
  });

  describe('replaceZeros', () => {
    it('should replace all 0s with the value of a counter', () => {
      const original = [0, [[0, 0], 0]];
      const pat = makePat(original) as Pat;

      let next = 1;
      const result = pat.replaceZeros(() => { return next++; });
      const actual = result.getAsLeafTree() as any[];

      const expected = [1, [[2, 3], 4]];
      expect(areEqual(expected, actual)).toBeTruthy();
    });
  });

}
