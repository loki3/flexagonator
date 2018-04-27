namespace Flexagonator {

  export function drawStrip(ctx: CanvasRenderingContext2D, leaflines: LeafLines) {
    ctx.save();
    const transform = transformCanvas(ctx, leaflines);

    ctx.strokeStyle = "rgb(150, 150, 150)";
    ctx.setLineDash([10, 5]);
    drawLines(ctx, leaflines.folds, transform);

    ctx.strokeStyle = "black";
    ctx.setLineDash([]);
    drawLines(ctx, leaflines.cuts, transform);

    drawFaceText(ctx, leaflines.faces, transform);

    ctx.restore();
  }

  function transformCanvas(ctx: CanvasRenderingContext2D, leaflines: LeafLines): Transform {
    const ctxWidth = 800;
    const ctxHeight = 500;

    const extents: [Point, Point] = getExtents(leaflines);
    const scalex = ctxWidth / (extents[1].x - extents[0].x);
    const scaley = ctxHeight / (extents[1].y - extents[0].y);
    const scale = Math.min(scalex, scaley);
    return new Transform({ x: -extents[0].x, y: -extents[0].y }, scale);
  }

  function drawLines(ctx: CanvasRenderingContext2D, lines: Line[], transform: Transform) {
    for (var line of lines) {
      ctx.beginPath();
      const from = transform.apply(line.a);
      ctx.moveTo(from.x, from.y);
      const to = transform.apply(line.b);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    }
  }

  function drawFaceText(ctx: CanvasRenderingContext2D, faces: LeafFace[], transform: Transform) {
    const len = transform.applyScale(1);
    ctx.font = len / 5 + "px sans-serif";

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (var face of faces) {
      const incenter = getIncenter(face.corners[0], face.corners[1], face.corners[2]);
      const p = transform.apply(incenter);
      const s = face.leaf.top.toString() + '/' + face.leaf.bottom.toString();
      ctx.fillText(s, p.x, p.y);
    }
  }

}
