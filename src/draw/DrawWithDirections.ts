namespace Flexagonator {

  /**
   * draw a flexagon that specifies directions, with lots of options for additional pieces
   * @returns hinges in pixels
   */
  export function drawWithDirections(paint: Paint, objects: DrawFlexagonObjects,
    showFront: boolean, showStructure: StructureType, showIds: boolean,
    showCurrent: boolean, showNumbers: boolean, showCenterMarker: boolean, rotation?: number
  ): Line[] {
    const leaflines = getLeafLines(objects.flexagon, objects.angleInfo, showFront, rotation);
    const content: LeafContent = { showLeafProps: true, showIds, face: showFront ? 'front' : 'back', inset: 0.1 };
    drawStrip(paint, leaflines, content, objects.leafProps, undefined, 0, undefined, true/*center*/);

    const transform = getTransform(paint, leaflines, showFront);
    const hinges = getHingeLines(leaflines, transform);
    const minSide = getMinSide(paint);
    if (showCurrent) {
      drawCurrentMarker(paint, hinges[0], minSide / 12);
    }
    if (showStructure !== StructureType.None) {
      const centers = getCenterPoints(leaflines, transform);
      drawPatStructures(paint, minSide / 35, centers, objects.flexagon, showStructure);
    }

    return hinges;
  }

  /** use directions & angles to figure out how to draw the flexagon surface */
  function getLeafLines(flexagon: Flexagon, angleInfo: FlexagonAngles, showFront: boolean, rotation?: number): LeafLines {
    // for 'back', drawStrip assumes it needs to negate the ids, so we need to adjust here
    const ids = showFront ? flexagon.getTopIds() : flexagon.getBottomIds().map(id => -id);
    const leafs = getAsLeafs(flexagon.getPatCount(), ids, flexagon.directions);
    const angles = angleInfo.getUnfoldedAngles(flexagon, leafs);
    const leaflines = leafsToLines(leafs, toRadians(angles[0]), toRadians(angles[1]));
    if (rotation === undefined) {
      return leaflines;
    } else {
      return rotateLeafLines(leaflines, toRadians(rotation));
    }
  }

  /** turn raw flexagon info into a form used to generate lines to draw  */
  function getAsLeafs(patCount: number, ids: number[], directions?: Directions): Leaf[] {
    const leafs: Leaf[] = [];
    for (let i = 0; i < patCount; i++) {
      const isClock = directions ? directions.isDown(i) : true;
      leafs.push({ id: ids[i], top: 0, bottom: 0, isClock });
    }
    return leafs;
  }

  function getTransform(paint: Paint, leaflines: LeafLines, showFront: boolean): Transform {
    const [w, h] = paint.getSize();
    const extents: [Point, Point] = getExtents(leaflines);
    return Transform.make({ x: w, y: h }, extents[0], extents[1], !showFront, undefined, 1, true/*center*/);
  }

  /** transform raw folds in abstract coordinates into hinge lines in pixels */
  function getHingeLines(leaflines: LeafLines, transform: Transform): Line[] {
    const lines = leaflines.folds.map(hinge => {
      return {
        a: transform.apply(hinge.a), b: transform.apply(hinge.b)
      }
    });
    return lines;
  }

  /** transform raw triangular faces in abstract coordinates into center points in pixels */
  function getCenterPoints(leaflines: LeafLines, transform: Transform): Point[] {
    const centers = leaflines.faces.map(face => {
      const center = getIncenter(face.corners[0], face.corners[1], face.corners[2]);
      const centerPix = transform.apply(center);
      return { x: centerPix.x, y: centerPix.y }
    });
    return centers;
  }

  function getMinSide(paint: Paint): number {
    const [w, h] = paint.getSize();
    return Math.min(w, h);
  }

  function setTextProps(paint: Paint, fontsize: number) {
    paint.setTextColor("black");
    paint.setTextHorizontal("center");
    paint.setTextVertical("middle");
    paint.setTextSize(fontsize);
  }

  /** put a * at the current hinge */
  function drawCurrentMarker(paint: Paint, line: Line, fontsize: number) {
    setTextProps(paint, fontsize);
    const x = (line.a.x + line.b.x) / 2;
    const y = (line.a.y + line.b.y) / 2;
    paint.drawText('⚹', x, y);
  }

  /** draw pat structure, like [-[--]], near the centers of the faces */
  function drawPatStructures(paint: Paint, fontsize: number, centers: Point[], flexagon: Flexagon, patstructure: StructureType) {
    if (patstructure === StructureType.None) {
      return;
    }
    setTextProps(paint, fontsize);
    for (let i = 0; i < flexagon.getPatCount(); i++) {
      const pat = flexagon.pats[i];
      const structure: string = patstructure === StructureType.All
        ? pat.getStructure()
        : pat.getStructureLTEId(flexagon.getPatCount());
      paint.drawText(structure, centers[i].x, centers[i].y + 15);
    }
  }
}
