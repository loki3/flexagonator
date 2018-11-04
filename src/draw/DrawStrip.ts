namespace Flexagonator {

  export function drawStrip(ctx: CanvasRenderingContext2D, leaflines: LeafLines,
    content: StripContent, props: PropertiesForLeaves, scale?: number,
    rotation?: number, captions?: DrawStripCaption[]) {

    ctx.save();

    const box = { x: ctx.canvas.clientWidth, y: ctx.canvas.clientHeight };
    if (rotation !== undefined) {
      leaflines = rotateLeafLines(leaflines, toRadians(rotation));
    } else {
      leaflines = findBestRotation(leaflines, box);
    }

    const extents: [Point, Point] = getExtents(leaflines);
    const flip = (content === StripContent.Back);
    const transform = Transform.make(box, extents[0], extents[1], flip, scale);

    if (content === StripContent.FoldingLabels || content === StripContent.FoldingAndIds) {
      drawFoldingLabels(ctx, leaflines.faces, transform);
      if (content === StripContent.FoldingAndIds) {
        drawIds(ctx, leaflines.faces, transform);
      }
    } else if (content === StripContent.Front) {
      drawFaceProps(ctx, leaflines.faces, transform, props, true);
    } else if (content === StripContent.Back) {
      drawFaceProps(ctx, leaflines.faces, transform, props, false);
    } else if (content === StripContent.LeafLabels) {
      drawLeafLabels(ctx, leaflines.faces, transform, props, true);
    } else if (content === StripContent.LabelsAndFolding) {
      drawLeafLabels(ctx, leaflines.faces, transform, props, false);
    }

    if (captions) {
      ctx.fillStyle = "black";
      for (const caption of captions) {
        drawLeafCaption(ctx, transform, leaflines, caption.which, caption.text);
      }
    }

    ctx.strokeStyle = "rgb(150, 150, 150)";
    ctx.setLineDash([10, 5]);
    drawLines(ctx, leaflines.folds, transform);

    ctx.strokeStyle = "black";
    ctx.setLineDash([]);
    drawLines(ctx, leaflines.cuts, transform);

    ctx.restore();
  }


  // search for the rotation that optimizes the amount of 'box' that gets filled
  function findBestRotation(leaflines: LeafLines, box: Point): LeafLines {
    let bestlines = leaflines;
    const best = new BestBoxInBox(box);
    for (let i = 0; i < 24; i++) {
      const rotation = (i * Math.PI * 2) / 24;
      const thislines = rotateLeafLines(leaflines, rotation);
      const extents: [Point, Point] = getExtents(thislines);
      if (best.isBest(extents[0], extents[1])) {
        bestlines = thislines;
      }
    }
    return bestlines;
  }

  function drawLines(ctx: CanvasRenderingContext2D, lines: Line[], transform: Transform) {
    for (const line of lines) {
      ctx.beginPath();
      const from = transform.apply(line.a);
      ctx.moveTo(from.x, from.y);
      const to = transform.apply(line.b);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    }
  }

  function getBaseLength(face: LeafFace, transform: Transform): number {
    const a = lengthOf(face.corners[0], face.corners[1]);
    const b = lengthOf(face.corners[1], face.corners[2]);
    const c = lengthOf(face.corners[2], face.corners[0]);
    const avg = (a + b + c) / 3;
    return transform.applyScale(0.8 * avg);
  }

  function drawFoldingLabels(ctx: CanvasRenderingContext2D, faces: LeafFace[], transform: Transform) {
    const len = getBaseLength(faces[0], transform);

    for (const face of faces) {
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
    const len = getBaseLength(faces[0], transform);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = len / 10 + "px sans-serif";

    for (const face of faces) {
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
    const len = getBaseLength(faces[0], transform);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (const face of faces) {
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

      const label = props.getFaceLabel(id) || id.toString();
      const incenter = getIncenter(face.corners[0], face.corners[1], face.corners[2]);
      const p = transform.apply(incenter);
      ctx.font = len / 5 + "px sans-serif";
      ctx.fillStyle = "black";
      ctx.fillText(label, p.x, p.y);
    }
  }

  function drawLeafLabels(ctx: CanvasRenderingContext2D, faces: LeafFace[], transform: Transform, props: PropertiesForLeaves, useId: boolean) {
    const len = getBaseLength(faces[0], transform);

    for (const face of faces) {
      const incenter = getIncenter(face.corners[0], face.corners[1], face.corners[2]);
      const p = transform.apply(incenter);
      const y = p.y + len * 0.05;
      const y2 = p.y + len * 0.22;

      ctx.fillStyle = "black";
      ctx.textAlign = "right";
      ctx.font = len / 5 + "px sans-serif";
      const toplabel = props.getFaceLabel(face.leaf.id);
      if (toplabel) {
        ctx.fillText(toplabel, p.x, y);
      }

      ctx.textAlign = "left";
      ctx.font = len / 8 + "px sans-serif";
      const bottomlabel = props.getFaceLabel(-face.leaf.id);
      if (bottomlabel) {
        ctx.fillText(" " + bottomlabel, p.x, y);
      }

      ctx.fillStyle = "#999999";
      ctx.textAlign = "right";
      ctx.font = len / 8 + "px sans-serif";
      const toplabel2 = (useId ? face.leaf.id.toString() : face.leaf.top.toString());
      ctx.fillText(toplabel2, p.x, y2);

      ctx.textAlign = "left";
      ctx.font = len / 11 + "px sans-serif";
      const bottomlabel2 = (useId ? (-face.leaf.id).toString() : face.leaf.bottom.toString());
      ctx.fillText(" " + bottomlabel2, p.x, y2);
    }
  }


  // draw an extra caption on the specified leaf,
  // if (which<0), then it's an offset from the end of the string
  function drawLeafCaption(ctx: CanvasRenderingContext2D, transform: Transform,
    leaflines: LeafLines, which: number, text: string) {

    const { face, line }: { face: LeafFace; line: Line; } = getFace(leaflines, which);
    const p: Point = computeBasePoint(face, line, transform);
    const len = getBaseLength(face, transform);

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = len / 9 + "px sans-serif";
    ctx.fillText(text, p.x, p.y);
    ctx.restore();
  }

  // figure out where to draw based on which face we want
  function getFace(leaflines: LeafLines, which: number) {
    var face: LeafFace;
    var line: Line;
    if (which == 0) {
      face = leaflines.faces[which];
      line = leaflines.folds[0];  // first fold
    }
    else if (which == -1) {
      face = leaflines.faces[leaflines.faces.length + which];
      line = leaflines.folds[leaflines.folds.length - 1]; // last fold
    }
    else if (which > 0) {
      face = leaflines.faces[which];
      line = { a: face.corners[0], b: face.corners[1] };
    }
    else {
      face = leaflines.faces[leaflines.faces.length + which];
      line = { a: face.corners[0], b: face.corners[1] };
    }
    return { face, line };
  }

  function computeBasePoint(face: LeafFace, line: Line, transform: Transform): Point {
    const a = face.corners[0], b = face.corners[1], c = face.corners[2];
    const incenter = getIncenter(a, b, c);
    const middle: Point = { x: (line.a.x + line.b.x) / 2, y: (line.a.y + line.b.y) / 2 };
    // weight toward the edge rather than center
    const textpoint: Point = { x: (incenter.x + 3 * middle.x) / 4, y: (incenter.y + 3 * middle.y) / 4 };
    const p = transform.apply(textpoint);
    return p;
  }

}
