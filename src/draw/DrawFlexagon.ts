namespace Flexagonator {

  export function drawFlexagon(canvasId: string, numSides: number) {
    const output: HTMLCanvasElement = document.getElementById(canvasId) as HTMLCanvasElement;
    const ctx = output.getContext("2d") as CanvasRenderingContext2D;
    ctx.strokeStyle = "rgb(90, 150, 210)";

    const xCenter = 200;
    const yCenter = 150;
    const corners = createPolygon(numSides, xCenter, yCenter, 100);
    drawPolygon(ctx, corners);
    drawSpokes(ctx, corners, xCenter, yCenter);
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

}
