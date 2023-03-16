namespace Flexagonator {

  export function drawStrip(ctx: CanvasRenderingContext2D,
    box: Point, leaflines: LeafLines,
    content: LeafContent, props: PropertiesForLeaves, scale?: number,
    rotation?: number, captions?: DrawStripCaption[]) {

    ctx.save();

    if (rotation !== undefined) {
      leaflines = rotateLeafLines(leaflines, toRadians(rotation));
    } else {
      leaflines = findBestRotation(leaflines, box);
    }

    const extents: [Point, Point] = getExtents(leaflines);
    const flip = (content.face === 'back');
    const transform = Transform.make(box, extents[0], extents[1], flip, scale, 1);

    drawLeafContents(ctx, leaflines, content, props, transform);

    if (captions) {
      ctx.fillStyle = "black";
      for (const caption of captions) {
        drawLeafCaption(ctx, transform, leaflines, caption);
      }
    }

    // alternate gray & white dashes
    ctx.strokeStyle = "rgb(150, 150, 150)";
    if (ctx.setLineDash) {
      // jsPDF doesn't support setLineDash, so we simply skip this call
      ctx.setLineDash([10, 5]);
    }
    drawLines(ctx, leaflines.folds, transform);
    ctx.strokeStyle = "white";
    if (ctx.setLineDash) {
      ctx.setLineDash([0, 10, 5, 0]);
    }
    drawLines(ctx, leaflines.folds, transform);

    ctx.strokeStyle = "black";
    if (ctx.setLineDash) {
      ctx.setLineDash([]);
    }
    drawLines(ctx, leaflines.cuts, transform);

    ctx.restore();
  }

  function drawLeafContents(ctx: CanvasRenderingContext2D, leaflines: LeafLines,
    content: LeafContent, props: PropertiesForLeaves, transform: Transform
  ): void {
    if (content.face === 'front' || content.face === 'back') {
      if (content.showLeafProps) {
        drawFaceProps(ctx, leaflines.faces, transform, props, content.face === 'front', content.inset);
      }
    } else {
      // if both 'folding order' & 'leaf props', 'folding order' is drawn offset & lighter
      if (content.showFoldingOrder && !content.showLeafProps) {
        drawFoldingLabels(ctx, leaflines.faces, transform);
      }
      if (content.showLeafProps) {
        drawLeafLabels(ctx, leaflines.faces, transform, props, !content.showFoldingOrder);
      }
    }

    if (content.showIds && content.face !== 'back') {
      drawIds(ctx, leaflines.faces, transform);
    }
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
    ctx.fillStyle = "black";
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

  function drawFaceProps(
    ctx: CanvasRenderingContext2D, faces: LeafFace[], transform: Transform,
    props: PropertiesForLeaves, front: boolean, inset?: number
  ) {
    const len = getBaseLength(faces[0], transform);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (const face of faces) {
      const incenter = getIncenter(face.corners[0], face.corners[1], face.corners[2]);
      const id = front ? face.leaf.id : -face.leaf.id;
      const color = props.getColorAsRGBString(id);
      if (color !== undefined) {
        ctx.fillStyle = color;
        const corners = insetCorners(face.corners, incenter, inset);
        const p1 = transform.apply(corners[0]);
        const p2 = transform.apply(corners[1]);
        const p3 = transform.apply(corners[2]);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.closePath();
        ctx.fill();
      }

      const label = props.getFaceLabel(id) || (front ? face.leaf.top.toString() : face.leaf.bottom.toString());
      const p = transform.apply(incenter);
      ctx.font = len / 5 + "px sans-serif";
      ctx.fillStyle = "black";
      ctx.fillText(label, p.x, p.y);
    }
  }

  function insetCorners(corners: Point[], incenter: Point, inset?: number): Point[] {
    if (inset === undefined) {
      return corners;
    }
    const insetFraction = inset < 0 ? 0 : inset > 1 ? 1 : inset;
    const w1 = 1 - insetFraction;
    const w2 = insetFraction;
    const a: Point = { x: (w1 * corners[0].x + w2 * incenter.x), y: (w1 * corners[0].y + w2 * incenter.y) };
    const b: Point = { x: (w1 * corners[1].x + w2 * incenter.x), y: (w1 * corners[1].y + w2 * incenter.y) };
    const c: Point = { x: (w1 * corners[2].x + w2 * incenter.x), y: (w1 * corners[2].y + w2 * incenter.y) };
    return [a, b, c];
  }

  function drawLeafLabels(ctx: CanvasRenderingContext2D, faces: LeafFace[], transform: Transform, props: PropertiesForLeaves, useId: boolean) {
    const len = getBaseLength(faces[0], transform);

    for (const face of faces) {
      const incenter = getIncenter(face.corners[0], face.corners[1], face.corners[2]);
      const p = transform.apply(incenter);
      const y = p.y + len * 0.05;
      const y2 = p.y + len * 0.22;

      ctx.fillStyle = "black";
      const toplabel = props.getFaceLabel(face.leaf.id);
      if (toplabel) {
        ctx.textAlign = "right";
        ctx.font = len / 5 + "px sans-serif";
        ctx.fillText(toplabel, p.x, y);
      }

      const bottomlabel = props.getFaceLabel(-face.leaf.id);
      if (bottomlabel) {
        ctx.textAlign = "left";
        ctx.font = len / 8 + "px sans-serif";
        ctx.fillText(" " + bottomlabel, p.x, y);
      }

      ctx.fillStyle = "#999999";
      // this logic is intended to make it so LeafLabels doesn't display folding numbers if there are leaf properties,
      // but LabelsAndFolding will always display the folding numbers
      if (!toplabel || !useId) {
        ctx.textAlign = "right";
        ctx.font = len / 8 + "px sans-serif";
        const toplabel2 = (useId ? face.leaf.id.toString() : face.leaf.top.toString());
        ctx.fillText(toplabel2, p.x, y2);
      }

      if (!bottomlabel || !useId) {
        ctx.textAlign = "left";
        ctx.font = len / 11 + "px sans-serif";
        const bottomlabel2 = (useId ? (-face.leaf.id).toString() : face.leaf.bottom.toString());
        ctx.fillText(" " + bottomlabel2, p.x, y2);
      }
    }
  }


  /** draw an extra caption on the specified leaf,
   * if (caption.which<0), then it's an offset from the end of the string */
  function drawLeafCaption(
    ctx: CanvasRenderingContext2D, transform: Transform,
    leaflines: LeafLines, caption: DrawStripCaption
  ): void {
    const [face, line] = getFace(leaflines, caption.which, caption.edge);
    const p: Point = computeBasePoint(face, line, transform);
    const len = getBaseLength(face, transform);

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = len / 9 + "px sans-serif";
    ctx.fillText(caption.text, p.x, p.y);
    ctx.restore();
  }

  /** figure out where to draw based on which face we want */
  function getFace(leaflines: LeafLines, which: number, edge?: number): [LeafFace, Line] {
    let face: LeafFace;
    let line: Line;
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

    if (edge !== undefined) {
      line = { a: face.corners[edge], b: face.corners[(edge + 1) % 3] };
    }
    return [face, line];
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
