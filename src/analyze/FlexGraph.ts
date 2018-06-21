namespace Flexagonator {

  // information about a graph of flexagons (nodes) and flexes (edges)
  export class FlexGraph {
    private tracker: TrackerVisible | null = null;

    constructor(readonly flexagons: Flexagon[], readonly relativeFlexes: RelativeFlexes[]) {
    }

    // input: a description of the visible leaves [ [top1, top2...], [bottom1,  bottom2...] ]
    // output: all the flexagons that match, if any
    findVisible(visible: number[][]): number[] {
      if (this.tracker === null) {
        this.tracker = new TrackerVisible(this.flexagons);
      }
      if (visible.length != 2 || visible[0].length !== visible[1].length) {
        return [];
      }
      return this.tracker.find(visible[0], visible[1]);
    }
  }

}
