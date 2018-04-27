namespace Flexagonator {

  export function drawStrip(ctx: CanvasRenderingContext2D, leaflines: LeafLines) {
    ctx.save();

    const extents: [Point, Point] = getExtents(leaflines);
    const transform = new Transform({ x: ctx.canvas.clientWidth, y: ctx.canvas.clientHeight }, extents[0], extents[1]);

    ctx.strokeStyle = "rgb(150, 150, 150)";
    ctx.setLineDash([10, 5]);
    drawLines(ctx, leaflines.folds, transform);

    ctx.strokeStyle = "black";
    ctx.setLineDash([]);
    drawLines(ctx, leaflines.cuts, transform);

    drawFaceText(ctx, leaflines.faces, transform);

    ctx.restore();
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

    for (var face of faces) {
      const incenter = getIncenter(face.corners[0], face.corners[1], face.corners[2]);
      const p = transform.apply(incenter);
      const y = p.y + len * 0.05;

      ctx.textAlign = "right";
      ctx.font = len / 5 + "px sans-serif";
      ctx.fillText(face.leaf.top.toString(), p.x, y);

      ctx.textAlign = "left";
      ctx.font = len / 8 + "px sans-serif";
      ctx.fillText(" " + face.leaf.bottom.toString(), p.x, y);
    }
  }

}
