namespace Flexagonator {

  export interface Point {
    readonly x: number,
    readonly y: number
  }
  export interface Line {
    readonly a: Point,
    readonly b: Point
  }

  export interface LeafFace {
    readonly leaf: Leaf,
    readonly corners: Point[],
  }

  export interface LeafLines {
    readonly faces: LeafFace[],  // each face in a strip of leaves
    readonly folds: Line[],      // all the lines to fold along
    readonly cuts: Line[]        // all the lines to cut along
  }

  /*
    Convert an unfolded description of leaves to a set of lines describing
    how to draw the unfolded strip.
      leafs:  description of leaves & how they're connected
      angle1: one angle of triangle for the leaf
      angle2: the edge connecting the angles is the first edge to mirror across
  */
  export function leafsToLines(leafs: Leaf[], angle1: number, angle2: number): LeafLines {
    var faces: LeafFace[] = [];
    var folds: Line[] = [];
    var cuts: Line[] = [];

    // first triangle
    var a = { x: 0, y: 0 };
    var b = { x: 1, y: 0 };
    var c = computeTrianglePoint(angle1, angle2);
    faces.push({ leaf: leafs[0], corners: [a, b, c] });
    folds.push({ a: a, b: b });
    if (leafs[0].isClock) {
      folds.push({ a: b, b: c });
      cuts.push({ a: a, b: c });
    } else {
      folds.push({ a: a, b: c });
      cuts.push({ a: b, b: c });
    }

    // keep mirroring a corner based on the direction the strip winds
    for (var i = 1; i < leafs.length; i++) {
      c = mirror(a, b, c);
      faces.push({ leaf: leafs[i], corners: [a, b, c] });

      if (leafs[i].isClock) {
        folds.push({ a: b, b: c });
        cuts.push({ a: a, b: c });

        const temp = a;
        a = c;
        c = temp;
      } else {
        folds.push({ a: a, b: c });
        cuts.push({ a: b, b: c });

        const temp = b;
        b = c;
        c = temp;
      }
    }

    return { faces: faces, folds: folds, cuts: cuts };
  }

  export function getExtents(leaflines: LeafLines): [Point, Point] {
    var xmin = 0, ymin = 0, xmax = 0, ymax = 0;
    for (var face of leaflines.faces) {
      for (var point of face.corners) {
        if (point.x < xmin)
          xmin = point.x;
        if (point.x > xmax)
          xmax = point.x;
        if (point.y < ymin)
          ymin = point.y;
        if (point.y > ymax)
          ymax = point.y;
      }
    }
    return [{ x: xmin, y: ymin }, { x: xmax, y: ymax }];
  }

  // given a=(0,0), b(1,0), angle1=(c,a,b), angle2=(a,b,c), find c
  function computeTrianglePoint(angle1: number, angle2: number): Point {
    var cota = Math.cos(angle1) / Math.sin(angle1);
    var cotb = Math.cos(angle2) / Math.sin(angle2);
    return { x: cota / (cota + cotb), y: 1 / (cota + cotb) };
  }

  // mirror p over the line (p1, p2)
  function mirror(p1: Point, p2: Point, p: Point): Point {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dx2 = dx * dx;
    const dy2 = dy * dy;

    const a = (dx2 - dy2) / (dx2 + dy2);
    const b = 2 * dx * dy / (dx2 + dy2);

    const x2 = Math.round(a * (p.x - p1.x) + b * (p.y - p1.y) + p1.x);
    const y2 = Math.round(b * (p.x - p1.x) - a * (p.y - p1.y) + p1.y);

    return { x: x2, y: y2 };
  }
}
