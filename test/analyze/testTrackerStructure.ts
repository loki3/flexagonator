namespace Flexagonator {

  describe('StructureState', () => {
    it('understands equality', () => {
      const base = new StructureState(Flexagon.makeFromTree([1, [2, 3], [[4, 5], 6]]) as Flexagon);
      expect(base.isEqualTo(base)).toBe(true);

      const rotatedYes = new StructureState(Flexagon.makeFromTree([[[4, 5], 6], 1, [2, 3]]) as Flexagon);
      expect(base.isEqualTo(rotatedYes)).toBe(true);
      const rotatedNo = new StructureState(Flexagon.makeFromTree([[6, [4, 5]], 1, [2, 3]]) as Flexagon);
      expect(base.isEqualTo(rotatedNo)).toBe(false);

      const flipYes = new StructureState(Flexagon.makeFromTree([[1, [2, 3]], [4, 5], 6]) as Flexagon);
      expect(base.isEqualTo(flipYes)).toBe(true);
      const flipNo = new StructureState(Flexagon.makeFromTree([[1, 2], [4, 5], 6]) as Flexagon);
      expect(base.isEqualTo(flipNo)).toBe(false);

      const flipRotateYes = new StructureState(Flexagon.makeFromTree([[4, 5], 6, [1, [2, 3]]]) as Flexagon);
      expect(base.isEqualTo(flipRotateYes)).toBe(true);
      const flipRotateNo = new StructureState(Flexagon.makeFromTree([[4, 5], [6, 7], [1, [2, 3]]]) as Flexagon);
      expect(base.isEqualTo(flipRotateNo)).toBe(false);
    });
  });

  describe('TrackerStructure', () => {
    it('tracks structure', () => {
      const tracker = new TrackerStructure();

      expect(tracker.findMaybeAdd(Flexagon.makeFromTree([1, [2, 3], [[4, 5], 6]]) as Flexagon)).toBe(0);
      expect(tracker.findMaybeAdd(Flexagon.makeFromTree([[[4, 5], 6], 1, [2, 3]]) as Flexagon)).toBe(0);
      expect(tracker.findMaybeAdd(Flexagon.makeFromTree([[6, [4, 5]], 1, [2, 3]]) as Flexagon)).toBe(1);
      expect(tracker.findMaybeAdd(Flexagon.makeFromTree([[4, 5], 6, [1, [2, 3]]]) as Flexagon)).toBe(0);
      expect(tracker.findMaybeAdd(Flexagon.makeFromTree([[4, 5], [6, 7], [1, [2, 3]]]) as Flexagon)).toBe(2);

      expect(tracker.getTotalStates()).toBe(3);
    });
  });

}
