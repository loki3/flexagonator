namespace Flexagonator {

  describe('addAndConsolidate', () => {
    it('should consolidate unneeded rotates', () => {
      const old = ["Sh", ">", ">", ">"];
      const more = ["<", "<", "P", "<"];
      const actual = addAndConsolidate(old, more);
      expect(actual.length).toBe(4);
      expect(actual[0]).toBe("Sh");
      expect(actual[1]).toBe(">");
      expect(actual[2]).toBe("P");
      expect(actual[3]).toBe("<");
    });
  });

}
