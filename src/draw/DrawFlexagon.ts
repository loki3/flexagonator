namespace Flexagonator {

  export enum StructureType {
    None,
    All,
    TopIds,  // only show structure when id <= numpats
  }

  export function drawFlexagon(paint: Paint, flexagon: Flexagon, polygon: Polygon,
    props: PropertiesForLeaves, front: boolean, patstructure: StructureType, showids: boolean,
    showCurrent?: boolean, showNumbers?: boolean, showCenterMarker?: boolean, scaleStructure?: number
  ) {

    const markerText = polygon.radius / 6;
    const largeText = polygon.radius / (flexagon.getPatCount() >= 10 ? 6 : 5);
    const smallText = polygon.radius / 14;
    const patText = scaleStructure ? smallText * scaleStructure : smallText;
    const ids = front ? flexagon.getTopIds() : flexagon.getBottomIds().reverse();

    if (props !== undefined) {
      drawFaceProps(paint, polygon, props, ids);
    }

    paint.setLineColor(0x5a96d2);
    const corners = polygon.getCorners();
    drawPolygon(paint, corners);
    drawSpokes(paint, corners, polygon.xCenter, polygon.yCenter);
    if (showCurrent === undefined || showCurrent) {
      drawText(paint, markerText, corners[0], corners[1], "*");
    }

    if (showNumbers === undefined || showNumbers) {
      drawFaceText(paint, largeText, polygon.getFaceCenters(0.6), ids, props);
    }
    if (showids && props !== undefined) {
      drawFaceText(paint, smallText, polygon.getFaceCenters(0.3), ids);
    }
    if (patstructure !== StructureType.None) {
      drawPatStructures(paint, patText, polygon.getFaceCenters(1.05), flexagon, patstructure, front);
    }
    if (showCenterMarker) {
      drawCenterMarker(paint, markerText, polygon, flexagon.angleTracker.oldCorner);
    }
  }

  function drawFaceProps(paint: Paint, polygon: Polygon, props: PropertiesForLeaves, ids: number[]) {
    const triangles = polygon.getLeafTriangles();
    for (const i in triangles) {
      const leafId = ids[i];
      const color = props.getColorAsRGBString(leafId);
      if (color !== undefined) {
        const t = triangles[i];
        paint.setFillColor(color);
        paint.drawPolygon([{ x: t.x1, y: t.y1 }, { x: t.x2, y: t.y2 }, { x: t.x3, y: t.y3 }], "fill");
      }
    }
  }

  function drawPolygon(paint: Paint, corners: number[]) {
    const points: Point[] = [];
    for (let i = 0; i < corners.length; i += 2) {
      points.push({ x: corners[i], y: corners[i + 1] });
    }
    paint.drawPolygon(points);
  }

  function drawSpokes(paint: Paint, corners: number[], xCenter: number, yCenter: number) {
    for (let i = 0; i < corners.length; i += 2) {
      paint.drawLines([{ x: xCenter, y: yCenter }, { x: corners[i], y: corners[i + 1] }]);
      if (i === 0) {
        paint.drawLines([{ x: corners[0], y: corners[1] }, { x: corners[corners.length - 2], y: corners[corners.length - 1] }]);
      } else {
        paint.drawLines([{ x: corners[i - 2], y: corners[i - 1] }, { x: corners[i], y: corners[i + 1] }]);
      }
    }
  }

  function setTextProps(paint: Paint, fontsize: number) {
    paint.setTextColor("black");
    paint.setTextHorizontal("center");
    paint.setTextVertical("middle");
    paint.setTextSize(fontsize);
  }

  function drawPatStructures(
    paint: Paint, fontsize: number, centers: number[], flexagon: Flexagon, patstructure: StructureType, front: boolean
  ) {
    if (patstructure === StructureType.None) {
      return;
    }
    setTextProps(paint, fontsize);
    const count = flexagon.getPatCount();
    for (let i = 0; i < count; i++) {
      const pat = flexagon.pats[front ? i : count - i - 1];
      const structure: string = patstructure === StructureType.All
        ? pat.getStructure()
        : pat.getStructureLTEId(flexagon.getPatCount());
      paint.drawText(structure, centers[i * 2], centers[i * 2 + 1]);
    }
  }

  function drawFaceText(paint: Paint, fontsize: number, centers: number[], ids: number[], props?: PropertiesForLeaves) {
    setTextProps(paint, fontsize);
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const label = props === undefined ? id.toString() : props.getFaceLabel(id) || id.toString();
      paint.drawText(label, centers[i * 2], centers[i * 2 + 1]);
    }
  }

  function drawCenterMarker(paint: Paint, fontsize: number, polygon: Polygon, whichVertex: number) {
    const centers = polygon.getCenterMarkers(whichVertex);
    for (let i = 0; i < centers.length; i += 2) {
      drawText(paint, fontsize, centers[i], centers[i + 1], "⚹");
    }
  }

  function drawText(paint: Paint, fontsize: number, x: number, y: number, text: string) {
    setTextProps(paint, fontsize);
    paint.drawText(text, x, y);
  }

}
