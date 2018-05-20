namespace Flexagonator {

  export interface DrawFlexagonOptions {
    drawover: boolean;    // draw over canvas or clear first - default: false
    back: boolean;        // draw front or back - default: false (front)
    stats: boolean;       // show stats - default: false
    flexes: boolean;      // show possible flexes at corners - default: false
    structure: boolean;   // show pat structure - default: false
  }

  export function drawEntireFlexagon(canvasId: string, fm: FlexagonManager, options: DrawFlexagonOptions): ScriptButtons {
    const output: HTMLCanvasElement = document.getElementById(canvasId) as HTMLCanvasElement;
    const ctx = output.getContext("2d") as CanvasRenderingContext2D;

    if (options.drawover === undefined || !options.drawover) {
      ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
    }

    const xCenter = ctx.canvas.clientWidth / 2;
    const yCenter = ctx.canvas.clientHeight / 2;
    const radius = ctx.canvas.clientHeight * 0.42;

    const polygon = new Polygon(fm.flexagon.getPatCount(), xCenter, yCenter, radius, fm.getAngles());
    const showFront = (options.back === undefined || !options.back);
    const showStructure = (options.structure !== undefined && options.structure);
    drawFlexagon(ctx, fm.flexagon, polygon, fm.leafProps, showFront, showStructure);
    if (options.stats !== undefined && options.stats) {
      drawStatsText(ctx, fm);
    }
    if (options.flexes !== undefined && options.flexes) {
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
