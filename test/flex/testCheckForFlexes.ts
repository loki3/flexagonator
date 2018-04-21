namespace Flexagonator {

  describe('checkForFlexes', () => {
    it('should find all possible flexes at the current vertex', () => {
      const flexagon = makeFlexagon([[1, 2], 3, [4, 5], 6]) as Flexagon;

      var flexes: Flexes = {};
      flexes["A"] = makeFlex("test", [[1, 2], 3, 4, 5], [[1, 2], 3, -4, -5]) as Flex;
      flexes["B"] = makeFlex("test", [1, [2, 3], 4, 5], [[1, 2], 3, -4, -5]) as Flex;
      flexes["C"] = makeFlex("test", [1, 2, 3, 4], [1, 2, 3, -4]) as Flex;

      const results = checkForFlexes(flexagon, flexes);
      expect(results.length).toBe(2);
      expect(results[0]).toBe("A");
      expect(results[1]).toBe("C");
    });
  });

}
