namespace Flexagonator {

  describe('pinch graph', () => {
    it('complains about unknown flexes', () => {
      const result = createRawPinchGraph("P>X");
      expect(isFlexError(result)).toBeTruthy();
      if (isFlexError(result)) {
        expect(result.reason).toBe(FlexCode.UnknownFlex);
        expect(result.flexName).toBe('X');
      }
    });

    it('handles P', () => {
      const result = createRawPinchGraph("P");
      expect(isFlexError(result)).toBeFalsy();
      if (!isFlexError(result)) {
        expect(result.points.length).toBe(2);
        expect(pointsAreEqual(result.points[0], { x: 0, y: 0 })).toBeTruthy();
        expect(pointsAreEqual(result.points[1], { x: 1, y: 0 })).toBeTruthy();
      }
    })

    it('handles pinching in a line', () => {
      const result = createRawPinchGraph("PP>>>>P");
      expect(isFlexError(result)).toBeFalsy();
      if (!isFlexError(result)) {
        expect(result.points.length).toBe(4);
        expect(pointsAreEqual(result.points[0], { x: 0, y: 0 })).toBeTruthy();
        expect(pointsAreEqual(result.points[1], { x: 1, y: 0 })).toBeTruthy();
        expect(pointsAreEqual(result.points[2], { x: 2, y: 0 })).toBeTruthy();
        expect(pointsAreEqual(result.points[3], { x: 3, y: 0 })).toBeTruthy();
      }
    })

    it('handles pinching in a counterclockwise cycle', () => {
      const result = createRawPinchGraph("P>P<P>>>><P");
      expect(isFlexError(result)).toBeFalsy();
      if (!isFlexError(result)) {
        expect(result.points.length).toBe(5);
        expect(pointsAreEqual(result.points[0], { x: 0, y: 0 })).toBeTruthy();
        expect(pointsAreEqual(result.points[1], { x: 1, y: 0 })).toBeTruthy();
        expect(pointsAreEqual(result.points[2], { x: 0, y: 1 })).toBeTruthy();
        expect(pointsAreEqual(result.points[3], { x: 0, y: 0 })).toBeTruthy();
        expect(pointsAreEqual(result.points[4], { x: 1, y: 0 })).toBeTruthy();
      }
    })

    it('handles pinching in a clockwise cycle', () => {
      const result = createRawPinchGraph("PP>P>P>P");
      expect(isFlexError(result)).toBeFalsy();
      if (!isFlexError(result)) {
        expect(result.points.length).toBe(6);
        expect(pointsAreEqual(result.points[0], { x: 0, y: 0 })).toBeTruthy();
        expect(pointsAreEqual(result.points[1], { x: 1, y: 0 })).toBeTruthy();
        expect(pointsAreEqual(result.points[2], { x: 2, y: 0 })).toBeTruthy();
        expect(pointsAreEqual(result.points[3], { x: 2, y: -1 })).toBeTruthy();
        expect(pointsAreEqual(result.points[4], { x: 1, y: 0 })).toBeTruthy();
        expect(pointsAreEqual(result.points[5], { x: 2, y: 0 })).toBeTruthy();
      }
    })
  });

}
