namespace Flexagonator {

  describe('Tracker', () => {
    it('should track flexagons seen before', () => {
      // add first flexagon
      const flexagon = Flexagon.makeFromTree([[1, 2], 3, [4, 5], 6]) as Flexagon;
      const tracker = Tracker.New(flexagon);
      expect(tracker.getTotalStates()).toBe(1);

      // add same one again
      expect(tracker.findMaybeAdd(flexagon)).toBe(0);
      expect(tracker.getTotalStates()).toBe(1);

      // add new flexagon
      const flexagon2 = Flexagon.makeFromTree([1, [2, 3], 4, [5, 6]]) as Flexagon;
      expect(tracker.findMaybeAdd(flexagon2)).toBe(null);
      expect(tracker.getTotalStates()).toBe(2);

      // add same ones again
      expect(tracker.findMaybeAdd(flexagon)).toBe(0);
      expect(tracker.getTotalStates()).toBe(2);
      expect(tracker.findMaybeAdd(flexagon2)).toBe(1);
      expect(tracker.getTotalStates()).toBe(2);
    });
  });


  describe('Tracker', () => {
    it('should track flexagons that are rotated & flipped', () => {
      // add first flexagon
      const flexagon = Flexagon.makeFromTree([[1, 2], 3, [4, 5], 6]) as Flexagon;
      const tracker = Tracker.New(flexagon);
      expect(tracker.findMaybeAdd(flexagon)).toBe(0);
      expect(tracker.getTotalStates()).toBe(1);

      // add rotated version
      const rotated = Flexagon.makeFromTree([[4, 5], 6, [1, 2], 3]) as Flexagon;
      expect(tracker.findMaybeAdd(rotated)).toBe(0);
      expect(tracker.getTotalStates()).toBe(1);

      // add flipped & rotated version
      const flipped = Flexagon.makeFromTree([-3, [-2, -1], -6, [-5, -4]]) as Flexagon;
      expect(tracker.findMaybeAdd(flipped)).toBe(0);
      expect(tracker.getTotalStates()).toBe(1);
    });
  });

  describe('Tracker', () => {
    it("should handle a flexagon that's been turned over", () => {
      // add first flexagon
      const flexagon = Flexagon.makeFromTree([1, 2, 3, 4]) as Flexagon;
      const tracker = Tracker.New(flexagon);
      expect(tracker.findMaybeAdd(flexagon)).toBe(0);
      expect(tracker.getTotalStates()).toBe(1);

      const other = Flexagon.makeFromTree([-1, -4, -3, -2]) as Flexagon;
      expect(tracker.findMaybeAdd(other)).toBe(0);
      expect(tracker.getTotalStates()).toBe(1);
    });
  });

  describe('Tracker', () => {
    it("should examine a flexagon's innards", () => {
      // add first flexagon
      const flexagon = Flexagon.makeFromTree([1, [[2, [3, 4]], 5], 6, 7]) as Flexagon;
      const tracker = Tracker.New(flexagon);
      expect(tracker.findMaybeAdd(flexagon)).toBe(0);
      expect(tracker.getTotalStates()).toBe(1);

      // top & bottom leaves are the same, but the insides are different
      const other = Flexagon.makeFromTree([1, [[2, [4, 3]], 5], 6, 7]) as Flexagon;
      expect(tracker.findMaybeAdd(other)).toBe(null);
      expect(tracker.getTotalStates()).toBe(2);
    });
  });

}
