namespace Flexagonator {

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
    const faces: LeafFace[] = [];
    const folds: Line[] = [];
    const cuts: Line[] = [];

    // first triangle
    let a = { x: 0, y: 0 };
    let b = { x: 1, y: 0 };
    let c = computeTrianglePoint(angle1, angle2);
    faces.push({ leaf: leafs[0], corners: [a, b, c] });
    if (leafs[0].isClock) {
      folds.push({ a: b, b: c });
      cuts.push({ a: a, b: c });
    } else {
      folds.push({ a: a, b: c });
      cuts.push({ a: b, b: c });
    }
    folds.push({ a: a, b: b });

    // keep mirroring a corner based on the direction the strip winds
    for (let i = 1; i < leafs.length; i++) {
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
    let xmin = null, ymin = null, xmax = null, ymax = null;
    for (const face of leaflines.faces) {
      for (const point of face.corners) {
        if (xmin === null || point.x < xmin)
          xmin = point.x;
        if (xmax === null || point.x > xmax)
          xmax = point.x;
        if (ymin === null || point.y < ymin)
          ymin = point.y;
        if (ymax === null || point.y > ymax)
          ymax = point.y;
      }
    }
    if (xmin === null || ymin === null || xmax === null || ymax === null) {
      return [{ x: 0, y: 0 }, { x: 0, y: 0 }];
    }
    return [{ x: xmin, y: ymin }, { x: xmax, y: ymax }];
  }

  export function sliceLeafLines(leaflines: LeafLines, start?: number, end?: number): LeafLines {
    if (!start && !end) {
      return leaflines;
    }
    // end+1, because we want inclusive, not exclusive
    const theEnd = end ? end + 1 : end;
    // and there's an extra fold, so we want end+2
    const foldEnd = end ? end + 2 : end;
    return {
      faces: leaflines.faces.slice(start, theEnd),
      folds: leaflines.folds.slice(start, foldEnd),
      cuts: leaflines.cuts.slice(start, theEnd),
    };
  }


  // rotate around the origin
  class Rotate {
    private readonly cos: number;
    private readonly sin: number;

    constructor(angle: number) {
      this.cos = Math.cos(angle);
      this.sin = Math.sin(angle);
    }

    point(p: Point): Point {
      const x = p.x * this.cos - p.y * this.sin;
      const y = p.y * this.cos + p.x * this.sin;
      return { x: x, y: y };
    }

    line(l: Line): Line {
      return { a: this.point(l.a), b: this.point(l.b) };
    }
  }

  // rotate leaflines around the origin (in radians)
  export function rotateLeafLines(leaflines: LeafLines, angle: number): LeafLines {
    if (angle === 0) {
      return leaflines;
    }
    const rotate = new Rotate(angle);

    const faces: LeafFace[] = [];
    for (let oldface of leaflines.faces) {
      const corners = oldface.corners.map(oldcorner => rotate.point(oldcorner));
      faces.push({ leaf: oldface.leaf, corners: corners });
    }

    const folds: Line[] = leaflines.folds.map(oldfold => rotate.line(oldfold));
    const cuts: Line[] = leaflines.cuts.map(oldcut => rotate.line(oldcut));

    return { faces: faces, folds: folds, cuts: cuts };
  }
}
