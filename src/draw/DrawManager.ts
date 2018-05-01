namespace Flexagonator {

  export function drawAll(flexCanvasId: string, stripCanvasId: string, fm: FlexagonManager) {
    drawEntireFlexagon(flexCanvasId, fm);
    drawUnfolded(stripCanvasId, fm);
  }

  function drawEntireFlexagon(canvasId: string, fm: FlexagonManager) {
    const output: HTMLCanvasElement = document.getElementById(canvasId) as HTMLCanvasElement;
    const ctx = output.getContext("2d") as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

    const xCenter = ctx.canvas.clientWidth / 2;
    const yCenter = ctx.canvas.clientHeight / 2;
    const radius = ctx.canvas.clientHeight * 0.42;

    const polygon = new Polygon(fm.flexagon.getPatCount(), xCenter, yCenter, radius, fm.getAngles());
    drawFlexagon(ctx, fm.flexagon, polygon, fm.leafProps);
    drawPossibleFlexes(ctx, fm, polygon);
  }

  function drawUnfolded(canvasId: string, fm: FlexagonManager) {
    const output: HTMLCanvasElement = document.getElementById(canvasId) as HTMLCanvasElement;
    const ctx = output.getContext("2d") as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, 800, 600);

    const unfolded = unfold(fm.flexagon.getAsLeafTrees());
    if (isTreeError(unfolded)) {
      console.log("error unfolding flexagon");
      console.log(unfolded);
      return;
    }

    const angles = fm.getAngles();
    const leaflines = leafsToLines(unfolded, toRadians(angles[0]), toRadians(angles[1]));
    drawStrip(ctx, leaflines, StripContent.FoldingLabels, fm.leafProps);
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
