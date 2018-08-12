namespace Flexagonator {

  /**
   * Creates a standard diagram showing all the states
   * accessible just through pinch flexing.
   * Coordinates represent the triangle corners,
   * e.g. (0,0),(1,0),(0,1), which would need to
   * be transformed to display as equilateral triangles.
   */
  export interface PinchGraph {
    points: Point[];
  }

  // build up the graph traversed by the given sequence of flexes,
  // where flexes must be one of {P, <, >}
  export function createPinchGraph(flexes: string): PinchGraph | FlexError {
    const track = new TrackPinchGraph();

    const sequence = parseFlexSequence(flexes);
    for (const flex of sequence) {
      switch (flex.flexName) {
        case 'P':
          track.trackP();
          break;

        case '<':
          track.trackLeft();
          break;

        case '>':
          track.trackRight();
          break;

        default:
          return { reason: FlexCode.UnknownFlex, flexName: flex.flexName };
      }
    }

    return track.getResults();
  }

  // track the path the various flexes trace over the pinch graph
  class TrackPinchGraph {
    private readonly points: Point[] = [];
    private current: Point = { x: 0, y: 0 };
    private delta: Point = { x: 1, y: 0 };
    private isClock = true;
    private rotates = 0;

    constructor() {
      this.points.push(this.current);
    }

    trackP() {
      if (this.rotates % 2 !== 0) {
        // spin around the triangle
        this.delta = TrackPinchGraph.turn(this.delta, this.isClock);
      } else {
        // step forward, next triangle spins the opposite direction
        this.isClock = !this.isClock;
      }
      this.current = addPoints(this.current, this.delta);
      this.points.push(this.current);
      this.rotates = 0;
    }

    trackLeft() {
      this.rotates--;
    }

    trackRight() {
      this.rotates++;
    }

    getResults() {
      return { points: this.points };
    }

    // rotate 'delta' either clockwise our counterclockwise
    private static turn(delta: Point, isClock: boolean): Point {
      if (pointsAreEqual(delta, { x: 1, y: 0 })) {
        return isClock ? { x: 0, y: -1 } : { x: -1, y: 1 };
      } else if (pointsAreEqual(delta, { x: 0, y: 1 })) {
        return isClock ? { x: 1, y: -1 } : { x: -1, y: 0 };
      } else if (pointsAreEqual(delta, { x: -1, y: 1 })) {
        return isClock ? { x: 1, y: 0 } : { x: 0, y: -1 };
      } else if (pointsAreEqual(delta, { x: -1, y: 0 })) {
        return isClock ? { x: 0, y: 1 } : { x: 1, y: -1 };
      } else if (pointsAreEqual(delta, { x: 0, y: -1 })) {
        return isClock ? { x: -1, y: 1 } : { x: 1, y: 0 };
      } // 1,-1
      return isClock ? { x: -1, y: 0 } : { x: 0, y: 1 };
    }
  }

}