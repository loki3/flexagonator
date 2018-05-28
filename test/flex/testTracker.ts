namespace Flexagonator {

  describe('Tracker', () => {
    it('should track flexagons seen before', () => {
      const tracker = new Tracker();
      expect(tracker.getTotalStates()).toBe(0);

      // add first flexagon
      const flexagon = makeFlexagon([[1, 2], 3, [4, 5], 6]) as Flexagon;
      expect(tracker.findMaybeAdd(flexagon)).toBe(null);
      expect(tracker.getTotalStates()).toBe(1);

      // add same one again
      expect(tracker.findMaybeAdd(flexagon)).toBe(0);
      expect(tracker.getTotalStates()).toBe(1);

      // add new flexagon
      const flexagon2 = makeFlexagon([1, [2, 3], 4, [5, 6]]) as Flexagon;
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
      const tracker = new Tracker();
      expect(tracker.getTotalStates()).toBe(0);

      // add first flexagon
      const flexagon = makeFlexagon([[1, 2], 3, [4, 5], 6]) as Flexagon;
      expect(tracker.findMaybeAdd(flexagon)).toBe(null);
      expect(tracker.getTotalStates()).toBe(1);

      // add rotated version
      const rotated = makeFlexagon([[4, 5], 6, [1, 2], 3]) as Flexagon;
      expect(tracker.findMaybeAdd(rotated)).toBe(0);
      expect(tracker.getTotalStates()).toBe(1);

      // add flipped & rotated version
      const flipped = makeFlexagon([-3, [-2, -1], -6, [-5, -4]]) as Flexagon;
      expect(tracker.findMaybeAdd(flipped)).toBe(0);
      expect(tracker.getTotalStates()).toBe(1);
    });
  });

}
