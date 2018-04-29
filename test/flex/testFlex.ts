namespace Flexagonator {

  describe('Flex.apply', () => {
    it('should transform a flexagon properly', () => {
      const flexagon = makeFlexagon([1, [2, -3], -4, [-5, 6]]);
      if (isTreeError(flexagon)) {
        fail();
        return;
      }

      const flex = new Flex("test", [1, 2, 3, 4], [-4, 3, 2, -1], FlexRotation.None);
      const result = flex.apply(flexagon);
      if (isFlexError(result)) {
        fail();
        return;
      }
      const expected = [[-6, 5], -4, [2, -3], -1];
      expect(areLTArraysEqual(result.getAsLeafTrees(), expected)).toBeTruthy();
    });
  });

  describe('Flex.createPattern', () => {
    it('should derive a flexagon capable of performing the given flex', () => {
      const flexagon = makeFlexagon([1, [2, -3], -4, [-5, 6]]) as Flexagon;

      const flex = new Flex("test", [[1, 2], [3, [4, 5]], [6, 7], 8], [], FlexRotation.None);
      const result = flex.createPattern(flexagon);
      const expected = [[1, 7], [2, [-3, 8]], [-4, 9], [-5, 6]];
      expect(areLTArraysEqual(result.getAsLeafTrees(), expected)).toBeTruthy();
    });
  });
}
