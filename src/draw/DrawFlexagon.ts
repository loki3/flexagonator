namespace Flexagonator {

  export function drawFlexagon(canvasId: string, numSides: number) {
    const output: HTMLCanvasElement = document.getElementById(canvasId) as HTMLCanvasElement;
    const ctx = output.getContext("2d") as CanvasRenderingContext2D;
    ctx.strokeStyle = "rgb(90, 150, 210)";

    const corners = createPolygon(numSides, 200, 200, 100);
    drawPolygon(ctx, corners);
  }

  function drawPolygon(ctx: CanvasRenderingContext2D, corners: number[]) {
    ctx.moveTo(corners[0], corners[1]);
    for (var i = 2; i < corners.length; i += 2) {
      ctx.lineTo(corners[i], corners[i + 1]);
    }
    ctx.lineTo(corners[0], corners[1]);
    ctx.stroke();
  }

}
