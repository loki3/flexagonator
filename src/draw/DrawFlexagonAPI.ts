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
    readonly structure?: boolean;   // show pat structure - default: false
    readonly drawover?: boolean;    // draw over canvas or clear first - default: false
  }

  // draw a flexagon in its current state, with optional colors, flexes, etc.
  export function drawEntireFlexagon(
    canvas: string | HTMLCanvasElement,
    fm: FlexagonManager,
    options: DrawFlexagonOptions): RegionForFlexes[] {

    const objects = {
      flexagon: fm.flexagon,
      angleInfo: fm.getAngleInfo(),
      leafProps: fm.leafProps,
      allFlexes: fm.allFlexes,
      flexesToSearch: fm.flexesToSearch,
    };
    return drawEntireFlexagonObjects(canvas, objects, options);
  }

  function drawEntireFlexagonObjects(
    canvas: string | HTMLCanvasElement,
    objects: DrawFlexagonObjects,
    options: DrawFlexagonOptions): RegionForFlexes[] {

    const output: HTMLCanvasElement = canvas instanceof HTMLCanvasElement ? canvas : document.getElementById(canvas) as HTMLCanvasElement;
    const ctx = output.getContext("2d") as CanvasRenderingContext2D;

    if (options.drawover === undefined || !options.drawover) {
      ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
    }

    const showFront = (options.back === undefined || !options.back);
    const polygon = createPolygon(ctx, objects.flexagon, objects.angleInfo, showFront);

    const showStructure = (options.structure !== undefined && options.structure);
    drawFlexagon(ctx, objects.flexagon, polygon, objects.leafProps, showFront, showStructure);
    if (options.stats !== undefined && options.stats) {
      drawStatsText(ctx, objects.flexagon, objects.angleInfo);
    }

    return createFlexRegions(objects.flexagon, objects.allFlexes, objects.flexesToSearch, !showFront, polygon);
  }

  // draw the possible flexes and return buttons describing them
  export function drawScriptButtons(
    canvas: string | HTMLCanvasElement,
    flexagon: Flexagon,
    angleInfo: FlexagonAngles,
    showFront: boolean,
    regions: RegionForFlexes[]): ScriptButtons {

    const output: HTMLCanvasElement = canvas instanceof HTMLCanvasElement ? canvas : document.getElementById(canvas) as HTMLCanvasElement;
    const ctx = output.getContext("2d") as CanvasRenderingContext2D;

    const polygon = createPolygon(ctx, flexagon, angleInfo, showFront);
    const height = polygon.radius / 9;
    return drawPossibleFlexes(ctx, regions, height);
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

  function createPolygon(
    ctx: CanvasRenderingContext2D,
    flexagon: Flexagon,
    angleInfo: FlexagonAngles,
    showFront: boolean): Polygon {

    const xCenter = ctx.canvas.clientWidth / 2;
    const yCenter = ctx.canvas.clientHeight / 2;
    const radius = ctx.canvas.clientHeight * 0.42;

    const angles = angleInfo.getAngles(flexagon);
    return new Polygon(flexagon.getPatCount(), xCenter, yCenter, radius, angles, showFront);
  }
}
