namespace Flexagonator {

  describe('findTuckermanTraverse', () => {
    const flexes = makeAllFlexes(6);
    const pinch = flexes['P'];
    const right = flexes['>'];

    it('finds the simple cycle for the trihexa', () => {
      const trihexa = Flexagon.makeFromTree([[1, 2], 3, [4, 5], 6, [7, 8], 9]) as Flexagon;
      const result = findTuckermanTraverse3(trihexa, pinch, right);
      expect(result).toBe('P>P>P');
    })

    it('finds the cycle for the straight hexahexa', () => {
      const hexahexa = Flexagon.makeFromTree([[[1, 2], [3, 4]], [5, 6], [[7, 8], [9, 10]], [11, 12], [[13, 14], [15, 16]], [17, 18]]) as Flexagon;
      const result = findTuckermanTraverse3(hexahexa, pinch, right);
      expect(result).toBe('PP>P>PPP>P>PPP>P>P');
    })
  });

}
