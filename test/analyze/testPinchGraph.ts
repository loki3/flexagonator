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
        expect(result.length).toBe(2);
        expect(pointsAreEqual(result[0], { x: 0, y: 0 })).toBeTruthy();
        expect(pointsAreEqual(result[1], { x: 1, y: 0 })).toBeTruthy();
      }
    })

    it('handles pinching in a line', () => {
      const result = createRawPinchGraph("PP>>>>P");
      expect(isFlexError(result)).toBeFalsy();
      if (!isFlexError(result)) {
        expect(result.length).toBe(4);
        expect(pointsAreEqual(result[0], { x: 0, y: 0 })).toBeTruthy();
        expect(pointsAreEqual(result[1], { x: 1, y: 0 })).toBeTruthy();
        expect(pointsAreEqual(result[2], { x: 2, y: 0 })).toBeTruthy();
        expect(pointsAreEqual(result[3], { x: 3, y: 0 })).toBeTruthy();
      }
    })

    it('handles pinching in a counterclockwise cycle', () => {
      const result = createRawPinchGraph("P>P<P>>>><P");
      expect(isFlexError(result)).toBeFalsy();
      if (!isFlexError(result)) {
        expect(result.length).toBe(5);
        expect(pointsAreEqual(result[0], { x: 0, y: 0 })).toBeTruthy();
        expect(pointsAreEqual(result[1], { x: 1, y: 0 })).toBeTruthy();
        expect(pointsAreEqual(result[2], { x: 0, y: 1 })).toBeTruthy();
        expect(pointsAreEqual(result[3], { x: 0, y: 0 })).toBeTruthy();
        expect(pointsAreEqual(result[4], { x: 1, y: 0 })).toBeTruthy();
      }
    })

    it('handles pinching in a clockwise cycle', () => {
      const result = createRawPinchGraph("PP>P>P>P");
      expect(isFlexError(result)).toBeFalsy();
      if (!isFlexError(result)) {
        expect(result.length).toBe(6);
        expect(pointsAreEqual(result[0], { x: 0, y: 0 })).toBeTruthy();
        expect(pointsAreEqual(result[1], { x: 1, y: 0 })).toBeTruthy();
        expect(pointsAreEqual(result[2], { x: 2, y: 0 })).toBeTruthy();
        expect(pointsAreEqual(result[3], { x: 2, y: -1 })).toBeTruthy();
        expect(pointsAreEqual(result[4], { x: 1, y: 0 })).toBeTruthy();
        expect(pointsAreEqual(result[5], { x: 2, y: 0 })).toBeTruthy();
      }
    })

    it('handles P+', () => {
      const result = createRawPinchGraph("PP+P");
      expect(isFlexError(result)).toBeFalsy();
      if (!isFlexError(result)) {
        expect(result.length).toBe(5);
        expect(pointsAreEqual(result[0], { x: 0, y: 0 })).toBeTruthy();
        expect(pointsAreEqual(result[1], { x: 1, y: 0 })).toBeTruthy();
        expect(pointsAreEqual(result[2], { x: 2, y: 0 })).toBeTruthy();
        expect(pointsAreEqual(result[3], { x: 1, y: 0 })).toBeTruthy();
        expect(pointsAreEqual(result[4], { x: 2, y: 0 })).toBeTruthy();
      }
    })
  });

}
