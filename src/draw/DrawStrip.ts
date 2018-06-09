namespace Flexagonator {

  export function drawStrip(ctx: CanvasRenderingContext2D, leaflines: LeafLines, content: StripContent, props: PropertiesForLeaves) {
    ctx.save();

    const extents: [Point, Point] = getExtents(leaflines);
    const flip = (content === StripContent.Back);
    const transform = new Transform({ x: ctx.canvas.clientWidth, y: ctx.canvas.clientHeight }, extents[0], extents[1], flip);

    if (content === StripContent.FoldingLabels || content === StripContent.FoldingAndIds) {
      drawFoldingLabels(ctx, leaflines.faces, transform);
      if (content === StripContent.FoldingAndIds) {
        drawIds(ctx, leaflines.faces, transform);
      }
    } else if (content === StripContent.Front) {
      drawFaceProps(ctx, leaflines.faces, transform, props, true);
    } else if (content === StripContent.Back) {
      drawFaceProps(ctx, leaflines.faces, transform, props, false);
    }

    ctx.strokeStyle = "rgb(150, 150, 150)";
    ctx.setLineDash([10, 5]);
    drawLines(ctx, leaflines.folds, transform);

    ctx.strokeStyle = "black";
    ctx.setLineDash([]);
    drawLines(ctx, leaflines.cuts, transform);

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

  function drawFoldingLabels(ctx: CanvasRenderingContext2D, faces: LeafFace[], transform: Transform) {
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

  function drawIds(ctx: CanvasRenderingContext2D, faces: LeafFace[], transform: Transform) {
    const len = transform.applyScale(1);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = len / 10 + "px sans-serif";

    for (var face of faces) {
      // put the text near one corner in the direction of the incenter
      const incenter = getIncenter(face.corners[0], face.corners[1], face.corners[2]);
      const p = transform.apply(incenter);
      const c = transform.apply(face.corners[2]);
      const x = (c.x * 2 + p.x) / 3;
      const y = (c.y * 2 + p.y) / 3;
      ctx.fillText(face.leaf.id.toString(), x, y);
    }
  }

  function drawFaceProps(ctx: CanvasRenderingContext2D, faces: LeafFace[], transform: Transform, props: PropertiesForLeaves, front: boolean) {
    const len = transform.applyScale(1);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (var face of faces) {
      const id = front ? face.leaf.id : -face.leaf.id;
      const color = props.getColorAsRGBString(id);
      if (color !== undefined) {
        ctx.fillStyle = color;
        const p1 = transform.apply(face.corners[0]);
        const p2 = transform.apply(face.corners[1]);
        const p3 = transform.apply(face.corners[2]);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.closePath();
        ctx.fill();
      }

      const label = props.getFaceLabel(id);
      const incenter = getIncenter(face.corners[0], face.corners[1], face.corners[2]);
      const p = transform.apply(incenter);
      ctx.font = len / 5 + "px sans-serif";
      ctx.fillStyle = "black";
      ctx.fillText(label, p.x, p.y);
    }
  }

}
