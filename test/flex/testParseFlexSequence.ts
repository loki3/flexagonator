namespace Flexagonator {

  describe('parseFlexSequence', () => {
    it('deals with space-delimited flexes', () => {
      const names = parseFlexSequence("Lt* > ^ Sh'+ P");
      expect(names.length).toBe(5);
      expect(names[0].fullName).toBe("Lt*");
      expect(names[1].fullName).toBe(">");
      expect(names[2].fullName).toBe("^");
      expect(names[3].fullName).toBe("Sh'+");
      expect(names[4].fullName).toBe("P");
    });
    it('deals with flexes without spaces', () => {
      const names = parseFlexSequence("Lt*>^Sh'+P");
      expect(names.length).toBe(5);
      expect(names[0].fullName).toBe("Lt*");
      expect(names[1].fullName).toBe(">");
      expect(names[2].fullName).toBe("^");
      expect(names[3].fullName).toBe("Sh'+");
      expect(names[4].fullName).toBe("P");
    });
  });

}
