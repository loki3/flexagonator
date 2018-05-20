namespace Flexagonator {

  export interface DrawFlexagonOptions {
    clear: boolean;       // clear the canvas before drawing - default: true
    front: boolean;       // draw front or back - default: front
    stats: boolean;       // show stats - default: false
    showFlexes: boolean;  // show possible flexes at corners: default: false
  }

  export function drawEntireFlexagon(canvasId: string, fm: FlexagonManager, options: DrawFlexagonOptions): ScriptButtons {
    const output: HTMLCanvasElement = document.getElementById(canvasId) as HTMLCanvasElement;
    const ctx = output.getContext("2d") as CanvasRenderingContext2D;

    if (options.clear === undefined || options.clear) {
      ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
    }

    const xCenter = ctx.canvas.clientWidth / 2;
    const yCenter = ctx.canvas.clientHeight / 2;
    const radius = ctx.canvas.clientHeight * 0.42;

    const polygon = new Polygon(fm.flexagon.getPatCount(), xCenter, yCenter, radius, fm.getAngles());
    const showFront = (options.front === undefined || options.front);
    drawFlexagon(ctx, fm.flexagon, polygon, fm.leafProps, showFront);
    if (options.stats !== undefined && options.stats) {
      drawStatsText(ctx, fm);
    }
    if (options.showFlexes !== undefined && options.showFlexes) {
      return drawPossibleFlexes(ctx, fm, polygon);
    }
    return new ScriptButtons();
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
