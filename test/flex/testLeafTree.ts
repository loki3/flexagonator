namespace Flexagonator {
  describe('isValidLeafTree', () => {
    it('should recognize valid leaf trees', () => {
      const tree = [1, [[-2, 3], 4]];
      expect(isValid(tree)).toBeTrue();
    });
    it('should recognize invalid leaf trees', () => {
      // contains a string
      const tree1 = [1, [["a", 3], 4]];
      expect(isValid(tree1)).toBeFalse();

      // contains an array with more than 2 elements
      const tree2 = [1, [[-2, 3, 5], 4]];
      expect(isValid(tree2)).toBeFalse();
    });
  });

  describe('areEqualLeafTrees', () => {
    it('should recognize equal leaf trees', () => {
      const tree = [1, [[-2, 3], 4]];
      expect(areEqual(tree, tree)).toBeTrue();
    });
    it('should recognize unequal leaf trees', () => {
      // unequal numbers
      const tree1 = [1, [[-2, 3], 4]];
      const tree2 = [1, [[-2, 3], 5]];
      expect(areEqual(tree1, tree2)).toBeFalse();

      // unequal sub-arrays
      const tree3 = [1, [[-2, 3], [4, 5]]];
      expect(areEqual(tree1, tree3)).toBeFalse();
    });
  });

  describe('areLTArraysEqual', () => {
    it('should recognize equal leaf tree arrays', () => {
      const trees = [1, 2, [3, 4]];
      expect(areLTArraysEqual(trees, trees)).toBeTrue();
    });
    it('should recognize unequal leaf tree arrays', () => {
      // unequal numbers
      const tree1 = [1, 2, [3, 4]];
      const tree2 = [1, 2, [-4, -3]];
      expect(areLTArraysEqual(tree1, tree2)).toBeFalse();

      // unequal pats
      const tree3 = [1, 2, [3, [4, 5]]];
      expect(areLTArraysEqual(tree1, tree3)).toBeFalse();
    });
  });

  describe('parseLeafTrees', () => {
    it('should read valid leaf trees', () => {
      const tree = [1, [[-2, 3], 4]];
      const input = JSON.stringify(tree);
      const output = parseLeafTrees(input);
      expect(isTreeError(output)).toBeFalse();
      expect(areLTArraysEqual(tree, output as LeafTree[])).toBeTrue();
    });
    it('should produce errors on bad input', () => {
      const output1 = parseLeafTrees("abc");
      expect(isTreeError(output1)).toBeTrue();

      const output2 = parseLeafTrees("[1, [2,3,4]]");
      expect(isTreeError(output2)).toBeTrue();

      const output3 = parseLeafTrees("42");
      expect(isTreeError(output3)).toBeTrue();
    });
  });
}
