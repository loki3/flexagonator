namespace Flexagonator {

  export function drawAll(canvasId: string, fm: FlexagonManager) {
    const output: HTMLCanvasElement = document.getElementById(canvasId) as HTMLCanvasElement;
    const ctx = output.getContext("2d") as CanvasRenderingContext2D;

    const xCenter = 300;
    const yCenter = 250;
    const radius = 200;
    ctx.clearRect(xCenter - radius, yCenter - radius * 1.1, xCenter + radius, yCenter + radius);

    const polygon = new Polygon(fm.flexagon.getPatCount(), xCenter, yCenter, radius);
    drawFlexagon(ctx, fm.flexagon, polygon);
    drawPossibleFlexes(ctx, fm, polygon);

  }

  function drawPossibleFlexes(ctx: CanvasRenderingContext2D, fm: FlexagonManager, polygon: Polygon) {
    const corners = polygon.getCorners();
    for (var i = 0; i < fm.flexagon.getPatCount(); i++) {
      const flexes: string[] = fm.checkForPrimeFlexes(false, i);
      const text = flexes.join(' ');

      ctx.fillStyle = "rgb(0, 0, 0)";
      ctx.textAlign = "left";
      ctx.textBaseline = "bottom";
      ctx.font = "17px sans-serif";
      ctx.fillText(text, corners[2 * i], corners[2 * i + 1]);
    }
  }

}
