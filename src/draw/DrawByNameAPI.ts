namespace Flexagonator {

  /** limited support for drawing non-triangular flexagons by name, e.g. 'hexagonal kite hexaflexagon' */
  export function drawByName(canvas: string | HTMLCanvasElement, name: string) {
    const output: HTMLCanvasElement = canvas instanceof HTMLCanvasElement ? canvas : document.getElementById(canvas) as HTMLCanvasElement;
    const ctx = output.getContext("2d") as CanvasRenderingContext2D;
    const [width, height] = [ctx.canvas.clientWidth, ctx.canvas.clientHeight];
    const center: Point = { x: width / 2, y: height / 2 };
    const r = Math.min(width, height);

    const namePieces = namePiecesFromName(name);
    const patPieces = getPatPieces(namePieces);
    if (patPieces === null) {
      return;
    }

    ctx.clearRect(0, 0, width, width);
    drawLines(ctx, patPieces.count, center, r, patPieces.cut1, 'solid');
    if (patPieces.cut2) {
      drawLines(ctx, patPieces.count, center, r, patPieces.cut2, 'solid');
    }
    drawLines(ctx, patPieces.count, center, r, patPieces.fold, 'dashed');
  }

  /** draw the lines described by polarPoints */
  function drawLines(
    ctx: CanvasRenderingContext2D,
    count: number,
    center: Point,
    width: number,
    polarPoints: Polar[],
    how: 'solid' | 'dashed'
  ) {
    const points = spin(count, center, width, polarPoints);

    ctx.save();
    if (how === 'solid') {
      ctx.strokeStyle = "black";
      ctx.setLineDash([]);
    } else if (how === 'dashed') {
      ctx.strokeStyle = "rgb(150, 150, 150)";
      ctx.setLineDash([10, 5]);
    }

    for (const set of points) {
      ctx.beginPath();
      ctx.moveTo(set[0].x, 2 * center.y - set[0].y);
      for (const point of set) {
        ctx.lineTo(point.x, 2 * center.y - point.y);
      }
      ctx.stroke();
    }
    ctx.restore();
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
    /*
    pentagon tetraflexagon
    pentagon hexaflexagon
    hexagon tetraflexagon
    heptagon tetraflexagon
    octagon tetraflexagon
    */
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
    /*
    pentagon hexaflexagon
    hexagon hexaflexagon
    */
  ];
}
