namespace Flexagonator {

  describe('makeFlexFromSequence', () => {
    const flexes = makeAllFlexes(6);

    it("should create Lh from LtbT'", () => {
      const result = makeFlexFromSequence("Ltb T'", flexes);
      if (isFlexError(result)) {
        fail("failed to make flex");
        return;
      }
      expect(JSON.stringify(result.input)).toBe("[[[1,[7,8]],9],2,3,4,[[5,11],10],6]");
      expect(JSON.stringify(result.output)).toBe("[[[6,-9],-11],1,-8,[-2,7],[[4,-10],-3],5]");
    })
  });

}
