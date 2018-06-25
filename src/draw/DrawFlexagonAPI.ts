namespace Flexagonator {

  // information about the display properties a given flexagon
  export interface DrawFlexagonObjects {
    readonly flexagon: Flexagon;
    readonly angleInfo: FlexagonAngles;
    readonly leafProps: PropertiesForLeaves;
    readonly allFlexes: Flexes;
    readonly flexesToSearch: Flexes;
  }

  // list of different options for what should be drawn for a flexagon
  export interface DrawFlexagonOptions {
    readonly back?: boolean;        // draw front or back - default: false (front)
    readonly stats?: boolean;       // show stats - default: false
    readonly flexes?: boolean;      // show possible flexes at corners - default: false
    readonly structure?: boolean;   // show pat structure - default: false
    readonly drawover?: boolean;    // draw over canvas or clear first - default: false
  }

  // draw a flexagon in its current state, with optional colors, flexes, etc.
  export function drawEntireFlexagon(canvasId: string, fm: FlexagonManager, options: DrawFlexagonOptions): ScriptButtons {
    const objects = {
      flexagon: fm.flexagon,
      angleInfo: fm.getAngleInfo(),
      leafProps: fm.leafProps,
      allFlexes: fm.allFlexes,
      flexesToSearch: fm.flexesToSearch,
    };
    return drawEntireFlexagonObjects(canvasId, objects, options);
  }

  function drawEntireFlexagonObjects(canvasId: string, objects: DrawFlexagonObjects, options: DrawFlexagonOptions): ScriptButtons {
    const output: HTMLCanvasElement = document.getElementById(canvasId) as HTMLCanvasElement;
    const ctx = output.getContext("2d") as CanvasRenderingContext2D;

    if (options.drawover === undefined || !options.drawover) {
      ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
    }

    const xCenter = ctx.canvas.clientWidth / 2;
    const yCenter = ctx.canvas.clientHeight / 2;
    const radius = ctx.canvas.clientHeight * 0.42;

    const showFront = (options.back === undefined || !options.back);
    const angles = objects.angleInfo.getAngles(objects.flexagon);
    const polygon = new Polygon(objects.flexagon.getPatCount(), xCenter, yCenter, radius, angles, showFront);

    const showStructure = (options.structure !== undefined && options.structure);
    drawFlexagon(ctx, objects.flexagon, polygon, objects.leafProps, showFront, showStructure);
    if (options.stats !== undefined && options.stats) {
      drawStatsText(ctx, objects.flexagon, objects.angleInfo);
    }
    if (options.flexes !== undefined && options.flexes) {
      return drawPossibleFlexes(ctx, objects.flexagon, objects.allFlexes, objects.flexesToSearch, polygon);
    }
    return new ScriptButtons([]);
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
