namespace Flexagonator {

  export function drawStrip(
    paint: Paint, leaflines: LeafLines,
    content: LeafContent, props: PropertiesForLeaves, scale?: number,
    rotation?: number, captions?: DrawStripCaption[], center?: boolean
  ) {
    const [w, h] = paint.getSize();
    if (rotation !== undefined) {
      leaflines = rotateLeafLines(leaflines, toRadians(rotation));
    } else {
      leaflines = findBestRotation(leaflines, { x: w, y: h });
    }

    const extents: [Point, Point] = getExtents(leaflines);
    const flip = (content.face === 'back');
    const transform = Transform.make({ x: w, y: h }, extents[0], extents[1], flip, scale, 1, center);

    drawLeafContents(paint, leaflines, content, props, transform);

    if (captions) {
      paint.setTextColor("black");
      for (const caption of captions) {
        drawLeafCaption(paint, transform, leaflines, caption);
      }
    }

    // alternate gray & white dashes
    paint.setLineColor(0x969696);
    drawLines(paint, leaflines.folds, transform, "dashed");

    paint.setLineColor("black");
    drawLines(paint, leaflines.cuts, transform);
    if (content.endStyle === 'solid') {
      const ends = [leaflines.folds[0], leaflines.folds[leaflines.folds.length - 1]];
      drawLines(paint, ends, transform);
    }
  }

  function drawLeafContents(paint: Paint, leaflines: LeafLines,
    content: LeafContent, props: PropertiesForLeaves, transform: Transform
  ): void {
    if (content.face === 'front' || content.face === 'back') {
      if (content.showLeafProps) {
        drawFaceProps(paint, leaflines.faces, transform, props, content.face === 'front', content.inset);
      }
    } else {
      // if both 'folding order' & 'leaf props', 'folding order' is drawn offset & lighter
      if (content.showFoldingOrder && !content.showLeafProps) {
        drawFoldingLabels(paint, leaflines.faces, transform);
      }
      if (content.showLeafProps) {
        drawLeafLabels(paint, leaflines.faces, transform, props, !content.showFoldingOrder);
      }
    }

    if (content.showIds && content.face !== 'back') {
      drawIds(paint, leaflines.faces, transform);
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

  function drawLines(paint: Paint, lines: Line[], transform: Transform, dashed?: "dashed") {
    for (const line of lines) {
      paint.drawLines([transform.apply(line.a), transform.apply(line.b)], dashed);
    }
  }

  function getBaseLength(face: LeafFace, transform: Transform): number {
    const a = lengthOf(face.corners[0], face.corners[1]);
    const b = lengthOf(face.corners[1], face.corners[2]);
    const c = lengthOf(face.corners[2], face.corners[0]);
    const avg = (a + b + c) / 3;
    return transform.applyScale(0.8 * avg);
  }

  function drawFoldingLabels(paint: Paint, faces: LeafFace[], transform: Transform) {
    const len = getBaseLength(faces[0], transform);

    for (const face of faces) {
      const incenter = getIncenter(face.corners[0], face.corners[1], face.corners[2]);
      const p = transform.apply(incenter);
      const y = p.y + len * 0.05;

      paint.setTextHorizontal("right");
      paint.setTextSize(len / 5);
      paint.drawText(face.leaf.top.toString(), p.x, y);

      paint.setTextHorizontal("left");
      paint.setTextSize(len / 8);
      paint.drawText(" " + face.leaf.bottom.toString(), p.x, y);
    }
  }

  function drawIds(paint: Paint, faces: LeafFace[], transform: Transform) {
    const len = getBaseLength(faces[0], transform);

    paint.setTextColor("black");
    paint.setTextHorizontal("center");
    paint.setTextVertical("middle");
    paint.setTextSize(len / 10);

    for (const face of faces) {
      // put the text near one corner in the direction of the incenter
      const incenter = getIncenter(face.corners[0], face.corners[1], face.corners[2]);
      const p = transform.apply(incenter);
      const c = transform.apply(face.corners[2]);
      const x = (c.x * 2 + p.x) / 3;
      const y = (c.y * 2 + p.y) / 3;
      paint.drawText(face.leaf.id.toString(), x, y);
    }
  }

  function drawFaceProps(
    paint: Paint, faces: LeafFace[], transform: Transform,
    props: PropertiesForLeaves, front: boolean, inset?: number
  ) {
    const len = getBaseLength(faces[0], transform);
    paint.setTextHorizontal("center");
    paint.setTextVertical("middle");

    for (const face of faces) {
      const incenter = getIncenter(face.corners[0], face.corners[1], face.corners[2]);
      const id = front ? face.leaf.id : -face.leaf.id;
      const color = props.getColorAsRGBString(id);
      if (color !== undefined) {
        paint.setFillColor(color);
        const corners = insetCorners(face.corners, incenter, inset);
        const p1 = transform.apply(corners[0]);
        const p2 = transform.apply(corners[1]);
        const p3 = transform.apply(corners[2]);
        paint.drawPolygon([p1, p2, p3], "fill");
      }

      const label = props.getFaceLabel(id) || (front ? face.leaf.top.toString() : face.leaf.bottom.toString());
      const p = transform.apply(incenter);
      paint.setTextSize(len / 5);
      paint.setTextColor("black");
      paint.drawText(label, p.x, p.y);
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

  function drawLeafLabels(paint: Paint, faces: LeafFace[], transform: Transform, props: PropertiesForLeaves, useId: boolean) {
    const len = getBaseLength(faces[0], transform);

    for (const face of faces) {
      const incenter = getIncenter(face.corners[0], face.corners[1], face.corners[2]);
      const p = transform.apply(incenter);
      const y = p.y + len * 0.05;
      const y2 = p.y + len * 0.22;

      paint.setTextColor("black");
      const toplabel = props.getFaceLabel(face.leaf.id);
      if (toplabel) {
        paint.setTextHorizontal("right");
        paint.setTextSize(len / 5);
        paint.drawText(toplabel, p.x, y);
      }

      const bottomlabel = props.getFaceLabel(-face.leaf.id);
      if (bottomlabel) {
        paint.setTextHorizontal("left");
        paint.setTextSize(len / 8);
        paint.drawText(" " + bottomlabel, p.x, y);
      }

      paint.setTextColor(0x999999);
      // this logic is intended to make it so LeafLabels doesn't display folding numbers if there are leaf properties,
      // but LabelsAndFolding will always display the folding numbers
      if (!toplabel || !useId) {
        const toplabel2 = (useId ? face.leaf.id.toString() : face.leaf.top.toString());
        paint.setTextHorizontal("right");
        paint.setTextSize(len / 8);
        paint.drawText(toplabel2, p.x, y2);
      }

      if (!bottomlabel || !useId) {
        const bottomlabel2 = (useId ? (-face.leaf.id).toString() : face.leaf.bottom.toString());
        paint.setTextHorizontal("left");
        paint.setTextSize(len / 11);
        paint.drawText(" " + bottomlabel2, p.x, y2);
      }
    }
  }


  /** draw an extra caption on the specified leaf,
   * if (caption.which<0), then it's an offset from the end of the string */
  function drawLeafCaption(
    paint: Paint, transform: Transform,
    leaflines: LeafLines, caption: DrawStripCaption
  ): void {
    const [face, line] = getFace(leaflines, caption.which, caption.edge);
    const p: Point = computeBasePoint(face, line, transform);
    const len = getBaseLength(face, transform) * (caption.scale !== undefined ? caption.scale : 1);

    paint.setTextHorizontal("center");
    paint.setTextVertical("middle");
    paint.setTextSize(len / 9);
    paint.drawText(caption.text, p.x, p.y);
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
