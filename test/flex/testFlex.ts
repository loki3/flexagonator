namespace Flexagonator {

  describe('Flex.apply', () => {
    it('should transform a flexagon properly', () => {
      const flexagon = Flexagon.makeFromTree([1, [2, -3], -4, [-5, 6]]);
      if (isTreeError(flexagon)) {
        fail();
        return;
      }

      const flex = new Flex("test", [1, 2, 3, 4], [-4, 3, 2, -1], FlexRotation.None);
      const result = flex.apply(flexagon);
      if (isFlexError(result)) {
        fail();
        return;
      }
      const expected = [[-6, 5], -4, [2, -3], -1];
      expect(areLTArraysEqual(result.getAsLeafTrees(), expected)).toBeTruthy();
    });
  });

  describe('Flex.apply/rotate', () => {
    const pinch = new Flex("P",
      [[1, 2], 3, [4, 5], 6, [7, 8], 9],
      [-1, [5, -3], -4, [8, -6], -7, [2, -9]], FlexRotation.CounterMirror);
    const v = new Flex("V",
      [1, [2, 3], [4, 5], 6, 7, [8, 9]],
      [[3, -1], -2, -5, [-6, 4], [9, -7], -8], FlexRotation.ClockMirror);

    it('should rotate & mirror vertices', () => {
      // ((7,8)^5) (^6) ((11,12)^9) (^10) ((3,4)^1) (^2)
      const flexagon = Flexagon.makeFromTree([[[7, 8], -5], -6, [[11, 12], -9], -10, [[3, 4], -1], -2]) as Flexagon;
      expect(flexagon.angleTracker.whichCorner).toBe(0);
      expect(flexagon.angleTracker.oldCorner).toBe(0);
      expect(flexagon.angleTracker.isMirrored).toBe(false);

      // CounterMirror
      const result1 = pinch.apply(flexagon) as Flexagon;
      // (^8,^7) (^9,6) (^12,^11) (^1,10) (^4,^3) (^5,2)
      expect(result1.angleTracker.whichCorner).toBe(1);
      expect(result1.angleTracker.oldCorner).toBe(2);
      expect(result1.angleTracker.isMirrored).toBe(true);

      // ClockMirror
      const result2 = v.apply(result1) as Flexagon;
      // (6(7,8)) (9) (11) ((^10,1)^12) (2(3,4)) (5)
      expect(result2.angleTracker.whichCorner).toBe(2);
      expect(result2.angleTracker.oldCorner).toBe(1);
      expect(result2.angleTracker.isMirrored).toBe(false);

      // Mirror
      const right = new Flex(">", [1, 2, 3, 4, 5, 6], [2, 3, 4, 5, 6, 1], FlexRotation.Mirror);
      const result3 = right.apply(result2) as Flexagon;
      // (9) (11) ((^10,1)^12) (2(3,4)) (5) (6(7,8))
      expect(result3.angleTracker.whichCorner).toBe(2);
      expect(result3.angleTracker.oldCorner).toBe(1);
      expect(result3.angleTracker.isMirrored).toBe(true);

      // None
      const inversetuck = new Flex("T'",
        [2, 4, 5, [6, 7], 8, [-1, [9, -3]]],
        [[[1, 2], 3], 4, 5, [6, 7], 8, 9], FlexRotation.None);
      const result4 = inversetuck.apply(result3) as Flexagon;
      // ((^6,9)^8) (11) ((^10,1)^12) (2(3,4)) (5) (7)
      expect(result4.angleTracker.whichCorner).toBe(2);
      expect(result4.angleTracker.oldCorner).toBe(1);
      expect(result4.angleTracker.isMirrored).toBe(true);
    });

    it('handles counter-mirror', () => {
      const flexagon = Flexagon.makeFromTree([[[0, 0], [0, 0]], [[0, 0], [0, 0]], [[0, 0], [0, 0]], [[0, 0], [0, 0]], [[0, 0], [0, 0]], [[0, 0], [0, 0]]]) as Flexagon;
      expect(flexagon.angleTracker.whichCorner).toBe(0);
      expect(flexagon.angleTracker.oldCorner).toBe(0);
      expect(flexagon.angleTracker.isMirrored).toBe(false);

      const result1 = pinch.apply(flexagon) as Flexagon;
      expect(result1.angleTracker.whichCorner).toBe(1);
      expect(result1.angleTracker.oldCorner).toBe(2);
      expect(result1.angleTracker.isMirrored).toBe(true);

      const result2 = pinch.apply(result1) as Flexagon;
      expect(result2.angleTracker.whichCorner).toBe(0);
      expect(result2.angleTracker.oldCorner).toBe(0);
      expect(result2.angleTracker.isMirrored).toBe(false);
    });

    it('handles clock-mirror', () => {
      const flexagon = Flexagon.makeFromTree([[[0, 0], [0, 0]], [[0, 0], [0, 0]], [[0, 0], [0, 0]], [[0, 0], [0, 0]], [[0, 0], [0, 0]], [[0, 0], [0, 0]]]) as Flexagon;
      expect(flexagon.angleTracker.whichCorner).toBe(0);
      expect(flexagon.angleTracker.oldCorner).toBe(0);
      expect(flexagon.angleTracker.isMirrored).toBe(false);

      const result1 = v.apply(flexagon) as Flexagon;
      expect(result1.angleTracker.whichCorner).toBe(2);
      expect(result1.angleTracker.oldCorner).toBe(1);
      expect(result1.angleTracker.isMirrored).toBe(true);

      const result2 = v.apply(result1) as Flexagon;
      expect(result2.angleTracker.whichCorner).toBe(0);
      expect(result2.angleTracker.oldCorner).toBe(0);
      expect(result2.angleTracker.isMirrored).toBe(false);
    });
  });

  describe('Flex.createPattern', () => {
    it('should derive a flexagon capable of performing the given flex', () => {
      const flexagon = Flexagon.makeFromTree([1, [2, -3], -4, [-5, 6]]) as Flexagon;

      const flex = new Flex("test", [[1, 2], [3, [4, 5]], [6, 7], 8], [], FlexRotation.None);
      const [result, splits] = flex.createPattern(flexagon);
      const expected = [[1, 7], [2, [-3, 8]], [-4, 9], [-5, 6]];
      expect(areLTArraysEqual(result.getAsLeafTrees(), expected)).toBeTruthy();
      expect(splits.length).toBe(3);
    });
  });
}
