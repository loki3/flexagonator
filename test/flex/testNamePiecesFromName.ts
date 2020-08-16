namespace Flexagonator {

  describe('namePiecesToScript', () => {

    function compare(p1: NamePieces, p2: NamePieces): boolean {
      if (p1.overallShape !== p2.overallShape) { return false; }
      if (p1.leafShape !== p2.leafShape) { return false; }
      if (p1.faceCount !== p2.faceCount) { return false; }
      if (p1.patsPrefix !== p2.patsPrefix) { return false; }
      if (p1.leaves !== p2.leaves) { return false; }
      if (p1.generator !== p2.generator) { return false; }
      if (p1.pats !== p2.pats) { return false; }
      return true;
    }

    it('should find faceCount', () => {
      const pieces = namePiecesFromName('penta-flexagon');
      expect(compare(pieces, { faceCount: 'penta' })).toBeTruthy();
    });

    it('should find patsPrefix', () => {
      const pieces = namePiecesFromName('hexaflexagon');
      expect(compare(pieces, { patsPrefix: 'hexa' })).toBeTruthy();
    });

    it('should find both faceCount & patsPrefix', () => {
      const pieces = namePiecesFromName('penta-hexaflexagon');
      expect(compare(pieces, { faceCount: 'penta', patsPrefix: 'hexa' })).toBeTruthy();
    });

    it('should find overallShape', () => {
      const pieces = namePiecesFromName('heptagonal flexagon');
      expect(compare(pieces, { overallShape: 'heptagonal' })).toBeTruthy();
    });

    it('should find leafShape', () => {
      const pieces = namePiecesFromName('bronze flexagon');
      expect(compare(pieces, { leafShape: 'bronze' })).toBeTruthy();

      const pieces2 = namePiecesFromName('bronze triangle flexagon');
      expect(compare(pieces2, { leafShape: 'bronze triangle' })).toBeTruthy();
    });

    it('should find both overallShape & leafShape', () => {
      const pieces = namePiecesFromName('triangular bronze flexagon');
      expect(compare(pieces, { overallShape: 'triangular', leafShape: 'bronze' })).toBeTruthy();

      const pieces2 = namePiecesFromName('hexagonal ring bronze triangle flexagon');
      expect(compare(pieces2, { overallShape: 'hexagonal ring', leafShape: 'bronze triangle' })).toBeTruthy();
    });

  });

}
