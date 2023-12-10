namespace Flexagonator {

  export interface SliceIn {
    width: number;
    height: number;
    rotation?: number;
    start?: number;
    end?: number;
  }
  export interface SliceOut {
    scale: number;
    rotation: number;
  }

  /**
   * compute a common scale that works for every slice.
   * check every slice for its rotation (either explicit or computed) & scale,
   * and pick the best scale to use for every slice
   */
  export function computeAcrossSlices(leaflines: LeafLines, sliceIn: SliceIn[]): SliceOut[] {
    let bestScale: number = 0;
    const rotations: number[] = [];
    for (const slice of sliceIn) {
      let leaflinesSubset = sliceLeafLines(leaflines, slice.start, slice.end);

      // figure out best rotation if not already set
      let rotation = slice.rotation;
      if (rotation !== undefined) {
        leaflinesSubset = rotateLeafLines(leaflinesSubset, toRadians(rotation));
      } else {
        [leaflinesSubset, rotation] = findBestRotation(leaflinesSubset, { x: slice.width, y: slice.height });
      }
      rotations.push(rotation);

      // figure out row to scale slice to fit
      const [inputMin, inputMax] = getExtents(leaflinesSubset);
      const scalex = slice.width / (inputMax.x - inputMin.x);
      const scaley = slice.height / (inputMax.y - inputMin.y);
      const scale = Math.min(scalex, scaley);
      if (bestScale === 0 || scale < bestScale) {
        bestScale = scale;
      }
    }

    const results = rotations.map(r => { return { scale: bestScale, rotation: r } });
    return bestScale === 0 ? [] : results;
  }

  // search for the rotation that optimizes the amount of 'box' that gets filled
  export function findBestRotation(leaflines: LeafLines, box: Point): [LeafLines, number] {
    let bestlines = leaflines;
    let bestRotation = 0;
    const best = new BestBoxInBox(box);
    for (let i = 0; i < 24; i++) {
      const rotation = (i * Math.PI * 2) / 24;
      const thislines = rotateLeafLines(leaflines, rotation);
      const extents: [Point, Point] = getExtents(thislines);
      if (best.isBest(extents[0], extents[1])) {
        bestlines = thislines;
        bestRotation = rotation;
      }
    }
    return [bestlines, bestRotation];
  }

}
