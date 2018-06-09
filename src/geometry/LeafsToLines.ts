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
    var faces: LeafFace[] = [];
    var folds: Line[] = [];
    var cuts: Line[] = [];

    // first triangle
    var a = { x: 0, y: 0 };
    var b = { x: 1, y: 0 };
    var c = computeTrianglePoint(angle1, angle2);
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
}
