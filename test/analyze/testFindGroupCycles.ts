namespace Flexagonator {

  describe('findGroupCycles', () => {
    const allFlexes6 = makeAllFlexes(6);
    // the 5 states of a tetra-hexaflexagon you can reach with P, where all have same structure except 3
    const states4_6 = [
      Flexagon.makeFromTree([[[1, 10], 7], 2, [[3, 11], 8], 4, [[5, 12], 9], 6]) as Flexagon,
      Flexagon.makeFromTree([[[-11, -3], 4], 8, [[-10, -1], 2], 7, [[-12, -5], 6], 9]) as Flexagon,
      Flexagon.makeFromTree([[[7, -6], 1], -12, [[9, -4], 5], -11, [[8, -2], 3], -10]) as Flexagon,
      Flexagon.makeFromTree([[-10, -1], [8, -2], [-11, -3], [9, -4], [-12, -5], [7, -6]]) as Flexagon,
      Flexagon.makeFromTree([[[4, -9], -11], 5, [[6, -7], -12], 1, [[2, -8], -10], 3]) as Flexagon,
    ];

    function findGroupCycles(
      states: Flexagon[], start: number, flexes: Flexes
    ): CycleInfo[] | GroupCycleError {
      const finder = new FindGroupCycles(states, start, flexes);
      while (finder.checkNext()) { }
      const error = finder.getError();
      return error !== null ? error : finder.getCycles();
    }


    it('finds cycles within the states that have the same pat structure', () => {
      const flexes: Flexes = { P: allFlexes6['P'], '>': allFlexes6['>'], '^': allFlexes6['^'] };
      const result = findGroupCycles(states4_6, 2, flexes);
      if (isGroupCycleError(result)) {
        fail('failed to find group');
        return;
      }

      expect(result.length).toBe(3);
      expect(result[0].sequence).toBe("P P ^");    // 2 -> 0
      expect(result[0].cycleLength).toBe(2);
      expect(result[1].sequence).toBe("P ^>P ^");  // 2 -> 1
      expect(result[1].cycleLength).toBe(6);       // 6 because reference hinge rotates
      expect(result[2].sequence).toBe("^>P >");    // 2 -> 4
      expect(result[2].cycleLength).toBe(2);
    });

    it('reports if no other states share starting pat structure', () => {
      const flexes: Flexes = { P: allFlexes6['P'], '>': allFlexes6['>'], '^': allFlexes6['^'] };
      const result = findGroupCycles(states4_6, 3, flexes);
      if (!isGroupCycleError(result)) {
        fail('failed to return error');
        return;
      }
      const expected: GroupCycleError = { groupCycleError: 'no other states with same pat structure' };
      expect(result.groupCycleError).toBe(expected.groupCycleError);
    });

    it('complains if no shift flexes passed in', () => {
      const flexes: Flexes = { P: allFlexes6['P'], S: allFlexes6['S'] };
      const result = findGroupCycles(states4_6, 2, flexes);
      if (!isGroupCycleError(result)) {
        fail('failed to return error');
        return;
      }
      const expected: GroupCycleError = { groupCycleError: 'need definitions for > and ^' };
      expect(result.groupCycleError).toBe(expected.groupCycleError);
    });

    it('complains about invalid start', () => {
      const flexes: Flexes = { P: allFlexes6['P'], '>': allFlexes6['>'], '^': allFlexes6['^'] };
      const result = findGroupCycles(states4_6, 10, flexes);
      if (!isGroupCycleError(result)) {
        fail('failed to return error');
        return;
      }
      const expected: GroupCycleError = { groupCycleError: "invalid start" };
      expect(result.groupCycleError).toBe(expected.groupCycleError);
    });
  });
}
