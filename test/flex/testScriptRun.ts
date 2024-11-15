namespace Flexagonator {

  describe('runScript.pats', () => {
    it('creates a flexagon manager from the pat structure of a flexagon', () => {
      const empty = Flexagon.makeFromTree([0, 1, 2, 3]) as Flexagon;
      const fm1 = FlexagonManager.make(empty);

      const pats = [1, [2, 3], [4, [5, 6]], 7];
      const fm2 = runScriptItem(fm1, { pats: pats }) as FlexagonManager;
      expect(fm2.flexagon.getAsLeafTrees()).toEqual(pats);
    });
  });

}
