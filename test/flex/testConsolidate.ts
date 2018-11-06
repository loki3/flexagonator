namespace Flexagonator {

  function makeFlexNames(list: string[]): FlexName[] {
    return list.map(f => makeFlexName(f));
  }

  describe('addAndConsolidate', () => {
    it('should consolidate unneeded rotates', () => {
      const old = makeFlexNames(["Sh", ">", ">", ">"]);
      const more = makeFlexNames(["<", "<", "P", "<"]);
      const actual = addAndConsolidate(old, more);
      expect(actual.length).toBe(4);
      expect(actual[0].fullName).toBe("Sh");
      expect(actual[1].fullName).toBe(">");
      expect(actual[2].fullName).toBe("P");
      expect(actual[3].fullName).toBe("<");
    });
  });

  describe('addAndConsolidate', () => {
    it('should consolidate unneeded ^', () => {
      const old = makeFlexNames(["T", ">", "^"]);
      const more = makeFlexNames(["^", "V", "^"]);
      const actual = addAndConsolidate(old, more);
      expect(actual.length).toBe(4);
      expect(actual[0].fullName).toBe("T");
      expect(actual[1].fullName).toBe(">");
      expect(actual[2].fullName).toBe("V");
      expect(actual[3].fullName).toBe("^");
    });
  });

  describe('addAndConsolidate', () => {
    it('should consolidate unneeded >^>', () => {
      const old = makeFlexNames(["T", ">", "^"]);
      const more = makeFlexNames([">", "F"]);
      const actual = addAndConsolidate(old, more);
      expect(actual.length).toBe(3);
      expect(actual[0].fullName).toBe("T");
      expect(actual[1].fullName).toBe("^");
      expect(actual[2].fullName).toBe("F");
    });
  });

}
