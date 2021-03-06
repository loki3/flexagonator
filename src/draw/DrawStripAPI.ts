namespace Flexagonator {

  // information about how the display properties of a given unfolded flexagon strip
  export interface DrawStripObjects {
    readonly flexagon: Flexagon;
    readonly angleInfo: FlexagonAngles;
    readonly directions?: boolean[] | string;
    readonly leafProps: PropertiesForLeaves;
  }

  // which labels to draw on the leaves
  export interface LeafContent {
    /** draw both front and back labels, or just front, or just back: default 'both' */
    readonly face?: 'both' | 'front' | 'back';
    /** draw labels that show folding order; default false */
    readonly showFoldingOrder?: boolean;
    /** draw labels and colors from leaf properties; default false */
    readonly showLeafProps?: boolean;
    /** draw leaf ids; default false */
    readonly showIds?: boolean;
  }

  // deprecated: use LeafContent instead
  export enum StripContent {
    FoldingLabels,  // showFoldingOrder: true
    FoldingAndIds,  // showFoldingOrder: true, showIds: true
    Front,          // face: 'front', showLeafProps: true
    Back,           // face: 'back', showLeafProps: true
    LeafLabels,     // showLeafProps: true
    LabelsAndFolding, // showLeafProps: true, showFoldingOrder: true
    Empty,          // don't label the leaves
  }

  // put an extra caption on the specified leaf
  export interface DrawStripCaption {
    readonly text: string;  // text to display
    readonly which: number; // if >=0, offset from the start, else offset from the end
  }

  export interface DrawStripOptions {
    // [optional] which labels to draw on the leaves, defaults to showFoldingOrder (StripContent is deprecated)
    readonly content?: LeafContent | StripContent;
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
    const content = getLeafContent(options.content);
    const angles = objects.angleInfo.getUnfoldedAngles(objects.flexagon, unfolded);
    const leaflines = leafsToLines(unfolded, toRadians(angles[0]), toRadians(angles[1]));
    const leaflinesSubset = sliceLeafLines(leaflines, options.start, options.end);
    drawStrip(ctx, { x: w, y: h }, leaflinesSubset, content, objects.leafProps, options.scale, options.rotation, options.captions);
  }

  // use showFoldingOrder if nothing specified
  function getLeafContent(content?: LeafContent | StripContent): LeafContent {
    switch (content) {
      case StripContent.FoldingLabels:
        return { showFoldingOrder: true };
      case StripContent.FoldingAndIds:
        return { showFoldingOrder: true, showIds: true };
      case StripContent.Front:
        return { face: 'front', showLeafProps: true };
      case StripContent.Back:
        return { face: 'back', showLeafProps: true };
      case StripContent.LeafLabels:
        return { showLeafProps: true };
      case StripContent.LabelsAndFolding:
        return { showLeafProps: true, showFoldingOrder: true };
      case StripContent.Empty:
        return {};
    }
    return content ? content : { showFoldingOrder: true };
  }

}
