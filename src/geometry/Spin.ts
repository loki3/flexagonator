namespace Flexagonator {
  /** a point in polar coordinates */
  export interface Polar {
    /** distance */
    readonly r: number;
    /** angle counterclockwise in degrees, with 0 at the positive x-axis */
    readonly θ: number;
  }

  /**
   * spin the given set of points around the center
   * @param points points to rotate, where (1,0), (1,90), (1,180), (1,270) are midpoints of the bounding box
   */
  export function spin(
    count: number,
    center: Point,
    width: number,
    points: Polar[],
  ): Point[][] {
    const results: Point[][] = [];
    const delta = 2 * Math.PI / count;
    for (let i = 0, angle = 0; i < count; i++, angle += delta) {
      const newPoints: Point[] = [];
      for (const polar of points) {
        const newR = polar.r * width / 2;
        const newθ = toRadians(polar.θ) + angle;
        const newOffset = { x: newR * Math.cos(newθ), y: newR * Math.sin(newθ) };
        const newPoint = addPoints(center, newOffset);
        newPoints.push(newPoint);
      }
      results.push(newPoints);
    }
    return results;
  }
}
