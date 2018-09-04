namespace Flexagonator {

  export function drawFlexagon(ctx: CanvasRenderingContext2D, flexagon: Flexagon, polygon: Polygon,
    props: PropertiesForLeaves, front: boolean, patstructure: boolean, showids: boolean) {

    const markerText = polygon.radius / 6;
    const largeText = polygon.radius / 8;
    const smallText = polygon.radius / 14;
    const ids = front ? flexagon.getTopIds() : flexagon.getBottomIds().reverse();

    if (props !== undefined) {
      drawFaceProps(ctx, polygon, props, ids);
    }

    ctx.strokeStyle = "rgb(90, 150, 210)";
    const corners = polygon.getCorners();
    drawPolygon(ctx, corners);
    drawSpokes(ctx, corners, polygon.xCenter, polygon.yCenter);
    drawText(ctx, markerText, corners[0], corners[1], "*");

    drawFaceText(ctx, largeText, polygon.getFaceCenters(0.6), ids, props);
    if (showids && props !== undefined) {
      drawFaceText(ctx, smallText, polygon.getFaceCenters(0.3), ids);
    }
    if (patstructure) {
      drawPatStructures(ctx, smallText, polygon.getFaceCenters(1.05), flexagon);
    }
  }

  function drawFaceProps(ctx: CanvasRenderingContext2D, polygon: Polygon, props: PropertiesForLeaves, ids: number[]) {
    const triangles = polygon.getLeafTriangles();
    for (const i in triangles) {
      const leafId = ids[i];
      const color = props.getColorAsRGBString(leafId);
      if (color !== undefined) {
        const triangle = triangles[i];
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(triangle.x1, triangle.y1);
        ctx.lineTo(triangle.x2, triangle.y2);
        ctx.lineTo(triangle.x3, triangle.y3);
        ctx.closePath();
        ctx.fill();
      }
    }
  }

  function drawPolygon(ctx: CanvasRenderingContext2D, corners: number[]) {
    ctx.beginPath();
    ctx.moveTo(corners[0], corners[1]);
    for (let i = 2; i < corners.length; i += 2) {
      ctx.lineTo(corners[i], corners[i + 1]);
    }
    ctx.closePath();
    ctx.stroke();
  }

  function drawSpokes(ctx: CanvasRenderingContext2D, corners: number[], xCenter: number, yCenter: number) {
    ctx.beginPath();
    for (let i = 0; i < corners.length; i += 2) {
      ctx.moveTo(xCenter, yCenter);
      ctx.lineTo(corners[i], corners[i + 1]);
      ctx.closePath();
      ctx.stroke();
    }
  }

  function setTextProps(ctx: CanvasRenderingContext2D, fontsize: number) {
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = fontsize.toString() + "px sans-serif";
  }

  function drawPatStructures(ctx: CanvasRenderingContext2D, fontsize: number, centers: number[], flexagon: Flexagon) {
    setTextProps(ctx, fontsize);
    for (let i = 0; i < flexagon.getPatCount(); i++) {
      const structure: string = flexagon.pats[i].getStructure();
      ctx.fillText(structure, centers[i * 2], centers[i * 2 + 1]);
    }
  }

  function drawFaceText(ctx: CanvasRenderingContext2D, fontsize: number, centers: number[], ids: number[], props?: PropertiesForLeaves) {
    setTextProps(ctx, fontsize);
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const label = props === undefined ? id.toString() : props.getFaceLabel(id);
      ctx.fillText(label, centers[i * 2], centers[i * 2 + 1]);
    }
  }

  function drawText(ctx: CanvasRenderingContext2D, fontsize: number, x: number, y: number, text: string) {
    setTextProps(ctx, fontsize);
    ctx.fillText(text, x, y);
  }

}
