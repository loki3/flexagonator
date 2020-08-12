namespace Flexagonator {

  describe('namePiecesToScript', () => {

    function compare(p1: NamePieces, p2: NamePieces): boolean {
      if (p1.overallShape !== p2.overallShape) { return false; }
      if (p1.leafShape !== p2.leafShape) { return false; }
      if (p1.pinchFaces !== p2.pinchFaces) { return false; }
      if (p1.patsPrefix !== p2.patsPrefix) { return false; }
      if (p1.leaves !== p2.leaves) { return false; }
      if (p1.generator !== p2.generator) { return false; }
      if (p1.pats !== p2.pats) { return false; }
      return true;
    }

    it('should find pinchFaces', () => {
      const pieces = namePiecesFromName('penta-flexagon');
      expect(compare(pieces, { pinchFaces: 'penta' })).toBeTruthy();
    });

    it('should find patsPrefix', () => {
      const pieces = namePiecesFromName('hexaflexagon');
      expect(compare(pieces, { patsPrefix: 'hexa' })).toBeTruthy();
    });

    it('should find both pinchFaces & patsPrefix', () => {
      const pieces2 = namePiecesFromName('triangular bronze penta-hexaflexagon');
      expect(compare(pieces2, { pinchFaces: 'penta', patsPrefix: 'hexa' })).toBeTruthy();
    });

  });

}
