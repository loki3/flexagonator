namespace Flexagonator {

  function makeFlexNames(list: string[]): FlexName[] {
    return list.map(f => makeFlexName(f));
  }

  describe('addAndConsolidate', () => {
    it('should consolidate unneeded rotates', () => {
      const old = makeFlexNames(["S", ">", ">", ">"]);
      const more = makeFlexNames(["<", "<", "P", "<"]);
      const actual = addAndConsolidate(old, more, 10);
      expect(actual.length).toBe(4);
      expect(actual[0].fullName).toBe("S");
      expect(actual[1].fullName).toBe(">");
      expect(actual[2].fullName).toBe("P");
      expect(actual[3].fullName).toBe("<");
    });

    it('should consolidate unneeded ^', () => {
      const old = makeFlexNames(["T", ">", "^"]);
      const more = makeFlexNames(["^", "V", "^"]);
      const actual = addAndConsolidate(old, more, 10);
      expect(actual.length).toBe(4);
      expect(actual[0].fullName).toBe("T");
      expect(actual[1].fullName).toBe(">");
      expect(actual[2].fullName).toBe("V");
      expect(actual[3].fullName).toBe("^");
    });

    it('should consolidate unneeded >^>', () => {
      const old = makeFlexNames(["T", ">", "^"]);
      const more = makeFlexNames([">", "F"]);
      const actual = addAndConsolidate(old, more, 10);
      expect(actual.length).toBe(3);
      expect(actual[0].fullName).toBe("T");
      expect(actual[1].fullName).toBe("^");
      expect(actual[2].fullName).toBe("F");
    });

    it('should turn >>>> into < on a penta', () => {
      const old = makeFlexNames(["T", ">", ">"]);
      const more = makeFlexNames([">", ">", "F"]);
      const actual = addAndConsolidate(old, more, 5);
      expect(actual.length).toBe(3);
      expect(actual[0].fullName).toBe("T");
      expect(actual[1].fullName).toBe("<");
      expect(actual[2].fullName).toBe("F");
    });

    it('should turn >>>>>> into > on a penta', () => {
      const old = makeFlexNames(["T", ">", ">", ">", ">"]);
      const more = makeFlexNames([">", ">", "F"]);
      const actual = addAndConsolidate(old, more, 5);
      expect(actual.length).toBe(3);
      expect(actual[0].fullName).toBe("T");
      expect(actual[1].fullName).toBe(">");
      expect(actual[2].fullName).toBe("F");
    });

    it('should deal with a more complex case', () => {
      const old = makeFlexNames(["T", ">", ">", "^", "<", "^"]);
      const more = makeFlexNames([">", "^", "<", "F"]);
      const actual = addAndConsolidate(old, more, 5);
      expect(actual.length).toBe(3);
      expect(actual[0].fullName).toBe("T");
      expect(actual[1].fullName).toBe("^");
      expect(actual[2].fullName).toBe("F");
    });

    it('should handle turning over', () => {
      const old = makeFlexNames(["T", ">"]);
      const more = makeFlexNames(["^"]);
      const actual = addAndConsolidate(old, more, 5);
      expect(actual.length).toBe(3);
      expect(actual[0].fullName).toBe("T");
      expect(actual[1].fullName).toBe(">");
      expect(actual[2].fullName).toBe("^");
    });

    it('should handle simplifying left rotates', () => {
      const old = makeFlexNames(["T", "<", "<", "<", "<"]);
      const more = makeFlexNames(["^"]);
      const actual = addAndConsolidate(old, more, 6);
      expect(actual.length).toBe(4);
      expect(actual[0].fullName).toBe("T");
      expect(actual[1].fullName).toBe(">");
      expect(actual[2].fullName).toBe(">");
      expect(actual[3].fullName).toBe("^");
    });

    it('should handle rotates on just one side', () => {
      const old = makeFlexNames(["T", "<", "<", "<", "<", "<"]);
      const more = makeFlexNames(["F"]);
      const actual = addAndConsolidate(old, more, 6);
      expect(actual.length).toBe(3);
      expect(actual[0].fullName).toBe("T");
      expect(actual[1].fullName).toBe(">");
      expect(actual[2].fullName).toBe("F");
    });
  });

}
