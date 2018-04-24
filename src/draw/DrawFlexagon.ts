namespace Flexagonator {

  export function drawFlexagon(ctx: CanvasRenderingContext2D, flexagon: Flexagon, polygon: Polygon, props?: LeafProperties[]) {
    const markerText = polygon.radius / 6;
    const largeText = polygon.radius / 8;
    const smallText = polygon.radius / 14;

    if (props !== undefined) {
      drawFaceProps(ctx, flexagon, polygon, props);
    }

    ctx.strokeStyle = "rgb(90, 150, 210)";
    const corners = polygon.getCorners();
    drawPolygon(ctx, corners);
    drawSpokes(ctx, corners, polygon.xCenter, polygon.yCenter);
    drawText(ctx, markerText, corners[0], corners[1], "*");

    drawFaceText(ctx, largeText, polygon.getFaceCenters(0.6), flexagon.getTopIds(), props);
    if (props !== undefined) {
      drawFaceText(ctx, smallText, polygon.getFaceCenters(0.3), flexagon.getTopIds());
    }
    drawPatStructures(ctx, smallText, polygon.getFaceCenters(1.05), flexagon);
  }

  function drawFaceProps(ctx: CanvasRenderingContext2D, flexagon: Flexagon, polygon: Polygon, props: LeafProperties[]) {
    const triangles = polygon.getLeafTriangles();
    const ids = flexagon.getTopIds();
    for (const i in triangles) {
      const leafId = ids[i];
      const leafProps = leafId > 0 ? props[leafId - 1] : props[-leafId - 1];
      if (leafProps === undefined) {
        continue;
      }
      const faceProps = leafId > 0 ? leafProps.front : leafProps.back;
      if (faceProps.color !== undefined) {
        const colorStr = numberToRGB(faceProps.color);
        const triangle = triangles[i];
        ctx.fillStyle = colorStr;
        ctx.beginPath();
        ctx.moveTo(triangle.x1, triangle.y1);
        ctx.lineTo(triangle.x2, triangle.y2);
        ctx.lineTo(triangle.x3, triangle.y3);
        ctx.closePath();
        ctx.fill();
      }
    }
  }

  function numberToRGB(color: number): string {
    return "rgb("
      + ((color & 0xff0000) >> 16).toString() + ","
      + ((color & 0xff00) >> 8).toString() + ","
      + (color & 0xff).toString() + ")";
  }

  function drawPolygon(ctx: CanvasRenderingContext2D, corners: number[]) {
    ctx.beginPath();
    ctx.moveTo(corners[0], corners[1]);
    for (var i = 2; i < corners.length; i += 2) {
      ctx.lineTo(corners[i], corners[i + 1]);
    }
    ctx.closePath();
    ctx.stroke();
  }

  function drawSpokes(ctx: CanvasRenderingContext2D, corners: number[], xCenter: number, yCenter: number) {
    ctx.beginPath();
    for (var i = 0; i < corners.length; i += 2) {
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
    for (var i = 0; i < flexagon.getPatCount(); i++) {
      const structure: string = flexagon.pats[i].getStructure();
      ctx.fillText(structure, centers[i * 2], centers[i * 2 + 1]);
    }
  }

  function getFaceLabel(id: number, props?: LeafProperties[]): string {
    if (props !== undefined && props[Math.abs(id) - 1] !== undefined) {
      const leafProps = props[Math.abs(id) - 1];
      if (leafProps !== undefined) {
        const label = id > 0 ? leafProps.front.label : leafProps.back.label;
        if (label !== undefined) {
          return label;
        }
      }
    }
    return id.toString();
  }

  function drawFaceText(ctx: CanvasRenderingContext2D, fontsize: number, centers: number[], ids: number[], props?: LeafProperties[]) {
    setTextProps(ctx, fontsize);
    for (var i = 0; i < ids.length; i++) {
      const label = getFaceLabel(ids[i], props);
      ctx.fillText(label, centers[i * 2], centers[i * 2 + 1]);
    }
  }

  function drawText(ctx: CanvasRenderingContext2D, fontsize: number, x: number, y: number, text: string) {
    setTextProps(ctx, fontsize);
    ctx.fillText(text, x, y);
  }

}
