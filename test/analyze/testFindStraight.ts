namespace Flexagonator {

  describe('findStraight', () => {
    it('finds straight regular hexaflexagons', () => {
      const dirs = Directions.make("//////");
      const results = findStraight(dirs);
      expect(results.length).toBe(2);

      const a = [1, 2, 1, 2, 1, 2];
      const b = [2, 1, 2, 1, 2, 1];
      expect(a.every((v, i) => v === results[0][i])).toBeTrue();
      expect(b.every((v, i) => v === results[1][i])).toBeTrue();
    });

    it('finds straight hexagonal regular decaflexagons', () => {
      const dirs = Directions.make("//|////|//");
      const results = findStraight(dirs);
      expect(results.length).toBe(2);

      const a = [1, 2, 2, 2, 1, 2, 1, 1, 1, 2];
      const b = [2, 1, 1, 1, 2, 1, 2, 2, 2, 1];
      expect(a.every((v, i) => v === results[0][i])).toBeTrue();
      expect(b.every((v, i) => v === results[1][i])).toBeTrue();
    });

    /* turn off since it tests 2^18 possibilities
    it('finds straight hexagonal ring regular octadecaflexagons', () => {
      const dirs = Directions.make("/|//|//|//|//|//|/");
      const results = findStraight(dirs);
      expect(results.length).toBe(2);

      const a = [1, 1, 1, 2, 2, 2, 1, 1, 1, 2, 2, 2, 1, 1, 1, 2, 2, 2];
      const b = [2, 2, 2, 1, 1, 1, 2, 2, 2, 1, 1, 1, 2, 2, 2, 1, 1, 1];
      expect(a.every((v, i) => v === results[0][i])).toBeTrue();
      expect(b.every((v, i) => v === results[1][i])).toBeTrue();
    });
    */
  });

}
