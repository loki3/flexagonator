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
    /** if filling colors, this is the fractional amount to inset the solid (1,0], default 0 */
    readonly inset?: number;
    /** the style to use for drawing the first and last edges, default 'dashed' */
    readonly endStyle?: 'dashed' | 'solid';
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
    readonly which: number; // if >=0, leaf offset from the start, else offset from the end
    readonly edge?: number; // [optional] which leaf edge to put label on
    readonly scale?: number; // [optional] how much to scale text by; default 1
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
  export function drawUnfolded(canvas: string | HTMLCanvasElement | string[], fm: FlexagonManager, options?: DrawStripOptions | DrawStripOptions[]) {
    const directions = fm.getDirections();
    const objects = {
      flexagon: fm.flexagon,
      angleInfo: fm.getAngleInfo(),
      directions: directions ? directions.asRaw() : undefined,
      leafProps: fm.leafProps,
    };
    return drawUnfoldedObjects(canvas, objects, options);
  }

  export function drawUnfoldedObjects(target: string | HTMLCanvasElement | string[], objects: DrawStripObjects, options?: DrawStripOptions | DrawStripOptions[]) {
    const slices = new TrackSlices(target, options);
    if (!slices.isMatched) {
      console.log("drawUnfoldedObjects: mismatched targets & slices");
    }

    const directions = objects.directions ? Directions.make(objects.directions) : undefined;
    const unfolded = unfold(objects.flexagon.getAsLeafTrees(), directions);
    if (isTreeError(unfolded)) {
      console.log("drawUnfoldedObjects: error unfolding flexagon");
      console.log(unfolded);
      return;
    }

    const angles = objects.angleInfo.getUnfoldedAngles(objects.flexagon, unfolded);
    const leaflines = leafsToLines(unfolded, toRadians(angles[0]), toRadians(angles[1]));
    slices.computeAcross(leaflines);

    for (let i = 0; i < slices.paints.length; i++) {
      const paint = slices.paints[i];
      const opt = slices.options[i];
      if (paint && opt) {
        const content = getLeafContent(opt.content);
        const leaflinesSubset = sliceLeafLines(leaflines, opt.start, opt.end);
        paint.start();
        drawStrip(paint, leaflinesSubset, content, objects.leafProps, opt.scale, opt.rotation, opt.captions);
        paint.end();
      }
    }
  }

  /** keep track of info for each slice of the strip we're drawing */
  class TrackSlices {
    readonly isMatched: boolean;
    /** a paint per slice */
    readonly paints: (Paint | null)[];
    /** options for each slice */
    options: DrawStripOptions[];

    constructor(target: string | HTMLCanvasElement | string[], options?: DrawStripOptions | DrawStripOptions[]) {
      if (Array.isArray(target)) {
        this.paints = target.map(t => newPaint(t));
      } else {
        this.paints = [newPaint(target)];
      }

      if (Array.isArray(options)) {
        this.options = options;
      } else if (options) {
        this.options = [options];
      } else {
        this.options = [{}];
      }

      this.isMatched = (this.paints.length === this.options.length);
    }

    /** if needed, compute a common scale */
    computeAcross(leaflines: LeafLines) {
      if (this.options[0].scale) {
        return; // scale is already set
      }

      // find scale that works for every slice
      const paints = this.paints.filter(p => p !== null) as Paint[];
      const sliceIn = paints.map((p, i) => {
        const [width, height] = p.getSize();
        const options = this.options[i];
        return { ...options, width, height };
      });
      const sliceOut = computeAcrossSlices(leaflines, sliceIn);

      this.options = sliceOut.map((s, i) => {
        return { ...this.options[i], scale: s.scale * 0.99 };
      });
    }
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
