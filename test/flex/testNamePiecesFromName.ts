namespace Flexagonator {

  describe('namePiecesToScript', () => {

    function compare(p1: NamePieces, p2: NamePieces): boolean {
      if (p1.overallShape !== p2.overallShape) { return false; }
      if (p1.leafShape !== p2.leafShape) { return false; }
      if (p1.faceCount !== p2.faceCount) { return false; }
      if (p1.patsPrefix !== p2.patsPrefix) { return false; }
      if (p1.generator !== p2.generator) { return false; }
      if (p1.pats !== p2.pats) { return false; }
      return true;
    }

    it('should find faceCount', () => {
      const pieces = namePiecesFromName('penta-flexagon');
      expect(compare(pieces, { faceCount: 'penta' })).toBeTrue();
    });

    it('should find patsPrefix', () => {
      const pieces = namePiecesFromName('hexaflexagon');
      expect(compare(pieces, { patsPrefix: 'hexa' })).toBeTrue();
    });

    it('should find both faceCount & patsPrefix', () => {
      const pieces = namePiecesFromName('penta-hexaflexagon');
      expect(compare(pieces, { faceCount: 'penta', patsPrefix: 'hexa' })).toBeTrue();
    });

    it('should find overallShape', () => {
      const pieces = namePiecesFromName('heptagonal flexagon');
      expect(compare(pieces, { overallShape: 'heptagonal' })).toBeTrue();
    });

    it('should find leafShape', () => {
      const pieces = namePiecesFromName('bronze flexagon');
      expect(compare(pieces, { leafShape: 'bronze' })).toBeTrue();

      const pieces2 = namePiecesFromName('bronze triangle flexagon');
      expect(compare(pieces2, { leafShape: 'bronze triangle' })).toBeTrue();
    });

    it('should find both overallShape & leafShape', () => {
      const pieces = namePiecesFromName('triangular bronze flexagon');
      expect(compare(pieces, { overallShape: 'triangular', leafShape: 'bronze' })).toBeTrue();

      const pieces2 = namePiecesFromName('hexagonal ring bronze triangle flexagon');
      expect(compare(pieces2, { overallShape: 'hexagonal ring', leafShape: 'bronze triangle' })).toBeTrue();
    });

    it('can adjust for the amibiguity of a square or kite overallShape & leafShape', () => {
      const pieces = namePiecesFromName('square octaflexagon');
      expect(compare(pieces, { overallShape: 'square', patsPrefix: 'octa' })).toBeTrue();

      const pieces2 = namePiecesFromName('kite octaflexagon');
      expect(compare(pieces2, { overallShape: 'kite', patsPrefix: 'octa' })).toBeTrue();
    });

  });

}
