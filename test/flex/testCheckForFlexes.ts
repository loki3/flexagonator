namespace Flexagonator {

  describe('checkForFlexes', () => {
    it('should find all possible flexes at the current hinge', () => {
      const flexagon = Flexagon.makeFromTree([[1, 2], 3, [4, 5], 6]) as Flexagon;

      const flexes: Flexes = {};
      flexes["A"] = makeFlex("test", [[1, 2], 3, 4, 5], [[1, 2], 3, -4, -5], FlexRotation.None) as Flex;
      flexes["B"] = makeFlex("test", [1, [2, 3], 4, 5], [[1, 2], 3, -4, -5], FlexRotation.None) as Flex;
      flexes["C"] = makeFlex("test", [1, 2, 3, 4], [1, 2, 3, -4], FlexRotation.None) as Flex;

      const results = checkForFlexes(flexagon, flexes);
      expect(results.length).toBe(2);
      expect(results[0]).toBe("A");
      expect(results[1]).toBe("C");
    });

    it('takes into account pat directions', () => {
      const flexagon = Flexagon.makeFromTree([1, 2, 3, 4], undefined, Directions.make("//|/")) as Flexagon;

      const flexes: Flexes = {};
      flexes["A"] = makeFlex("test", [1, 2, 3, 4], [1, 2, 3, 4], FlexRotation.None, "/??/") as Flex;
      flexes["B"] = makeFlex("test", [1, 2, 3, 4], [1, 2, 3, 4], FlexRotation.None, "|/|/") as Flex;
      flexes["C"] = makeFlex("test", [1, 2, 3, 4], [1, 2, 3, 4], FlexRotation.None, "//|/") as Flex;

      const results = checkForFlexes(flexagon, flexes);
      expect(results.length).toBe(2);
      expect(results[0]).toBe("A");
      expect(results[1]).toBe("C");
    });
  });

  describe('checkForPossibleFlexes', () => {
    it('should find all possible flexes at all hinges, ignoring pat structure', () => {
      const flexagon = Flexagon.makeFromTree([1, 2, 3, 4], undefined, Directions.make("|///")) as Flexagon;

      const flexes: Flexes = {};
      flexes["A"] = makeFlex("test", [1, 2, 3, [4, 5]], [1, 2, 3, [4, 5]], FlexRotation.None, "/??/") as Flex;
      flexes["B"] = makeFlex("test", [1, 2, 3, [4, 5]], [1, 2, 3, [4, 5]], FlexRotation.None, "|/|/") as Flex;
      flexes["C"] = makeFlex("test", [1, 2, 3, [4, 5]], [1, 2, 3, [4, 5]], FlexRotation.None, "//|/") as Flex;
      const shiftFlexes: Flexes = {};
      shiftFlexes[">"] = makeFlex("shift right", [1, 2, 3, 4], [2, 3, 4, 1], FlexRotation.Right, undefined, undefined, [2, 3, 4, 1]) as Flex;
      shiftFlexes["^"] = makeFlex("turn over", [1, 2, 3, 4], [-4, -3, -2, -1], FlexRotation.None, undefined, undefined, [4, 3, 2, 1]) as Flex;

      const results = checkForPossibleFlexes(flexagon, shiftFlexes, flexes);
      expect(results.length).toBe(2);
      expect(results[0]).toBe("A");
      expect(results[1]).toBe("C");
    });
  });

}
