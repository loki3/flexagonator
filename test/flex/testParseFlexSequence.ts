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
    it('can repeat flexes #1', () => {
      const names = parseFlexSequence("(P* ^ >) x 2");
      expect(names.length).toBe(6);
      expect(names[0].fullName).toBe("P*");
      expect(names[1].fullName).toBe("^");
      expect(names[2].fullName).toBe(">");
      expect(names[3].fullName).toBe("P*");
      expect(names[4].fullName).toBe("^");
      expect(names[5].fullName).toBe(">");
    });
    it('can repeat flexes #2', () => {
      const names = parseFlexSequence("Ab(Cd>)x2Ef");
      expect(names.length).toBe(6);
      expect(names[0].fullName).toBe("Ab");
      expect(names[1].fullName).toBe("Cd");
      expect(names[2].fullName).toBe(">");
      expect(names[3].fullName).toBe("Cd");
      expect(names[4].fullName).toBe(">");
      expect(names[5].fullName).toBe("Ef");
    });
    it('can repeat flexes #3', () => {
      const names = parseFlexSequence("P (P >)2");
      expect(names.length).toBe(5);
      expect(names[0].fullName).toBe("P");
      expect(names[1].fullName).toBe("P");
      expect(names[2].fullName).toBe(">");
      expect(names[3].fullName).toBe("P");
      expect(names[4].fullName).toBe(">");
    });
  });

}
