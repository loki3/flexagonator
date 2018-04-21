namespace Flexagonator {

  export function drawAll(canvasId: string, fm: FlexagonManager) {
    const output: HTMLCanvasElement = document.getElementById(canvasId) as HTMLCanvasElement;
    const ctx = output.getContext("2d") as CanvasRenderingContext2D;

    const xCenter = 300;
    const yCenter = 250;
    const radius = 200;
    ctx.clearRect(xCenter - radius * 1.1, yCenter - radius * 1.1, xCenter + radius, yCenter + radius);

    const polygon = new Polygon(fm.flexagon.getPatCount(), xCenter, yCenter, radius);
    drawFlexagon(ctx, fm.flexagon, polygon);
    drawPossibleFlexes(ctx, fm, polygon);

  }

  function drawPossibleFlexes(ctx: CanvasRenderingContext2D, fm: FlexagonManager, polygon: Polygon) {
    ctx.font = (polygon.radius / 10) + "px sans-serif";

    const corners = polygon.getCorners();
    for (var i = 0; i < fm.flexagon.getPatCount(); i++) {
      const x = corners[i * 2];
      const y = corners[i * 2 + 1];

      ctx.fillStyle = "rgb(0, 0, 0)";
      ctx.textAlign = x > polygon.xCenter ? "left" : "right";
      ctx.textBaseline = y > polygon.yCenter ? "top" : "bottom";

      const flexes: string[] = fm.checkForPrimeFlexes(false, i);
      const text = flexes.join(' ');
      ctx.fillText(text, x, y);
    }
  }

}
