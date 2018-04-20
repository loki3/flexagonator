namespace Flexagonator {

  export function drawFlexagon(canvasId: string, flexagon: Flexagon) {
    const output: HTMLCanvasElement = document.getElementById(canvasId) as HTMLCanvasElement;
    const ctx = output.getContext("2d") as CanvasRenderingContext2D;
    ctx.strokeStyle = "rgb(90, 150, 210)";

    const xCenter = 200;
    const yCenter = 150;
    const polygon = new Polygon(flexagon.getPatCount(), xCenter, yCenter, 100);

    const corners = polygon.getCorners();
    drawPolygon(ctx, corners);
    drawSpokes(ctx, corners, xCenter, yCenter);

    drawLabels(ctx, polygon.getFaceCenters(), flexagon.getTopIds());
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

  function drawLabels(ctx: CanvasRenderingContext2D, centers: number[], ids: number[]) {
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "20px sans-serif";
    for (var i = 0; i < ids.length; i++) {
      ctx.fillText(ids[i].toString(), centers[i * 2], centers[i * 2 + 1]);
    }
  }

}
