namespace Flexagonator {

  /** where to draw a tile for a given leaf-face-id */
  export interface TilePlace {
    /** leaf id, negative for back face */
    readonly id: number;
    /** first pair of points defines the baseline that tile is drawn relative to in output coordinates */
    readonly bounds: Point[];
  }

  /**
   * convert a Polygon (folded isoflexagon) to TilePlaces, which describes where to draw tiles
   * @param ids leaf ids around the polygon
   * @param corners array of 0,1,or 2 - lists which angle is center/lower, first clockwise, and final angle
   */
  export function polygonToTilePlaces(
    polygon: Polygon, ids: number[], corners: number[]
  ): TilePlace[] {
    const triangles = polygon.getLeafTriangles();
    const places = triangles.map((t, i) => {
      const ordering = getOrdering(corners, i % 2 === 1);
      const bounds = getOrderedTriangle(ordering, t);
      return { id: ids[i], bounds }
    });
    return places;
  }

  /** given the order of the corners, figure out the order of the points */
  function getOrdering(corners: number[], mirror?: boolean): 'abc' | 'bca' | 'cab' {
    if ((corners[0] === 0 && corners[1] === 1) || (corners[0] === 1 && corners[1] === 0)) {
      return mirror ? 'abc' : 'cab';
    } else if (corners[1] === 2) {
      return mirror ? 'cab' : 'abc';
    }
    return 'bca'; // (corners[0] === 2)
  }

  function getOrderedTriangle(s: 'abc' | 'bca' | 'cab', t: Triangle): Point[] {
    switch (s) {
      case 'abc': return [{ x: t.x1, y: t.y1 }, { x: t.x2, y: t.y2 }, { x: t.x3, y: t.y3 }];
      case 'bca': return [{ x: t.x2, y: t.y2 }, { x: t.x3, y: t.y3 }, { x: t.x1, y: t.y1 }];
      case 'cab': return [{ x: t.x3, y: t.y3 }, { x: t.x1, y: t.y1 }, { x: t.x2, y: t.y2 }];
    }
  }

  /** convert LeafLines (unfolded flexagon) to TilePlaces given a transform to output coordinates */
  export function leafLinesToTilePlaces(
    leafLines: LeafLines, transform: Transform, back: boolean
  ): TilePlace[] {
    const places = leafLines.oriented.map(face => {
      const transformed = face.corners.map(c => transform.apply(c));
      const bounds = [
        { x: transformed[1].x, y: transformed[1].y },
        { x: transformed[2].x, y: transformed[2].y },
        { x: transformed[0].x, y: transformed[0].y }];
      return { id: face.leaf.id * (back ? -1 : 1), bounds };
    });
    return places;
  }

}
