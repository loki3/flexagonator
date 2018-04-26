namespace Flexagonator {

  export function drawStrip(ctx: CanvasRenderingContext2D, leaflines: LeafLines) {
    ctx.save();
    const scale = transformCanvas(ctx, leaflines);

    ctx.strokeStyle = "rgb(150, 150, 150)";
    ctx.setLineDash([10 / scale, 5 / scale]);
    drawLines(ctx, leaflines.folds);

    ctx.strokeStyle = "black";
    ctx.setLineDash([]);
    drawLines(ctx, leaflines.cuts);

    ctx.restore();
  }

  function transformCanvas(ctx: CanvasRenderingContext2D, leaflines: LeafLines): number {
    const ctxWidth = 800;
    const ctxHeight = 500;

    const extents: [Point, Point] = getExtents(leaflines);
    const scalex = ctxWidth / (extents[1].x - extents[0].x);
    const scaley = ctxHeight / (extents[1].y - extents[0].y);
    const scale = Math.min(scalex, scaley);
    ctx.translate(-extents[0].x * scale, -extents[0].y * scale);
    ctx.scale(scale, scale);
    ctx.lineWidth = ctx.lineWidth / scale;
    return scale;
  }

  function drawLines(ctx: CanvasRenderingContext2D, lines: Line[]) {
    for (var line of lines) {
      ctx.beginPath();
      ctx.moveTo(line.a.x, line.a.y);
      ctx.lineTo(line.b.x, line.b.y);
      ctx.stroke();
    }
  }

}
