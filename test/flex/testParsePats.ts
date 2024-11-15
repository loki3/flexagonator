namespace Flexagonator {

  describe('parsePats', () => {
    it('can parse basic arrays of correct size', () => {
      const rawPats = "[1,[2,3],[4,[5,6]],7]";
      const result = parsePats(rawPats, 4);
      expect(JSON.stringify(result)).toBe(rawPats);
    });

    it('can repeat pattern when too few pats are supplied', () => {
      const rawPats = "[0,[0,0],0]";
      const result = parsePats(rawPats, 8);
      expect(result).toEqual([0, [0, 0], 0, 0, [0, 0], 0, 0, [0, 0]]);
    });

    it('can truncate array when too big', () => {
      const rawPats = "[1,2,3,4,5]";
      const result = parsePats(rawPats, 4);
      expect(result).toEqual([1, 2, 3, 4]);
    });

    it('handles numbers representing pat structure', () => {
      const rawPats = "1,2,21,4";
      const result = parsePats(rawPats, 6);
      expect(result).toEqual([0, [0, 0], [[0, 0], 0], [[0, 0], [0, 0]], 0, [0, 0]]);
    });

    it('complains about unknown formats', () => {
      expect(parsePats("qwert", 6)).toBe(false);
      expect(parsePats("{}", 6)).toBe(false);
    });
  });

}
