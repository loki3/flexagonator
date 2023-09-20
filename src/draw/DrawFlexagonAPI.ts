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
    readonly showCenterMarker?: boolean; // show a marker on every leaf for where original center corner now is - default: false
    readonly generate?: boolean;    // include every flex with * added - default: false
    readonly scale?: number;        // scale factor - default: 1
    readonly rotate?: number;       // amount to rotate flexagon (degrees) - default: 0
  }

  // draw a flexagon in its current state, with optional colors, flexes, etc.
  export function drawEntireFlexagon(
    canvas: string | HTMLCanvasElement,
    fm: FlexagonManager,
    options?: DrawFlexagonOptions
  ): RegionForFlexes[] {
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
    target: string | HTMLCanvasElement,
    objects: DrawFlexagonObjects,
    options?: DrawFlexagonOptions
  ): RegionForFlexes[] {
    const paint = newPaint(target);
    if (paint === null) {
      return [];
    }
    const [width, height] = paint.getSize();

    if (!options) {
      options = {}
    }
    if (options.drawover === undefined || !options.drawover) {
      paint.start();
    } else {
      paint.start("dontClear");
    }

    const showFront = (options.back === undefined || !options.back);
    const rotate = options.rotate === undefined ? options.rotate : (showFront ? options.rotate : -options.rotate);
    const polygon = createPolygon(width, height, objects.flexagon, objects.angleInfo, showFront, options.scale, rotate);

    const showStructure = getStructureType(options);
    const showIds = (options.showIds === undefined || options.showIds);
    const showCurrent = (options.showCurrent === undefined || options.showCurrent);
    const showNumbers = (options.showNumbers === undefined || options.showNumbers);
    const showCenterMarker = options.showCenterMarker === undefined ? false : options.showCenterMarker;

    let hinges = undefined;
    if (objects.flexagon.directions !== undefined) {
      hinges = drawWithDirections(paint, objects, showFront, showStructure, showIds, showCurrent, rotate);
      if (options.stats !== undefined && options.stats) {
        drawLeafCount(paint, objects.flexagon);
      }
    } else {
      drawFlexagon(paint, objects.flexagon, polygon, objects.leafProps, showFront, showStructure, showIds, showCurrent, showNumbers, showCenterMarker);
      if (options.both) {
        const backpolygon = createBackPolygon(width, height, objects.flexagon, objects.angleInfo);
        drawFlexagon(paint, objects.flexagon, backpolygon, objects.leafProps, false/*showFront*/, StructureType.None, false/*showIds*/);
      }
      if (options.stats !== undefined && options.stats) {
        drawLeafCount(paint, objects.flexagon);
        drawAnglesText(paint, objects.flexagon, objects.angleInfo);
      }
    }

    paint.end();

    const generate = (options.generate !== undefined && options.generate);
    return createFlexRegions(objects.flexagon, objects.allFlexes, objects.flexesToSearch, !showFront, generate, polygon, hinges);
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
    regions: RegionForFlexes[]
  ): ScriptButtons {
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

  function drawLeafCount(paint: Paint, flexagon: Flexagon) {
    paint.setTextColor("black");
    paint.setTextHorizontal("left");
    paint.setTextVertical("bottom");
    paint.setTextSize(14);

    const leafCount = flexagon.getLeafCount();
    const leafText = leafCount.toString() + " leaves";
    paint.drawText(leafText, 0, 20);
  }

  function drawAnglesText(paint: Paint, flexagon: Flexagon, angleInfo: FlexagonAngles) {
    const center = angleInfo.getCenterAngleSum(flexagon);
    if (center === CenterAngle.GreaterThan360) {
      paint.drawText(">360, doesn't lie flat", 0, 40);
    } else if (center === CenterAngle.LessThan360) {
      paint.drawText("<360, doesn't open fully", 0, 40);
    }
  }

  function createPolygon(
    width: number,
    height: number,
    flexagon: Flexagon,
    angleInfo: FlexagonAngles,
    showFront: boolean,
    scale?: number,
    rotate?: number,
  ): Polygon {
    const xCenter = width / 2;
    const yCenter = height / 2;
    const possible = height * 0.42 * (scale === undefined ? 1 : scale);
    const radius = Math.min(possible, Math.max(width / 2, height / 2)); // cap scaled size so it fits in box

    const angles = angleInfo.getAngles(flexagon);
    return new Polygon(flexagon.getPatCount(), xCenter, yCenter, radius, angles, showFront, rotate);
  }

  function createBackPolygon(width: number, height: number, flexagon: Flexagon, angleInfo: FlexagonAngles): Polygon {
    const radius = height * 0.2;
    const xCenter = width - radius;
    const yCenter = height - radius;

    const angles = angleInfo.getAngles(flexagon);
    return new Polygon(flexagon.getPatCount(), xCenter, yCenter, radius, angles, false/*showFront*/);
  }
}
