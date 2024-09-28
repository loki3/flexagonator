namespace Flexagonator {

  /**
   * Creates a standard diagram showing all the states
   * accessible just through pinch flexing.
   * Coordinates represent triangle corners.
   */
  export interface PinchGraph {
    readonly points: Point[];
    readonly min: Point;
    readonly max: Point;
  }

  /**
   * build up the graph traversed by the given sequence of flexes,
   * where flexes must be one of {P, P', ^, <, >}
   */
  export function createPinchGraph(flexes: string): PinchGraph | FlexError {
    const raw = createRawPinchGraph(flexes);
    if (isFlexError(raw)) {
      return raw;
    }

    const points = transformAbstractPoints(raw);
    const [min, max] = getExtents(points);
    return { points: points, min: min, max: max };
  }

  // e.g. (0,0),(1,0),(0,1) => (0,0),(1,0),(0.8,0.5)
  function transformAbstractPoints(input: Point[]): Point[] {
    const yScale = Math.sqrt(3) / 2;
    return input.map(p => { return { x: p.x + 0.5 * p.y, y: p.y * yScale } });
  }

  function getExtents(points: Point[]): [Point, Point] {
    let xmin = 0, ymin = 0, xmax = 0, ymax = 0;
    for (const point of points) {
      if (point.x < xmin)
        xmin = point.x;
      if (point.x > xmax)
        xmax = point.x;
      if (point.y < ymin)
        ymin = point.y;
      if (point.y > ymax)
        ymax = point.y;
    }
    return [{ x: xmin - 0.1, y: ymin - 0.1 }, { x: xmax + 0.1, y: ymax + 0.1 }];
  }

  /**
   * stored in a skewed coordinate system that's easy to test
   * e.g. (0,0),(1,0),(0,1) represents a regular triangle
   */
  export function createRawPinchGraph(flexes: string): Point[] | FlexError {
    const track = new TrackPinchGraph();

    const sequence = parseFlexSequence(flexes);
    for (const flex of sequence) {
      switch (flex.flexName) {
        case 'P':
          track.trackP();
          if (!flex.shouldApply) {
            track.trackPInverse();
          }
          break;

        case "P'":
          track.trackPInverse();
          if (!flex.shouldApply) {
            track.trackP();
          }
          break;

        case '^':
          track.trackTurnOver();
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

    trackPInverse() {
      if (this.rotates % 2 !== 0) {
        // spin around the triangle
        this.delta = TrackPinchGraph.turn({ x: -this.delta.x, y: -this.delta.y }, this.isClock);
        this.delta = { x: -this.delta.x, y: -this.delta.y };
      } else {
        // step backward, next triangle spins the opposite direction
        this.isClock = !this.isClock;
      }
      this.current = addPoints(this.current, { x: -this.delta.x, y: -this.delta.y });
      this.points.push(this.current);
      this.rotates = 0;
    }

    trackTurnOver() {
      this.delta = { x: -this.delta.x, y: -this.delta.y };
    }

    trackLeft() {
      this.rotates--;
    }

    trackRight() {
      this.rotates++;
    }

    getResults() {
      return this.points;
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
