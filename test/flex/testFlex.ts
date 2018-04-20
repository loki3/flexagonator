namespace Flexagonator {

  function areLTArraysEqual(a: LeafTree[], b: LeafTree[]): boolean {
    if (a.length !== b.length) {
      return false;
    }
    for (var i in a) {
      if (!areEqual(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }

  describe('Flex.apply', () => {
    it('should transform a flexagon properly', () => {
      const flexagon = makeFlexagon([1, [2, -3], -4, [-5, 6]]);
      if (isTreeError(flexagon)) {
        fail();
        return;
      }

      const flex = new Flex([1, 2, 3, 4], [-4, 3, 2, -1]);
      const result = flex.apply(flexagon);
      if (isFlexError(result)) {
        fail();
        return;
      }
      const expected = [[-6, 5], -4, [2, -3], -1];
      expect(areLTArraysEqual(result.getAsLeafTrees(), expected)).toBeTruthy();
    });
  });
}
