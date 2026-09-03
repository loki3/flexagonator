namespace Flexagonator {

  /** where to draw tile for a given leaf-id */
  export interface TilePlace {
    /** leaf id, negative for back face */
    readonly id: number;
    /** first pair of points define the baseline that tile is drawn relative to, output coordinates */
    readonly bounds: Point[];
  }

  /** convert a Polygon (folded flexagon) to TilePlaces */
  export function polygonToTilePlaces(polygon: Polygon): TilePlace[] {
    const triangles = polygon.getLeafTriangles();
    const places = triangles.map((t, i) => {
      return { id: i + 1, bounds: [{ x: t.x2, y: t.y2 }, { x: t.x3, y: t.y3 }, { x: t.x1, y: t.y1 }] }
    });
    return places;
  }

  /** convert LeafLines (unfolded flexagon) to TilePlaces given a transform to output coordinates */
  export function leafLinesToTilePlaces(leafLines: LeafLines, transform: Transform, back: boolean): TilePlace[] {
    const places = leafLines.oriented.map(face => {
      const bounds = face.corners.map(c => transform.apply(c));
      return { id: face.leaf.id * (back ? -1 : 1), bounds };
    });
    return places;
  }

}
