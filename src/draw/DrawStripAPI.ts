namespace Flexagonator {

  // information about how the display properties of a given unfolded flexagon strip
  export interface DrawStripObjects {
    readonly flexagon: Flexagon;
    readonly angleInfo: FlexagonAngles;
    readonly directions?: boolean[] | string;
    readonly leafProps: PropertiesForLeaves;
  }

  export enum StripContent {
    FoldingLabels,  // put everything on one side, use labels that indicate folding order
    FoldingAndIds,  // FoldingLabels plus ids
    Front,          // only display what's on the front side, use leaf properties
    Back,           // only display what's on the back side, use leaf properties
    LeafLabels,     // put everything on one side, use labels from the leaf properties
    LabelsAndFolding, // put everything on one side, use labels from the leaf properties plus folding order
    Empty,          // don't label the leaves
  }

  // put an extra caption on the specified leaf
  export interface DrawStripCaption {
    readonly text: string;  // text to display
    readonly which: number; // if >=0, offset from the start, else offset from the end
  }

  export interface DrawStripOptions {
    readonly content?: StripContent;
    // [optional] indices for the first & last leaves to draw
    readonly start?: number;
    readonly end?: number;
    // [optional] scale factor (approximately the number of pixels on a leaf edge)
    readonly scale?: number;
    // [optional] rotation (degrees) to apply when drawing
    readonly rotation?: number;
    // [optional] extra captions to draw on the strip
    readonly captions?: DrawStripCaption[];
  }

  // draw an unfolded flexagon strip
  export function drawUnfolded(canvas: string | HTMLCanvasElement, fm: FlexagonManager, options?: DrawStripOptions) {
    const directions = fm.getDirections();
    const objects = {
      flexagon: fm.flexagon,
      angleInfo: fm.getAngleInfo(),
      directions: directions ? directions.asRaw() : undefined,
      leafProps: fm.leafProps,
    };
    return drawUnfoldedObjects(canvas, objects, options);
  }

  export function drawUnfoldedObjects(canvas: string | HTMLCanvasElement, objects: DrawStripObjects, options?: DrawStripOptions) {
    const isCanvas = (canvas as HTMLCanvasElement).getContext !== undefined;
    const output: HTMLCanvasElement = isCanvas ? canvas as HTMLCanvasElement : document.getElementById(canvas as string) as HTMLCanvasElement;
    const ctx = output.getContext("2d") as CanvasRenderingContext2D;
    // when the canvas is being emulated (e.g. jsPDF), client size may not be present
    const [w, h] = ctx.canvas.clientWidth ? [ctx.canvas.clientWidth, ctx.canvas.clientHeight] : [output.width, output.height];
    ctx.clearRect(0, 0, w, h);

    const directions = objects.directions ? Directions.make(objects.directions) : undefined;
    const unfolded = unfold(objects.flexagon.getAsLeafTrees(), directions);
    if (isTreeError(unfolded)) {
      console.log("error unfolding flexagon");
      console.log(unfolded);
      return;
    }

    if (!options) {
      options = {};
    }
    const content = options.content === undefined ? StripContent.FoldingLabels : options.content;
    const angles = objects.angleInfo.getUnfoldedAngles(objects.flexagon, unfolded);
    const leaflines = leafsToLines(unfolded, toRadians(angles[0]), toRadians(angles[1]));
    const leaflinesSubset = sliceLeafLines(leaflines, options.start, options.end);
    drawStrip(ctx, { x: w, y: h }, leaflinesSubset, content, objects.leafProps, options.scale, options.rotation, options.captions);
  }

}
