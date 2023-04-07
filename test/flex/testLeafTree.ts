namespace Flexagonator {
  describe('isValidLeafTree', () => {
    it('should recognize valid leaf trees', () => {
      const tree = [1, [[-2, 3], 4]];
      expect(isValid(tree)).toBeTruthy();
    });
    it('should recognize invalid leaf trees', () => {
      // contains a string
      const tree1 = [1, [["a", 3], 4]];
      expect(isValid(tree1)).toBeFalsy();

      // contains an array with more than 2 elements
      const tree2 = [1, [[-2, 3, 5], 4]];
      expect(isValid(tree2)).toBeFalsy();
    });
  });

  describe('areEqualLeafTrees', () => {
    it('should recognize equal leaf trees', () => {
      const tree = [1, [[-2, 3], 4]];
      expect(areEqual(tree, tree)).toBeTruthy();
    });
    it('should recognize unequal leaf trees', () => {
      // unequal numbers
      const tree1 = [1, [[-2, 3], 4]];
      const tree2 = [1, [[-2, 3], 5]];
      expect(areEqual(tree1, tree2)).toBeFalsy();

      // unequal sub-arrays
      const tree3 = [1, [[-2, 3], [4, 5]]];
      expect(areEqual(tree1, tree3)).toBeFalsy();
    });
  });

  describe('areLTArraysEqual', () => {
    it('should recognize equal leaf tree arrays', () => {
      const trees = [1, 2, [3, 4]];
      expect(areLTArraysEqual(trees, trees)).toBeTruthy();
    });
    it('should recognize unequal leaf tree arrays', () => {
      // unequal numbers
      const tree1 = [1, 2, [3, 4]];
      const tree2 = [1, 2, [-4, -3]];
      expect(areLTArraysEqual(tree1, tree2)).toBeFalsy();

      // unequal pats
      const tree3 = [1, 2, [3, [4, 5]]];
      expect(areLTArraysEqual(tree1, tree3)).toBeFalsy();
    });
  });

  describe('parseLeafTrees', () => {
    it('should read valid leaf trees', () => {
      const tree = [1, [[-2, 3], 4]];
      const input = JSON.stringify(tree);
      const output = parseLeafTrees(input);
      expect(isTreeError(output)).toBeFalsy();
      expect(areLTArraysEqual(tree, output as LeafTree[])).toBeTruthy();
    });
    it('should produce errors on bad input', () => {
      const output1 = parseLeafTrees("abc");
      expect(isTreeError(output1)).toBeTruthy();

      const output2 = parseLeafTrees("[1, [2,3,4]]");
      expect(isTreeError(output2)).toBeTruthy();

      const output3 = parseLeafTrees("42");
      expect(isTreeError(output3)).toBeTruthy();
    });
  });
}
