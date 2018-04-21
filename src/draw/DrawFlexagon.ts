namespace Flexagonator {

  export function drawFlexagon(ctx: CanvasRenderingContext2D, flexagon: Flexagon, polygon: Polygon) {
    const markerText = polygon.radius / 6;
    const largeText = polygon.radius / 8;
    const smallText = polygon.radius / 14;

    ctx.strokeStyle = "rgb(90, 150, 210)";
    const corners = polygon.getCorners();
    drawPolygon(ctx, corners);
    drawSpokes(ctx, corners, polygon.xCenter, polygon.yCenter);
    drawText(ctx, markerText, corners[0], corners[1], "*");

    drawFaceText(ctx, largeText, polygon.getFaceCenters(0.6), flexagon.getTopIds());
    drawFaceText(ctx, smallText, polygon.getFaceCenters(0.3), [1, 2, 3, 4, 5, 6]);
    drawPatStructures(ctx, smallText, polygon.getFaceCenters(1.05), flexagon);
  }

  function drawPolygon(ctx: CanvasRenderingContext2D, corners: number[]) {
    ctx.moveTo(corners[0], corners[1]);
    for (var i = 2; i < corners.length; i += 2) {
      ctx.lineTo(corners[i], corners[i + 1]);
    }
    ctx.lineTo(corners[0], corners[1]);
    ctx.stroke();
  }

  function drawSpokes(ctx: CanvasRenderingContext2D, corners: number[], xCenter: number, yCenter: number) {
    for (var i = 0; i < corners.length; i += 2) {
      ctx.moveTo(xCenter, yCenter);
      ctx.lineTo(corners[i], corners[i + 1]);
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
    for (var i = 0; i < flexagon.getPatCount(); i++) {
      const structure: string = flexagon.pats[i].getStructure();
      ctx.fillText(structure, centers[i * 2], centers[i * 2 + 1]);
    }
  }

  function drawFaceText(ctx: CanvasRenderingContext2D, fontsize: number, centers: number[], ids: number[]) {
    setTextProps(ctx, fontsize);
    for (var i = 0; i < ids.length; i++) {
      ctx.fillText(ids[i].toString(), centers[i * 2], centers[i * 2 + 1]);
    }
  }

  function drawText(ctx: CanvasRenderingContext2D, fontsize: number, x: number, y: number, text: string) {
    setTextProps(ctx, fontsize);
    ctx.fillText(text, x, y);
  }

}
