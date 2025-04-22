namespace Flexagonator {

  function toLeafs(isClocks: boolean[]): Leaf[] {
    const leafs: Leaf[] = [];
    for (let isClock of isClocks) {
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

  describe('getExtents', () => {
    it('properly computes extents', () => {
      const leaf: Leaf = { id: 1, top: 1, bottom: 1, isClock: true };
      const sample: LeafLines = {
        faces: [{ leaf: leaf, corners: [{ x: 1, y: 2 }, { x: 3, y: 4 }] }], // [1,2], [3,4]
        folds: [],
        cuts: [],
      };

      const extents = getExtents(sample);
      expect(extents[0].x).toBe(1);
      expect(extents[0].y).toBe(2);
      expect(extents[1].x).toBe(3);
      expect(extents[1].y).toBe(4);
    });
  });

  describe('rotateLeafLines', () => {
    it('should rotate all pieces of LeafLines', () => {
      const leaf: Leaf = { id: 1, top: 1, bottom: 1, isClock: true };
      const sample: LeafLines = {
        faces: [{ leaf: leaf, corners: [{ x: 1, y: 2 }, { x: 3, y: 4 }] }], // [-2,1], [-4,3]
        folds: [{ a: { x: -1, y: -2 }, b: { x: -2, y: 1 } }], // [2,-1], [-1,-2]
        cuts: [{ a: { x: 1, y: -2 }, b: { x: 2, y: -1 } }]  // [2,1], [1,2]
      };
      const actual = rotateLeafLines(sample, toRadians(90));
      expect(actual.faces.length).toBe(1);
      expect(actual.faces[0].corners[0].x).toBeCloseTo(-2);
      expect(actual.faces[0].corners[0].y).toBeCloseTo(1);
      expect(actual.faces[0].corners[1].x).toBeCloseTo(-4);
      expect(actual.faces[0].corners[1].y).toBeCloseTo(3);
      expect(actual.folds[0].a.x).toBeCloseTo(2);
      expect(actual.cuts[0].b.y).toBeCloseTo(2);
    });
  });

}
