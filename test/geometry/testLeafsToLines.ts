namespace Flexagonator {

  function toLeafs(isClocks: boolean[]): Leaf[] {
    var leafs: Leaf[] = [];
    for (var isClock of isClocks) {
      leafs.push({ id: 1, top: 1, bottom: 1, isClock: isClock });
    }
    return leafs;
  }

  describe('leafsToLines', () => {
    it('should convert an array of leafs to geometry to draw', () => {
      const leafs: Leaf[] = toLeafs([true, false, true]);
      const angle1 = 30 * Math.PI / 180;
      const angle2 = 60 * Math.PI / 180;
      const lines: LeafLines = leafsToLines(leafs, angle1, angle2);

      expect(lines.faces.length).toBe(3);
      expect(lines.folds.length).toBe(4);
      expect(lines.cuts.length).toBe(3);
    });
  });

}
