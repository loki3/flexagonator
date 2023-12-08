namespace Flexagonator {

  describe('Creator', () => {
    it('reports the current name', () => {
      const creator = new Creator([]);
      creator.setNamePieces({ overallShape: 'kite', leafShape: 'bronze', patsPrefix: 8 });
      const name = creator.getName();
      expect(name).toBe('kite bronze octaflexagon');
    });

    it('keeps current flexagon if name is incomplete', () => {
      const creator = new Creator([]);
      const result = creator.setNamePieces({ overallShape: 'kite', leafShape: 'bronze', patsPrefix: 8 });
      expect(result).toBe(true);
      const result2 = creator.setNamePieces({ overallShape: 'pentagonal' });
      expect(result2).toBe(false);
      const name = creator.getName();
      expect(name).toBe('kite bronze octaflexagon');
    });

    it('uses a generating sequence and can apply flexes', () => {
      const creator = new Creator([]);
      creator.setNamePieces({ patsPrefix: 9 });
      const result = creator.createFromSequence("S+");
      expect(result).toBe(true);

      creator.runScriptItem({ flexes: "S" });
      expect(creator.getFlexagonManager().getTotalStates()).toBe(2);

      const name = creator.getName();
      expect(name).toBe('enneaflexagon (generator: S+)');
    });

    it('uses pats', () => {
      const creator = new Creator([]);
      creator.setNamePieces({ patsPrefix: 4 });
      const result = creator.createFromPats("[0,0,0,[0,0]]");
      expect(result).toBe(true);

      const name = creator.getName();
      expect(name).toBe('tetraflexagon (pats: [0,0,0,[0,0]])');
    });

    it('complains about bad pats', () => {
      const creator = new Creator([]);
      creator.setNamePieces({ patsPrefix: 9 });
      const result = creator.createFromPats('invalid') as TreeError;
      expect(result.reason).toBe('expected array');
    });
  });

}
