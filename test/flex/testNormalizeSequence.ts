namespace Flexagonator {


  describe('normalizeSequence', () => {
    it('simplifies shifts based on number of pats', () => {
      const result = normalizeSequence("S>>>>T>>", 6);
      expect(result).toBe('S <<T >>');
    });

    it('simplifies various combos of rotates', () => {
      const result = normalizeSequence("S>^<~^>>~>~Ltb'>", 6);
      expect(result).toBe("S <~Ltb' >");
    });
  });


  describe('sequenceToString', () => {
    function makeFlexNames(list: string[]): FlexName[] {
      return list.map(f => makeFlexName(f));
    }

    it('adds standard spacing', () => {
      const flexes = makeFlexNames(["S", ">", ">", "~", "T'", "<", "^", "~"])
      const result = sequenceToString(flexes);
      expect(result).toBe("S >>~T' <^~");
    });
  });
}
