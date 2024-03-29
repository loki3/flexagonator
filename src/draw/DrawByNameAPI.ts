namespace Flexagonator {

  /** limited support for drawing non-triangular flexagons by name, e.g. 'hexagonal kite hexaflexagon' */
  export function drawByName(target: string | HTMLCanvasElement, name: string) {
    const paint = newPaint(target);
    if (paint === null) {
      return;
    }
    const [width, height] = paint.getSize();
    const center: Point = { x: width / 2, y: height / 2 };
    const r = Math.min(width, height);

    const namePieces = namePiecesFromName(name);
    const patPieces = getPatPieces(namePieces);
    if (patPieces === null) {
      return;
    }

    paint.start();
    drawLines(paint, patPieces.count, center, r, patPieces.fold, 'dashed');
    drawLines(paint, patPieces.count, center, r, patPieces.cut1, 'solid');
    if (patPieces.cut2) {
      drawLines(paint, patPieces.count, center, r, patPieces.cut2, 'solid');
    }
    paint.end();
  }

  /** draw the lines described by polarPoints */
  function drawLines(
    paint: Paint,
    count: number,
    center: Point,
    width: number,
    polarPoints: Polar[],
    how: 'solid' | 'dashed'
  ) {
    const points = spin(count, center, width, polarPoints);

    paint.setLineColor(how === 'solid' ? "black" : 0x969696);
    const dashed = how === 'dashed' ? how : undefined;
    points.forEach(set => {
      const lines = set.map(p => { return { x: p.x, y: 2 * center.y - p.y } });
      paint.drawLines(lines, dashed);
    });
  }

  /** cut lines and fold lines for a single pat, which gets rotated around a center point */
  interface PatPieces {
    count: number;
    cut1: Polar[];
    cut2?: Polar[];
    fold: Polar[];
  }

  /** get cut & fold lines for a named flexagon */
  function getPatPieces(name: NamePieces): PatPieces | null {
    for (const piece of lookupPieces) {
      const check = piece[0];
      if (check.overallShape === name.overallShape && check.leafShape === name.leafShape && check.patsPrefix === name.patsPrefix) {
        return piece[1];
      }
    }
    return null;
  }

  /** flexagon name + cut & fold lines for it */
  const lookupPieces: [NamePieces, PatPieces][] = [
    // trapezoids
    [
      { overallShape: 'triangular', leafShape: 'trapezoid', patsPrefix: 'tri' },
      {
        count: 3,
        cut1: [{ r: 1, θ: -30 }, { r: 1, θ: 90 }],
        cut2: [{ r: 0.3, θ: -30 }, { r: 0.3, θ: 90 }],
        fold: [{ r: 0.3, θ: -30 }, { r: 1, θ: -30 }]
      }
    ],
    [
      { overallShape: 'square ring', leafShape: 'trapezoid', patsPrefix: 'tetra' },
      {
        count: 4,
        cut1: [{ r: 1.414, θ: -45 }, { r: 1.414, θ: 45 }],
        cut2: [{ r: 0.5, θ: -45 }, { r: 0.5, θ: 45 }],
        fold: [{ r: 0.5, θ: -45 }, { r: 1.414, θ: -45 }]
      }
    ],
    [
      { overallShape: 'pentagonal ring', leafShape: 'trapezoid', patsPrefix: 'penta' },
      {
        count: 5,
        cut1: [{ r: 1, θ: 18 }, { r: 1, θ: 72 + 18 }],
        cut2: [{ r: 0.4, θ: 18 }, { r: 0.4, θ: 72 + 18 }],
        fold: [{ r: 0.4, θ: 18 }, { r: 1, θ: 18 }]
      }
    ],
    [
      { overallShape: 'hexagonal ring', leafShape: 'trapezoid', patsPrefix: 'hexa' },
      {
        count: 6,
        cut1: [{ r: 1, θ: 0 }, { r: 1, θ: 60 }],
        cut2: [{ r: 0.4, θ: 0 }, { r: 0.4, θ: 60 }],
        fold: [{ r: 0.4, θ: 0 }, { r: 1, θ: 0 }]
      }
    ],
    [
      { overallShape: 'heptagonal ring', leafShape: 'trapezoid', patsPrefix: 'hepta' },
      {
        count: 7,
        cut1: [{ r: 1, θ: 38.6 }, { r: 1, θ: 90 }],
        cut2: [{ r: 0.4, θ: 38.6 }, { r: 0.4, θ: 90 }],
        fold: [{ r: 0.4, θ: 38.6 }, { r: 1, θ: 38.6 }]
      }
    ],
    [
      { overallShape: 'octagonal ring', leafShape: 'trapezoid', patsPrefix: 'octa' },
      {
        count: 8,
        cut1: [{ r: 1, θ: 0 }, { r: 1, θ: 45 }],
        cut2: [{ r: 0.4, θ: 0 }, { r: 0.4, θ: 45 }],
        fold: [{ r: 0.4, θ: 0 }, { r: 1, θ: 0 }]
      }
    ],
    // tetraflexagons
    [
      { leafShape: 'square', patsPrefix: 'tetra' },
      {
        count: 4,
        cut1: [{ r: 1, θ: 0 }, { r: Math.sqrt(2), θ: 45 }, { r: 1, θ: 90 }],
        fold: [{ r: 0, θ: 0 }, { r: 1, θ: 0 }]
      }
    ],
    [
      { leafShape: 'pentagon', patsPrefix: 'tetra' },
      {
        count: 4,
        cut1: [{ r: 0.6, θ: 0 }, { r: 1.07, θ: 22 }, { r: 1.07, θ: 68 }, { r: 0.6, θ: 90 }],
        fold: [{ r: 0, θ: 0 }, { r: 0.6, θ: 0 }]
      }
    ],
    [
      { leafShape: 'hexagon', patsPrefix: 'tetra' },
      {
        count: 4,
        cut1: [{ r: 0.6, θ: 0 }, { r: 1.07, θ: 22 }, { r: 1.4, θ: 45 }, { r: 1.07, θ: 68 }, { r: 0.6, θ: 90 }],
        fold: [{ r: 0, θ: 0 }, { r: 0.6, θ: 0 }]
      }
    ],
    [
      { leafShape: 'heptagon', patsPrefix: 'tetra' },
      {
        count: 4,
        cut1: [{ r: 0.6, θ: 0 }, { r: 1.02, θ: 15 }, { r: 1.202, θ: 35 }, { r: 1.202, θ: 55 }, { r: 1.02, θ: 75 }, { r: 0.6, θ: 90 }],
        fold: [{ r: 0, θ: 0 }, { r: 0.6, θ: 0 }]
      }
    ],
    [
      { overallShape: 'ring', leafShape: 'octagon', patsPrefix: 'tetra' },
      {
        count: 4,
        cut1: [{ r: 0.7, θ: 0 }, { r: 1.03, θ: 16 }, { r: 1.21, θ: 35 }, { r: 1.21, θ: 55 }, { r: 1.03, θ: 74 }, { r: 0.7, θ: 90 }],
        cut2: [{ r: 0.29, θ: 0 }, { r: 0.29, θ: 90 }],
        fold: [{ r: 0.29, θ: 0 }, { r: 0.7, θ: 0 }]
      }
    ],
    [
      { leafShape: 'octagon', patsPrefix: 'tetra' },
      {
        count: 4,
        cut1: [{ r: 0.4, θ: 0 }, { r: 0.82, θ: 14 }, { r: 1.16, θ: 31 }, { r: 1.39, θ: 45 }, { r: 1.16, θ: 59 }, { r: 0.82, θ: 76 }, { r: 0.4, θ: 90 }],
        fold: [{ r: 0, θ: 0 }, { r: 0.4, θ: 0 }]
      }
    ],
    // hexaflexagons
    [
      { overallShape: 'hexagonal', leafShape: 'kite', patsPrefix: 'hexa' },
      { // sqrt(3) / 2 ~= 0.866
        count: 6,
        cut1: [{ r: 0.866, θ: -90 }, { r: 1, θ: -60 }, { r: 0.866, θ: -30 }],
        fold: [{ r: 0, θ: -90 }, { r: 0.866, θ: -90 }]
      }
    ],
    [
      { overallShape: 'dodecagonal', leafShape: 'rhombus', patsPrefix: 'hexa' },
      { // 0.5 / (sqrt(3)/2) ~= 0.577
        count: 6,
        cut1: [{ r: 0.577, θ: -90 }, { r: 1, θ: -60 }, { r: 0.577, θ: -30 }],
        fold: [{ r: 0, θ: -90 }, { r: 0.577, θ: -90 }]
      }
    ],
    [
      { leafShape: 'pentagon', patsPrefix: 'hexa' },
      {
        count: 6,
        cut1: [{ r: 0.768, θ: 0 }, { r: 1.01, θ: 19 }, { r: 1.01, θ: 41 }, { r: 0.768, θ: 60 }],
        cut2: [{ r: 0, θ: 0 }, { r: 0, θ: 60 }],
        fold: [{ r: 0, θ: 0 }, { r: 0.768, θ: 0 }]
      }
    ],
    [
      { leafShape: 'hexagon', patsPrefix: 'hexa' },
      {
        count: 6,
        cut1: [{ r: 0.768, θ: 0 }, { r: 1.01, θ: 19 }, { r: 1.01, θ: 41 }, { r: 0.768, θ: 60 }],
        cut2: [{ r: 0.384, θ: 0 }, { r: 0.384, θ: 60 }],
        fold: [{ r: 0.384, θ: 0 }, { r: 0.768, θ: 0 }]
      }
    ],
    // octaflexagons
    [
      { overallShape: 'square ring', leafShape: 'square', patsPrefix: 'octa' },
      { // this is a cheat, since it doesn't follow the assumption that all pats are the same
        count: 4,
        cut1: [{ r: 1.414, θ: 45 }, { r: 1.414, θ: 135 }],
        cut2: [{ r: 0.33 * 1.414, θ: 45 }, { r: 0.33 * 1.414, θ: 135 }],
        fold: [{ r: 1.05, θ: 72 }, { r: 0.47, θ: 45 }, { r: 0.47, θ: 135 }, { r: 1.05, θ: 108 }]
      }
    ],
  ];
}
