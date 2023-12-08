namespace Flexagonator {

  describe('namePiecesToName', () => {
    it('uses overallShape', () => {
      const name = namePiecesToName({ overallShape: 'pentagonal' });
      expect(name).toBe('pentagonal flexagon');
    });

    it('uses leafShape', () => {
      const name = namePiecesToName({ leafShape: 'pentagon' });
      expect(name).toBe('pentagon flexagon');
    });

    it('uses faceCount', () => {
      const name = namePiecesToName({ faceCount: 'penta' });
      expect(name).toBe('penta-flexagon');
    });

    it('uses greek patsPrefix', () => {
      const name = namePiecesToName({ patsPrefix: 'penta' });
      expect(name).toBe('pentaflexagon');
    });

    it('uses number patsPrefix', () => {
      const name = namePiecesToName({ patsPrefix: 5 });
      expect(name).toBe('pentaflexagon');
    });

    it('uses multiple pieces', () => {
      const name = namePiecesToName({ overallShape: 'pentagonal', leafShape: 'pentagon', faceCount: 'penta', patsPrefix: 5 });
      expect(name).toBe('pentagonal pentagon penta-pentaflexagon');
    });
  });
}
