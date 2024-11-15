namespace Flexagonator {

  describe('BestBoxInBox', () => {
    it('should find the best aspect ratio that fits in a box', () => {
      const best = new BestBoxInBox({ x: 5, y: 4 });
      // first is always best
      expect(best.isBest({ x: 0, y: 0 }, { x: 5, y: 2 })).toBeTrue();
      // fills more space
      expect(best.isBest({ x: 0, y: 0 }, { x: 5, y: 3 })).toBeTrue();
      // not better [5,2]
      expect(best.isBest({ x: -1, y: -1 }, { x: 4, y: 1 })).toBeFalse();
      // fills more space
      expect(best.isBest({ x: 0, y: 0 }, { x: 4, y: 4 })).toBeTrue();
      // not better
      expect(best.isBest({ x: 0, y: 0 }, { x: 4, y: 7 })).toBeFalse();
      expect(best.isBest({ x: -1, y: -1 }, { x: 4, y: 1 })).toBeFalse();
      // fills more space
      expect(best.isBest({ x: -1, y: -1 }, { x: 3.5, y: 3 })).toBeTrue();
    });
  });

}
