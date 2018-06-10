namespace Flexagonator {

  export interface DrawFlexagonOptions {
    readonly drawover: boolean;    // draw over canvas or clear first - default: false
    readonly back: boolean;        // draw front or back - default: false (front)
    readonly stats: boolean;       // show stats - default: false
    readonly flexes: boolean;      // show possible flexes at corners - default: false
    readonly structure: boolean;   // show pat structure - default: false
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

    const showFront = (options.back === undefined || !options.back);
    const angles = fm.getAngleInfo().getAngles(fm.flexagon);
    const polygon = new Polygon(fm.flexagon.getPatCount(), xCenter, yCenter, radius, angles, showFront);

    const showStructure = (options.structure !== undefined && options.structure);
    drawFlexagon(ctx, fm.flexagon, polygon, fm.leafProps, showFront, showStructure);
    if (options.stats !== undefined && options.stats) {
      drawStatsText(ctx, fm.flexagon, fm.getAngleInfo());
    }
    if (options.flexes !== undefined && options.flexes) {
      return drawPossibleFlexes(ctx, fm, polygon);
    }
    return new ScriptButtons();
  }

  function drawStatsText(ctx: CanvasRenderingContext2D, flexagon: Flexagon, angleInfo: FlexagonAngles) {
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.font = "14px sans-serif";

    const leafCount = flexagon.getLeafCount();
    const leafText = leafCount.toString() + " leaves";
    ctx.fillText(leafText, 0, 20);

    const center = angleInfo.getCenterAngleSum(flexagon);
    if (center === CenterAngle.GreaterThan360) {
      ctx.fillText(">360, doesn't lie flat", 0, 40);
    } else if (center === CenterAngle.LessThan360) {
      ctx.fillText("<360, doesn't open fully", 0, 40);
    }
  }
}
