namespace Flexagonator {

  describe('checkEqual', () => {
    const all6 = makeAllFlexes(6);
    const hexagon = Flexagon.makeFromTree([1, 2, 3, 4, 5, 6]) as Flexagon;

    it('complains if flexes cant be applied', () => {
      const result1 = checkEqual(hexagon, "P", "S", all6);
      expect(isFlexError(result1));
      const result2 = checkEqual(hexagon, "", "S", all6);
      expect(isFlexError(result2));
    });

    it('reports when flexes are exactly equal', () => {
      const result1 = checkEqual(hexagon, "P*", "P*", all6);
      expect(result1).toBe('exact');
    });
    it('recognizes equality even if sequences created leaves in a different order so the ids may differ', () => {
      const result1 = checkEqual(hexagon, "P*P*", "(Tf*<<)3", all6);
      expect(result1).toBe('exact');
    });

    it('reports when flexes never produce the same result', () => {
      const result1 = checkEqual(hexagon, "P*", "S*", all6);
      expect(result1).toBe('unequal');
    });
    it('recognizes structures match, but hinges are shifted, so results differ', () => {
      const result1 = checkEqual(hexagon, "P*", "P*>>", all6);
      expect(result1).toBe('unequal');
    });

    it('recognizes when one sequence needs to be run first because it needs more structure', () => {
      const result1 = checkEqual(hexagon, "(T*<<)3", "P*P*", all6);
      expect(result1).toBe('aFirst');
      const result2 = checkEqual(hexagon, "P*P*", "(T*<<)3", all6);
      expect(result2).toBe('bFirst');
    });

    it('can tell when the flexes have different requirements but are otherwise equal', () => {
      const result1 = checkEqual(hexagon, "P* S*S'", "P* V*V'", all6);
      expect(result1).toBe('approx');
    });

    it('checks various interesting sequences', () => {
      // PP ≈ (T<<)3
      expect(checkEqual(hexagon, "P*P*", "(Tf*<<)3", all6)).toBe('exact');
      expect(checkEqual(hexagon, "P*P*", "(T*<<)3", all6)).toBe('bFirst');
      expect(checkEqual(hexagon, "P*P*", "^T'* << T'* << ^ T* >>", all6)).toBe('exact');
      // PPP ≈ (S<<)3
      expect(checkEqual(hexagon, "P* ^> P* ^> P* <", "(S*<<)3", all6)).toBe('exact');
    });
  });
}
