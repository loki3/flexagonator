namespace Flexagonator {

  /**
   * draw tiles in the specified places
   * @param tiles description of what to draw for each leaf-id
   * @param places where to draw a tile in output coordinates
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

    // draw tile items
    const itemToPaint = getTileOutputTransform(bounds);
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
      if (item.points === undefined) {
        return;
      }
      if (item.color) {
        this.paint.setLineColor(item.color);
      }
      const points = item.points.map(p => this.transform.transform(p));
      this.paint.drawLines(points);
    }

    doPolygon(item: ItemPolygon) {
      if (item.corners === undefined) {
        return;
      }
      if (item.color) {
        this.paint.setFillColor(item.color);
      }
      const corners = item.corners.map(p => this.transform.transform(p));
      this.paint.drawPolygon(corners, 'fill');
    }

    doCircle(item: ItemCircle) {
      if (item.center === undefined || item.radius === undefined) {
        return;
      }
      if (item.color) {
        this.paint.setLineColor(item.color);
      }
      const center = this.transform.transform(item.center);
      const radius = this.transform.transformLength(item.radius);
      this.paint.drawCircle(center, radius);
    }
  }

}
