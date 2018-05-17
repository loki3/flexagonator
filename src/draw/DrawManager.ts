namespace Flexagonator {

  export function drawEntireFlexagon(canvasId: string, fm: FlexagonManager): ScriptButtons {
    const output: HTMLCanvasElement = document.getElementById(canvasId) as HTMLCanvasElement;
    const ctx = output.getContext("2d") as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

    const xCenter = ctx.canvas.clientWidth / 2;
    const yCenter = ctx.canvas.clientHeight / 2;
    const radius = ctx.canvas.clientHeight * 0.42;

    const polygon = new Polygon(fm.flexagon.getPatCount(), xCenter, yCenter, radius, fm.getAngles());
    drawFlexagon(ctx, fm.flexagon, polygon, fm.leafProps);
    drawStatsText(ctx, fm);
    return drawPossibleFlexes(ctx, fm, polygon);
  }

  export function drawUnfolded(canvasId: string, fm: FlexagonManager, content: StripContent) {
    const output: HTMLCanvasElement = document.getElementById(canvasId) as HTMLCanvasElement;
    const ctx = output.getContext("2d") as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, 800, 600);

    const unfolded = unfold(fm.flexagon.getAsLeafTrees());
    if (isTreeError(unfolded)) {
      console.log("error unfolding flexagon");
      console.log(unfolded);
      return;
    }

    const angles = fm.getUnfoldedAngles(unfolded);
    const leaflines = leafsToLines(unfolded, toRadians(angles[0]), toRadians(angles[1]));
    drawStrip(ctx, leaflines, content, fm.leafProps);
  }

  function drawStatsText(ctx: CanvasRenderingContext2D, fm: FlexagonManager) {
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.font = "14px sans-serif";

    const leafCount = fm.flexagon.getLeafCount();
    const leafText = leafCount.toString() + " leaves";
    ctx.fillText(leafText, 0, 20);

    const center = fm.getCenterAngleSum();
    if (center === CenterAngle.GreaterThan360) {
      ctx.fillText(">360, doesn't lie flat", 0, 40);
    } else if (center === CenterAngle.LessThan360) {
      ctx.fillText("<360, doesn't open fully", 0, 40);
    }
  }

}
