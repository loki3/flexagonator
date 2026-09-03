namespace Flexagonator {

  /**
   * draw tiles in the specified places
   * @param tiles description of what to draw for each leaf-id
   * @param places where to draw a tile
   */
  export function drawTiles(paint: Paint, tiles: Tiles, places: TilePlace[]) {
    for (const place of places) {
      const tile = tiles[place.id];
      if (tile) {
        drawTile(paint, tile, place.bounds, tiles.outline);
      }
    }
  }

  /** draw a tile */
  function drawTile(paint: Paint, tile: Tile, bounds: Point[], outline?: boolean) {
    paint.setClipping(bounds);

    // background fill
    if (tile.color !== undefined) {
      paint.setFillColor(tile.color);
      paint.drawPolygon(bounds, 'fill');
    }

    // map item coordinates to output bounds coordinate system
    const p1 = bounds[0];
    const p2 = bounds[1];
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const scale = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    const itemToPaint = Matrix2D.new().mirror('x').offset(1, 0).scale(scale).rotate(angle).offset(p1.x, p1.y)

    // draw items
    const drawer = new ItemDrawer(paint, itemToPaint);
    for (const item of tile.items) {
      handleItem(drawer, item);
    }

    paint.resetClipping();
    if (outline) {
      paint.setLineColor('black');
      paint.drawLines(bounds.concat(bounds[0]));
    }
  }

  /** draw a single item */
  class ItemDrawer implements ItemDispatch {
    constructor(private readonly paint: Paint, private readonly transform: Matrix2D) { }

    doLines(item: ItemLines) {
      if (item.color) {
        this.paint.setLineColor(item.color);
      }
      const points = item.points.map(l => this.transform.transform(l));
      this.paint.drawLines(points);
    }

    doPolygon(item: ItemPolygon) {
      if (item.color) {
        this.paint.setFillColor(item.color);
      }
      const corners = item.corners.map(l => this.transform.transform(l));
      this.paint.drawPolygon(corners, 'fill');
    }

    doCircle(item: ItemCircle) {
      if (item.color) {
        this.paint.setLineColor(item.color);
      }
      const center = this.transform.transform(item.center);
      const radius = this.transform.transformLength(item.radius);
      this.paint.drawCircle(center, radius);
    }
  }

}
