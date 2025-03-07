namespace Flexagonator {

  describe('makeFlex', () => {
    it('validates lengths', () => {
      const error1 = makeFlex('test', [1, 2], [3, 2, 1], FlexRotation.None);
      if (!isFlexError(error1)) {
        fail();
      } else {
        expect(error1.reason).toBe(FlexCode.SizeMismatch);
      }

      const error2 = makeFlex('test', [1, 2, 3], [3, 2], FlexRotation.None);
      if (!isFlexError(error2)) {
        fail();
      } else {
        expect(error2.reason).toBe(FlexCode.SizeMismatch);
      }

      const error3 = makeFlex('test', [1, 2, 3], [3, 2, 1], FlexRotation.None, "//");
      if (!isFlexError(error3)) {
        fail();
      } else {
        expect(error3.reason).toBe(FlexCode.SizeMismatch);
      }
    });

    it('validates directions', () => {
      const error1 = makeFlex('test', [1, 2, 3], [3, 2, 1], FlexRotation.None, "QQQ");
      if (!isFlexError(error1)) {
        fail();
      } else {
        expect(error1.reason).toBe(FlexCode.BadDirections);
      }
    });
  });

  describe('Flex.createInverse', () => {
    it('swaps inputs and outputs', () => {
      const flex = makeFlex('test', [1, 2, 3], [3, 2, 1], FlexRotation.None, "//|", "/|/") as Flex;
      const inverse = flex.createInverse();
      expect(inverse.input).toEqual([3, 2, 1]);
      expect(inverse.output).toEqual([1, 2, 3]);
      expect(inverse.inputDirs ? inverse.inputDirs.asString(true) : '').toBe("/|/");
      expect(inverse.outputDirs ? inverse.outputDirs.asString(true) : '').toBe("//|");
    });

    it('inverts rotation', () => {
      const flex1 = makeFlex('test', [1, 2, 3], [3, 2, 1], FlexRotation.None) as Flex;
      const inverse1 = flex1.createInverse();
      expect(inverse1.rotation).toBe(FlexRotation.None);

      // A -> B, B -> C, C -> A (CAB) inverts to A -> C, B -> A, C -> B (BCA)
      const flex2 = makeFlex('test', [1, 2, 3], [3, 2, 1], FlexRotation.CAB) as Flex;
      const inverse2 = flex2.createInverse();
      expect(inverse2.rotation).toBe(FlexRotation.BCA);

      const flex3 = makeFlex('test', [1, 2, 3], [3, 2, 1], FlexRotation.Right) as Flex;
      const inverse3 = flex3.createInverse();
      expect(inverse3.rotation).toBe(FlexRotation.Left);
    });

    it('inverts changed directions', () => {
      // rotate directions
      const flex1 = makeFlex('test', [1, 2, 3], [3, 2, 1], FlexRotation.None, undefined, undefined, [3, 1, 2]) as Flex;
      const inverse1 = flex1.createInverse();
      expect(inverse1.orderOfDirs ? inverse1.orderOfDirs : []).toEqual([2, 3, 1]);

      // swap directions
      const flex2 = makeFlex('test', [1, 2, 3], [3, 2, 1], FlexRotation.None, undefined, undefined, [-1, -2, -3]) as Flex;
      const inverse2 = flex2.createInverse();
      expect(inverse2.orderOfDirs ? inverse2.orderOfDirs : []).toEqual([-1, -2, -3]);
    });
  });

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
      expect(result.getAsLeafTrees()).toEqual(expected);
      expect(result.directions === undefined).toBe(true); // doesn't add unneeded directions
    });
  });

  describe('Flex.apply/rotate', () => {
    const pinch = new Flex("P",
      [[1, 2], 3, [4, 5], 6, [7, 8], 9],
      [-1, [5, -3], -4, [8, -6], -7, [2, -9]], FlexRotation.BAC);
    const v = new Flex("V",
      [1, [2, 3], [4, 5], 6, 7, [8, 9]],
      [[3, -1], -2, -5, [-6, 4], [9, -7], -8], FlexRotation.CBA);

    it('should rotate & mirror vertices', () => {
      // ((7,8)^5) (^6) ((11,12)^9) (^10) ((3,4)^1) (^2)
      const flexagon = Flexagon.makeFromTree([[[7, 8], -5], -6, [[11, 12], -9], -10, [[3, 4], -1], -2]) as Flexagon;
      expect(flexagon.angleTracker.corners[0]).toBe(0);
      expect(flexagon.angleTracker.oldCorner).toBe(0);
      expect(flexagon.angleTracker.oldIsMirrored).toBe(false);

      // BAC
      const result1 = pinch.apply(flexagon) as Flexagon;
      // (^8,^7) (^9,6) (^12,^11) (^1,10) (^4,^3) (^5,2)
      expect(result1.angleTracker.corners[0]).toBe(1);
      expect(result1.angleTracker.oldCorner).toBe(2);
      expect(result1.angleTracker.oldIsMirrored).toBe(true);

      // CBA
      const result2 = v.apply(result1) as Flexagon;
      // (6(7,8)) (9) (11) ((^10,1)^12) (2(3,4)) (5)
      expect(result2.angleTracker.corners[0]).toBe(2);
      expect(result2.angleTracker.oldCorner).toBe(1);
      expect(result2.angleTracker.oldIsMirrored).toBe(false);

      // ACB
      const right = new Flex(">", [1, 2, 3, 4, 5, 6], [2, 3, 4, 5, 6, 1], FlexRotation.ACB);
      const result3 = right.apply(result2) as Flexagon;
      // (9) (11) ((^10,1)^12) (2(3,4)) (5) (6(7,8))
      expect(result3.angleTracker.corners[0]).toBe(2);
      expect(result3.angleTracker.oldCorner).toBe(1);
      expect(result3.angleTracker.oldIsMirrored).toBe(true);

      // None
      const inversetuck = new Flex("T'",
        [2, 4, 5, [6, 7], 8, [-1, [9, -3]]],
        [[[1, 2], 3], 4, 5, [6, 7], 8, 9], FlexRotation.None);
      const result4 = inversetuck.apply(result3) as Flexagon;
      // ((^6,9)^8) (11) ((^10,1)^12) (2(3,4)) (5) (7)
      expect(result4.angleTracker.corners[0]).toBe(2);
      expect(result4.angleTracker.oldCorner).toBe(1);
      expect(result4.angleTracker.oldIsMirrored).toBe(true);
    });

    it('handles ACB', () => {
      const flexagon = Flexagon.makeFromTree([[[0, 0], [0, 0]], [[0, 0], [0, 0]], [[0, 0], [0, 0]], [[0, 0], [0, 0]], [[0, 0], [0, 0]], [[0, 0], [0, 0]]]) as Flexagon;
      expect(flexagon.angleTracker.corners[0]).toBe(0);
      expect(flexagon.angleTracker.oldCorner).toBe(0);
      expect(flexagon.angleTracker.oldIsMirrored).toBe(false);

      const result1 = pinch.apply(flexagon) as Flexagon;
      expect(result1.angleTracker.corners[0]).toBe(1);
      expect(result1.angleTracker.oldCorner).toBe(2);
      expect(result1.angleTracker.oldIsMirrored).toBe(true);

      const result2 = pinch.apply(result1) as Flexagon;
      expect(result2.angleTracker.corners[0]).toBe(0);
      expect(result2.angleTracker.oldCorner).toBe(0);
      expect(result2.angleTracker.oldIsMirrored).toBe(false);
    });

    it('handles CBA', () => {
      const flexagon = Flexagon.makeFromTree([[[0, 0], [0, 0]], [[0, 0], [0, 0]], [[0, 0], [0, 0]], [[0, 0], [0, 0]], [[0, 0], [0, 0]], [[0, 0], [0, 0]]]) as Flexagon;
      expect(flexagon.angleTracker.corners[0]).toBe(0);
      expect(flexagon.angleTracker.oldCorner).toBe(0);
      expect(flexagon.angleTracker.oldIsMirrored).toBe(false);

      const result1 = v.apply(flexagon) as Flexagon;
      expect(result1.angleTracker.corners[0]).toBe(2);
      expect(result1.angleTracker.oldCorner).toBe(1);
      expect(result1.angleTracker.oldIsMirrored).toBe(true);

      const result2 = v.apply(result1) as Flexagon;
      expect(result2.angleTracker.corners[0]).toBe(0);
      expect(result2.angleTracker.oldCorner).toBe(0);
      expect(result2.angleTracker.oldIsMirrored).toBe(false);
    });
  });

  describe('Flex.apply/directions', () => {
    it('rearranges directions if specified', () => {
      const flexagon = Flexagon.makeFromTree([1, 2, 3], undefined, Directions.make('/||')) as Flexagon;

      const flex = new Flex("test", [1, 2, 3], [2, 3, 1], FlexRotation.None,
        undefined, undefined, [2, 3, 1]);  // the new order for the list of directions
      const result = flex.apply(flexagon) as Flexagon;
      expect(result.getAsLeafTrees()).toEqual([2, 3, 1]);
      const newDirs = result.directions as Directions;
      expect(newDirs.asString(true)).toBe('||/'); // rotated by one
    });

    it('works with input and output directions', () => {
      const flexagon = Flexagon.makeFromTree([1, 2, 3, 4], undefined, Directions.make('/||/')) as Flexagon;

      const flex = new Flex("test", [1, 2, 3, 4], [1, 3, 2, 4], FlexRotation.None,
        DirectionsOpt.make('/||?') as DirectionsOpt, DirectionsOpt.make('?//?') as DirectionsOpt);
      const result = flex.apply(flexagon) as Flexagon;
      expect(result.getAsLeafTrees()).toEqual([1, 3, 2, 4]);
      const newDirs = result.directions as Directions;
      expect(newDirs.asString(true)).toBe('////');  // two directions changed, two stayed the same
    });

    it('supports both changing and rearranging directions', () => {
      const flexagon = Flexagon.makeFromTree([1, 2, 3, 4], undefined, Directions.make('/|//')) as Flexagon;

      const flex = new Flex("test", [1, 2, 3, 4], [1, 3, 2, 4], FlexRotation.None,
        DirectionsOpt.make('/|/?') as DirectionsOpt, DirectionsOpt.make('||/?') as DirectionsOpt,
        [4, 1, 2, 3]);  // rotate directions after changing them
      // /|// => ||// => /||/
      const result = flex.apply(flexagon) as Flexagon;
      expect(result.getAsLeafTrees()).toEqual([1, 3, 2, 4]);
      const newDirs = result.directions as Directions;
      expect(newDirs.asString(true)).toBe('/||/');
    });

    it('adds directions to a flexagon w/out directions if flex changes directions', () => {
      const flexagon = Flexagon.makeFromTree([1, 2, 3, 4]) as Flexagon; // no directions => ////

      const flex = new Flex("test", [1, 2, 3, 4], [1, 3, 2, 4], FlexRotation.None,
        DirectionsOpt.make('////') as DirectionsOpt, DirectionsOpt.make('/||/') as DirectionsOpt);
      const result = flex.apply(flexagon) as Flexagon;
      expect(result.getAsLeafTrees()).toEqual([1, 3, 2, 4]);

      // flexagon now includes directions
      if (result.directions === undefined) {
        fail('flexagon should include directions');
      } else {
        const newDirs = result.directions as Directions;
        expect(newDirs.asString(true)).toBe('/||/');
      }
    });

    it('can flip directions', () => {
      const flexagon = Flexagon.makeFromTree([1, 2, 3], undefined, Directions.make('/||')) as Flexagon;

      const flex = new Flex("~", [1, 2, 3], [2, 3, 1], FlexRotation.None,
        undefined, undefined, [-1, -2, -3]);  // flips directions in same place w/out rearranging
      const result = flex.apply(flexagon) as Flexagon;
      expect(result.getAsLeafTrees()).toEqual([2, 3, 1]);
      const newDirs = result.directions as Directions;
      expect(newDirs.asString(true)).toBe('|//'); // flipped
    });

    it('supports in/out dirs combined with orderDirs flipping only one direction', () => {
      const flexagon = Flexagon.makeFromTree([1, 2, 3], undefined, Directions.make('/||')) as Flexagon;

      const dirs = DirectionsOpt.make("/?|") as DirectionsOpt; // middle direction can be anything
      const flex = new Flex("~", [1, 2, 3], [2, 3, 1], FlexRotation.None,
        dirs, dirs, [1, -2, 3]);  // flips the middle direction
      const result = flex.apply(flexagon) as Flexagon;
      expect(result.getAsLeafTrees()).toEqual([2, 3, 1]);
      const newDirs = result.directions as Directions;
      expect(newDirs.asString(true)).toBe('//|'); // middle is flipped
    });
  });

  describe('Flex.createPattern', () => {
    it('should derive a flexagon capable of performing the given flex', () => {
      const flexagon = Flexagon.makeFromTree([1, [2, -3], -4, [-5, 6]]) as Flexagon;

      const flex = new Flex("test", [[1, 2], [3, [4, 5]], [6, 7], 8], [], FlexRotation.None);
      const [result, splits] = flex.createPattern(flexagon);
      const expected = [[1, 7], [2, [-3, 8]], [-4, 9], [-5, 6]];
      expect(result.getAsLeafTrees()).toEqual(expected);
      expect(splits.length).toBe(3);
    });
  });
}
