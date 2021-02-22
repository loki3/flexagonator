namespace Flexagonator {

  describe('findEqualFlexes', () => {
    const flexes = makeAllFlexes(6);

    it('should find that P is prime', () => {
      const result = findEqualFlexes(flexes["P"], flexes);
      expect(result).toBe(false);
    })

    it('should find that Lh is not prime', () => {
      const result = findEqualFlexes(flexes["Lh"], flexes);
      expect(result).toBe("Ltb T'");
    })
  });

}
