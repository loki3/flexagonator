namespace Flexagonator {

  export function drawFlexagon(canvasId: string, flexagon: Flexagon) {
    const output: HTMLCanvasElement = document.getElementById(canvasId) as HTMLCanvasElement;
    const ctx = output.getContext("2d") as CanvasRenderingContext2D;

    const xCenter = 200;
    const yCenter = 150;
    const radius = 100;

    ctx.clearRect(xCenter - radius, yCenter - radius * 1.1, xCenter + radius, yCenter + radius);

    const polygon = new Polygon(flexagon.getPatCount(), xCenter, yCenter, radius);

    ctx.strokeStyle = "rgb(90, 150, 210)";
    const corners = polygon.getCorners();
    drawPolygon(ctx, corners);
    drawSpokes(ctx, corners, xCenter, yCenter);
    drawText(ctx, 25, corners[0], corners[1], "*");

    drawFaceText(ctx, polygon.getFaceCenters(0.6), flexagon.getTopIds(), 20);
    drawFaceText(ctx, polygon.getFaceCenters(0.3), [1, 2, 3, 4, 5, 6], 12);
    drawFaceText(ctx, polygon.getFaceCenters(1.05), flexagon.getThickness(), 12);
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

  function drawFaceText(ctx: CanvasRenderingContext2D, centers: number[], ids: number[], fontsize: number) {
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
