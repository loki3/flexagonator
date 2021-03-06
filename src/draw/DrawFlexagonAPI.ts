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
    readonly both?: boolean;        // draw both front & back - default: false (front)
    readonly stats?: boolean;       // show stats - default: false
    readonly structure?: boolean;   // show pat structure - default: false
    readonly structureTopIds?: boolean; // show pat structure that includes ids <= numpats - default: false
    readonly drawover?: boolean;    // draw over canvas or clear first - default: false
    readonly showIds?: boolean;     // show leaf ids - default: true
    readonly showCurrent?: boolean; // show an indicator next to the current hinge - default: true
    readonly showNumbers?: boolean; // show the face numbers - default: true
    readonly generate?: boolean;    // include every flex with * added - default: false
  }

  // draw a flexagon in its current state, with optional colors, flexes, etc.
  export function drawEntireFlexagon(
    canvas: string | HTMLCanvasElement,
    fm: FlexagonManager,
    options?: DrawFlexagonOptions): RegionForFlexes[] {

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
    options?: DrawFlexagonOptions): RegionForFlexes[] {

    const output: HTMLCanvasElement = canvas instanceof HTMLCanvasElement ? canvas : document.getElementById(canvas) as HTMLCanvasElement;
    const ctx = output.getContext("2d") as CanvasRenderingContext2D;
    const [width, height] = [ctx.canvas.clientWidth, ctx.canvas.clientHeight];

    if (!options) {
      options = {}
    }
    if (options.drawover === undefined || !options.drawover) {
      ctx.clearRect(0, 0, width, height);
    }

    const showFront = (options.back === undefined || !options.back);
    const polygon = createPolygon(width, height, objects.flexagon, objects.angleInfo, showFront);

    const showStructure = getStructureType(options);
    const showIds = (options.showIds === undefined || options.showIds);
    const showCurrent = (options.showCurrent === undefined || options.showCurrent);
    const showNumbers = (options.showNumbers === undefined || options.showNumbers);
    drawFlexagon(ctx, objects.flexagon, polygon, objects.leafProps, showFront, showStructure, showIds, showCurrent, showNumbers);
    if (options.both) {
      const backpolygon = createBackPolygon(width, height, objects.flexagon, objects.angleInfo);
      drawFlexagon(ctx, objects.flexagon, backpolygon, objects.leafProps, false/*showFront*/, StructureType.None, false/*showIds*/);
    }
    if (options.stats !== undefined && options.stats) {
      drawStatsText(ctx, objects.flexagon, objects.angleInfo);
    }

    const generate = (options.generate !== undefined && options.generate);
    return createFlexRegions(objects.flexagon, objects.allFlexes, objects.flexesToSearch, !showFront, generate, polygon);
  }

  function getStructureType(options?: DrawFlexagonOptions): StructureType {
    if (options === undefined) {
      return StructureType.None
    }
    return options.structure ? StructureType.All : (options.structureTopIds ? StructureType.TopIds : StructureType.None);
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
    const [width, height] = [ctx.canvas.clientWidth, ctx.canvas.clientHeight];

    const polygon = createPolygon(width, height, flexagon, angleInfo, showFront);
    const bheight = polygon.radius / 9;
    return drawPossibleFlexes(ctx, regions, bheight);
  }

  export function getButtonRegions(fm: FlexagonManager, width: number, height: number, front: boolean, generate?: boolean
  ): RegionForFlexes[] {
    generate = (generate !== undefined && generate);
    const polygon = createPolygon(width, height, fm.flexagon, fm.getAngleInfo(), front);
    return createFlexRegions(fm.flexagon, fm.allFlexes, fm.flexesToSearch, !front, generate, polygon);
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
    width: number,
    height: number,
    flexagon: Flexagon,
    angleInfo: FlexagonAngles,
    showFront: boolean): Polygon {

    const xCenter = width / 2;
    const yCenter = height / 2;
    const radius = height * 0.42;

    const angles = angleInfo.getAngles(flexagon);
    return new Polygon(flexagon.getPatCount(), xCenter, yCenter, radius, angles, showFront);
  }

  function createBackPolygon(width: number, height: number, flexagon: Flexagon, angleInfo: FlexagonAngles): Polygon {
    const radius = height * 0.2;
    const xCenter = width - radius;
    const yCenter = height - radius;

    const angles = angleInfo.getAngles(flexagon);
    return new Polygon(flexagon.getPatCount(), xCenter, yCenter, radius, angles, false/*showFront*/);
  }
}
