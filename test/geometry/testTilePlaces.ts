namespace Flexagonator {

  /** compare sets of TilePlaces, rounding off coordinates, logging & returning false if it fails */
  function checkTilePlaces(expected: TilePlace[], actual: TilePlace[], length: number, name: string): boolean {
    if (length !== actual.length) {
      console.log(`mismatched ${name} count for ${name}:\nexpected ${length}\nactual ${actual.length}`);
      return false;
    }
    for (let i = 0; i < expected.length; i++) {
      const e = boundsAsString(expected[i].bounds);
      const a = boundsAsString(actual[i].bounds);
      if (e !== a) {
        console.log(`mismatched in element ${i} for ${name}:\nexpected ${e}\nactual ${a}`);
        return false;
      }
    }
    return true;
  }

  function boundsAsString(p: Point[]): string {
    return `{x:${r(p[0].x)}, y:${r(p[0].y)}}, {x:${r(p[1].x)}, y:${r(p[1].y)}}, {x:${r(p[2].x)}, y:${r(p[2].y)}}`;
  }
  /** coordinate rounded to the nearest 0.001 */
  function r(n: number): number {
    return Math.round(n * 100) / 100;
  }

  describe('polygonToTilePlaces', () => {
    it('creates placements for different orientations', () => {
      const polygon = new Polygon(6, 50, 50, 50, [60, 60], true);
      const ids = [1, 2, 3, 4, 5, 6];

      // just check the first couple for each arrangement to establish that the pattern works
      // 012
      const expected012: TilePlace[] = [
        { id: 1, bounds: [{ x: 100, y: 50 }, { x: 50, y: 50 }, { x: 75, y: 6.7 }] },
        { id: 2, bounds: [{ x: 50, y: 50 }, { x: 100, y: 50 }, { x: 75, y: 93.3 }] },
      ];
      const places012 = polygonToTilePlaces(polygon, ids, [0, 1, 2]);
      expect(checkTilePlaces(expected012, places012, 6, '012')).toBe(true);
      // 021
      const expected021: TilePlace[] = [
        { id: 1, bounds: [{ x: 50, y: 50 }, { x: 75, y: 6.7 }, { x: 100, y: 50 }] },
        { id: 2, bounds: [{ x: 75, y: 93.3 }, { x: 50, y: 50 }, { x: 100, y: 50 }] },
      ];
      const places021 = polygonToTilePlaces(polygon, ids, [0, 2, 1]);
      expect(checkTilePlaces(expected021, places021, 6, '021')).toBe(true);
      // 120
      const expected120: TilePlace[] = [
        { id: 1, bounds: [{ x: 50, y: 50 }, { x: 75, y: 6.7 }, { x: 100, y: 50 }] },
        { id: 2, bounds: [{ x: 75, y: 93.3 }, { x: 50, y: 50 }, { x: 100, y: 50 }] },
      ];
      const places120 = polygonToTilePlaces(polygon, ids, [1, 2, 0]);
      expect(checkTilePlaces(expected120, places120, 6, '120')).toBe(true);
      // 102
      const expected102: TilePlace[] = [
        { id: 1, bounds: [{ x: 100, y: 50 }, { x: 50, y: 50 }, { x: 75, y: 6.7 }] },
        { id: 2, bounds: [{ x: 50, y: 50 }, { x: 100, y: 50 }, { x: 75, y: 93.3 }] },
      ];
      const places102 = polygonToTilePlaces(polygon, ids, [1, 0, 2]);
      expect(checkTilePlaces(expected102, places102, 6, '102')).toBe(true);
      // 201
      const expected201: TilePlace[] = [
        { id: 1, bounds: [{ x: 75, y: 6.7 }, { x: 100, y: 50 }, { x: 50, y: 50 }] },
        { id: 2, bounds: [{ x: 100, y: 50 }, { x: 75, y: 93.3 }, { x: 50, y: 50 }] },
      ];
      const places201 = polygonToTilePlaces(polygon, ids, [2, 0, 1]);
      expect(checkTilePlaces(expected201, places201, 6, '201')).toBe(true);
      // 210
      const expected210: TilePlace[] = [
        { id: 1, bounds: [{ x: 75, y: 6.7 }, { x: 100, y: 50 }, { x: 50, y: 50 }] },
        { id: 2, bounds: [{ x: 100, y: 50 }, { x: 75, y: 93.3 }, { x: 50, y: 50 }] },
      ];
      const places210 = polygonToTilePlaces(polygon, ids, [2, 1, 0]);
      expect(checkTilePlaces(expected210, places210, 6, '210')).toBe(true);
    });
  });

  describe('leafLinesToTilePlaces', () => {
    it('creates placements for different orientations', () => {
      // take the first few leaves from a flexagon (generator: (P^>)5)
      const leafLines: LeafLines = {
        faces: [], cuts: [], folds: [],
        oriented: [
          {
            leaf: { id: 1, top: 1, bottom: 2, isClock: true },
            corners: [{ x: -0.8660254037844387, y: 0.49999999999999994 }, { x: 0, y: 0 }, { x: -0.8660254037844385, y: -0.4999999999999998 }]
          },
          {
            leaf: { id: 2, top: 3, bottom: 2, isClock: false },
            corners: [{ x: -0.8660254037844387, y: 0.49999999999999994 }, { x: 0, y: 0 }, { x: -2.220446049250313e-16, y: 0.9999999999999998 }]
          }, {
            leaf: { id: 3, top: 4, bottom: 5, isClock: true },
            corners: [{ x: 0.8660254037844384, y: 0.5000000000000003 }, { x: 0, y: 0 }, { x: -2.220446049250313e-16, y: 0.9999999999999998 }]
          }, {
            leaf: { id: 4, top: 7, bottom: 6, isClock: false },
            corners: [{ x: 0.8660254037844384, y: 0.5000000000000003 }, { x: 0.866025403784438, y: 1.5000000000000002 }, { x: -2.220446049250313e-16, y: 0.9999999999999998 }]
          }, {
            leaf: { id: 5, top: 7, bottom: 1, isClock: true },
            corners: [{ x: 0.8660254037844384, y: 0.5000000000000003 }, { x: 0.866025403784438, y: 1.5000000000000002 }, { x: 1.7320508075688767, y: 1.0000000000000004 }]
          },
        ]
      };
      const transform = Transform.make(
        { x: 798, y: 598 }, { x: -0.866, y: -0.5 }, { x: 6.923, y: 5.5 }, undefined, 99.67, 1);
      const places = leafLinesToTilePlaces(leafLines, transform, false);

      const expected: TilePlace[] = [
        { id: 1, bounds: [{ x: 87.31, y: 50.84 }, { x: 1, y: 1 }, { x: 1, y: 100.67 }] },
        { id: 2, bounds: [{ x: 87.31, y: 50.84 }, { x: 87.31, y: 150.5 }, { x: 1, y: 100.67 }] },
        { id: 3, bounds: [{ x: 87.31, y: 50.84 }, { x: 87.31, y: 150.5 }, { x: 173.63, y: 100.67 }] },
        { id: 4, bounds: [{ x: 173.63, y: 200.34 }, { x: 87.31, y: 150.5 }, { x: 173.63, y: 100.67 }] },
        { id: 5, bounds: [{ x: 173.63, y: 200.34 }, { x: 259.95, y: 150.51 }, { x: 173.63, y: 100.67 }] }];

      expect(checkTilePlaces(expected, places, 5, 'leafLinesToTilePlaces')).toBe(true);
    });
  });
}
