namespace Flexagonator {

  // information about how the display properties of a given unfolded flexagon strip
  export interface DrawStripObjects {
    readonly flexagon: Flexagon;
    readonly angleInfo: FlexagonAngles;
    readonly leafProps: PropertiesForLeaves;
  }

  export enum StripContent {
    FoldingLabels,  // put everything on one-side, use labels that indicate folding order
    FoldingAndIds,  // FoldingLabels plus ids
    Front,          // only display what's on the front side, use leaf properties
    Back,           // only display what's on the back side, use leaf properties
  }

  export interface DrawStripOptions {
    readonly content: StripContent;
    // [optional] indices for the first & last leaves to draw
    readonly start?: number;
    readonly end?: number;
    // [optional] scale factor (approximately the number of pixels on a leaf edge)
    readonly scale?: number;
  }

  // draw an unfolded flexagon strip
  export function drawUnfolded(canvasId: string, fm: FlexagonManager, options: DrawStripOptions) {
    const objects = {
      flexagon: fm.flexagon,
      angleInfo: fm.getAngleInfo(),
      leafProps: fm.leafProps,
    };
    return drawUnfoldedObjects(canvasId, objects, options);
  }

  function drawUnfoldedObjects(canvasId: string, objects: DrawStripObjects, options: DrawStripOptions) {
    const output: HTMLCanvasElement = document.getElementById(canvasId) as HTMLCanvasElement;
    const ctx = output.getContext("2d") as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, 800, 600);

    const unfolded = unfold(objects.flexagon.getAsLeafTrees());
    if (isTreeError(unfolded)) {
      console.log("error unfolding flexagon");
      console.log(unfolded);
      return;
    }

    const angles = objects.angleInfo.getUnfoldedAngles(objects.flexagon, unfolded);
    const leaflines = leafsToLines(unfolded, toRadians(angles[0]), toRadians(angles[1]));
    const leaflinesSubset = sliceLeafLines(leaflines, options.start, options.end);
    drawStrip(ctx, leaflinesSubset, options.content, objects.leafProps, options.scale);
  }

}
