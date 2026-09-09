namespace Flexagonator {

  /** create 1 leaf for every isClocks[i], setting ids & labels based on the ordering */
  function toLeafs(isClocks: boolean[]): Leaf[] {
    const leafs: Leaf[] = isClocks.map((isClock, i) => {
      return { id: i + 1, top: i + 1, bottom: -i - 1, isClock };
    });
    return leafs;
  }

  /** compare sets of leaf faces, rounding off coordinates, logging & returning false if it fails */
  function checkLeafFaces(expected: LeafFace[], actual: LeafFace[]): boolean {
    for (let i = 0; i < expected.length; i++) {
      const e = expected[i];
      const a = actual[i];
      const el = JSON.stringify(e.leaf);
      const al = JSON.stringify(a.leaf);
      if (el !== al) {
        console.log(`mismatched leaf in element ${i}:\nexpected ${el}\nactual ${al}`);
        return false;
      }
      const ec = cornersAsString(e.corners);
      const ac = cornersAsString(a.corners);
      if (ec !== ac) {
        console.log(`mismatched corners in element ${i}:\nexpected ${ec}\nactual ${ac}`);
        return false;
      }
    }
    return true;
  }

  /** coordinates rounded to the nearest 0.001 */
  function cornersAsString(p: Point[]) {
    return `{x:${r(p[0].x)}, y:${r(p[0].y)}}, {x:${r(p[1].x)}, y:${r(p[1].y)}}, {x:${r(p[2].x)}, y:${r(p[2].y)}}`;
  }
  function r(n: number): number {
    return Math.round(n * 1000) / 1000;
  }

  describe('leafsToLines', () => {
    it('should convert an array of leafs to geometry to draw', () => {
      const leafs: Leaf[] = toLeafs([true, false, true]);
      const angle1 = Math.PI * 30 / 180;
      const angle2 = Math.PI * 60 / 180;
      const lines: LeafLines = leafsToLines(leafs, angle1, angle2);

      expect(lines.faces.length).toBe(3);
      expect(lines.folds.length).toBe(4);
      expect(lines.cuts.length).toBe(3);
    });

    it('creates the geometry for a bronze tri', () => {
      const leafs: Leaf[] = toLeafs([true, false, true, false, true, false, true, false, true]);
      const angle1 = Math.PI * 30 / 180;
      const angle2 = Math.PI * 60 / 180;
      const lines: LeafLines = leafsToLines(leafs, angle1, angle2);

      const expectedFaces: LeafFace[] = [
        { leaf: { id: 1, top: 1, bottom: -1, isClock: true }, corners: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0.75, y: 0.433 }] },
        { leaf: { id: 2, top: 2, bottom: -2, isClock: false }, corners: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0.75, y: -0.433 }] },
        { leaf: { id: 3, top: 3, bottom: -3, isClock: true }, corners: [{ x: 0, y: 0 }, { x: 0.75, y: -0.433 }, { x: 0.5, y: -0.866 }] },
        { leaf: { id: 4, top: 4, bottom: -4, isClock: false }, corners: [{ x: 0.5, y: -0.866 }, { x: 0.75, y: -0.433 }, { x: 1.5, y: -0.866 }] },
        { leaf: { id: 5, top: 5, bottom: -5, isClock: true }, corners: [{ x: 0.5, y: -0.866 }, { x: 1.5, y: -0.866 }, { x: 0.75, y: -1.299 }] },
        { leaf: { id: 6, top: 6, bottom: -6, isClock: false }, corners: [{ x: 0.75, y: -1.299 }, { x: 1.5, y: -0.866 }, { x: 1, y: -1.732 }] },
        { leaf: { id: 7, top: 7, bottom: -7, isClock: true }, corners: [{ x: 0.75, y: -1.299 }, { x: 1, y: -1.732 }, { x: 0, y: -1.732 }] },
        { leaf: { id: 8, top: 8, bottom: -8, isClock: false }, corners: [{ x: 0, y: -1.732 }, { x: 1, y: -1.732 }, { x: 0.75, y: -2.165 }] },
        { leaf: { id: 9, top: 9, bottom: -9, isClock: true }, corners: [{ x: 0, y: -1.732 }, { x: 0.75, y: -2.165 }, { x: 0.5, y: -2.598 }] },
      ];
      expect(checkLeafFaces(expectedFaces, lines.faces)).toBe(true);
    });

    it('creates the geometry for the hepta (generator: (P^>)5)', () => {
      const leafs: Leaf[] = toLeafs([true, false, true, false, true, true, false, false, true, false, true, false, false, true, true, false, true, false, true, true, false]);
      const angle1 = Math.PI * 60 / 180;
      const angle2 = Math.PI * 30 / 180;
      const lines: LeafLines = leafsToLines(leafs, angle1, angle2);

      const expectedFaces: LeafFace[] = [
        { leaf: { id: 1, top: 1, bottom: -1, isClock: true }, corners: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0.25, y: 0.433 }] },
        { leaf: { id: 2, top: 2, bottom: -2, isClock: false }, corners: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0.25, y: -0.433 }] },
        { leaf: { id: 3, top: 3, bottom: -3, isClock: true }, corners: [{ x: 0, y: 0 }, { x: 0.25, y: -0.433 }, { x: -0.5, y: -0.866 }] },
        { leaf: { id: 4, top: 4, bottom: -4, isClock: false }, corners: [{ x: -0.5, y: -0.866 }, { x: 0.25, y: -0.433 }, { x: 0.5, y: -0.866 }] },
        { leaf: { id: 5, top: 5, bottom: -5, isClock: true }, corners: [{ x: -0.5, y: -0.866 }, { x: 0.5, y: -0.866 }, { x: 0.25, y: -1.299 }] },
        { leaf: { id: 6, top: 6, bottom: -6, isClock: true }, corners: [{ x: 0.25, y: -1.299 }, { x: 0.5, y: -0.866 }, { x: 1, y: -1.732 }] },
        { leaf: { id: 7, top: 7, bottom: -7, isClock: false }, corners: [{ x: 1, y: -1.732 }, { x: 0.5, y: -0.866 }, { x: 1, y: -0.866 }] },
        { leaf: { id: 8, top: 8, bottom: -8, isClock: false }, corners: [{ x: 1, y: -1.732 }, { x: 1, y: -0.866 }, { x: 1.5, y: -0.866 }] },
        { leaf: { id: 9, top: 9, bottom: -9, isClock: true }, corners: [{ x: 1, y: -1.732 }, { x: 1.5, y: -0.866 }, { x: 1.75, y: -1.299 }] },
        { leaf: { id: 10, top: 10, bottom: -10, isClock: false }, corners: [{ x: 1.75, y: -1.299 }, { x: 1.5, y: -0.866 }, { x: 2.5, y: -0.866 }] },
        { leaf: { id: 11, top: 11, bottom: -11, isClock: true }, corners: [{ x: 1.75, y: -1.299 }, { x: 2.5, y: -0.866 }, { x: 2, y: -1.732 }] },
        { leaf: { id: 12, top: 12, bottom: -12, isClock: false }, corners: [{ x: 2, y: -1.732 }, { x: 2.5, y: -0.866 }, { x: 2.5, y: -1.732 }] },
        { leaf: { id: 13, top: 13, bottom: -13, isClock: false }, corners: [{ x: 2, y: -1.732 }, { x: 2.5, y: -1.732 }, { x: 2.5, y: -2.598 }] },
        { leaf: { id: 14, top: 14, bottom: -14, isClock: true }, corners: [{ x: 2, y: -1.732 }, { x: 2.5, y: -2.598 }, { x: 1.75, y: -2.165 }] },
        { leaf: { id: 15, top: 15, bottom: -15, isClock: true }, corners: [{ x: 1.75, y: -2.165 }, { x: 2.5, y: -2.598 }, { x: 1.5, y: -2.598 }] },
        { leaf: { id: 16, top: 16, bottom: -16, isClock: false }, corners: [{ x: 1.5, y: -2.598 }, { x: 2.5, y: -2.598 }, { x: 1.75, y: -3.031 }] },
        { leaf: { id: 17, top: 17, bottom: -17, isClock: true }, corners: [{ x: 1.5, y: -2.598 }, { x: 1.75, y: -3.031 }, { x: 1, y: -3.464 }] },
        { leaf: { id: 18, top: 18, bottom: -18, isClock: false }, corners: [{ x: 1, y: -3.464 }, { x: 1.75, y: -3.031 }, { x: 2, y: -3.464 }] },
        { leaf: { id: 19, top: 19, bottom: -19, isClock: true }, corners: [{ x: 1, y: -3.464 }, { x: 2, y: -3.464 }, { x: 1.75, y: -3.897 }] },
        { leaf: { id: 20, top: 20, bottom: -20, isClock: true }, corners: [{ x: 1.75, y: -3.897 }, { x: 2, y: -3.464 }, { x: 2.5, y: -4.33 }] },
        { leaf: { id: 21, top: 21, bottom: -21, isClock: false }, corners: [{ x: 2.5, y: -4.33 }, { x: 2, y: -3.464 }, { x: 2.5, y: -3.464 }] },
      ];
      expect(checkLeafFaces(expectedFaces, lines.faces)).toBe(true);
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
        cuts: [{ a: { x: 1, y: -2 }, b: { x: 2, y: -1 } }],  // [2,1], [1,2]
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
