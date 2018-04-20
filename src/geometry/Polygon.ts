namespace Flexagonator {

  export class Polygon {
    constructor(
      readonly numSides: number,
      readonly xCenter: number,
      readonly yCenter: number,
      readonly radius: number) {
    }

    // returns an array of corners [x1, y1, x2, y2...]
    // the bottom side is parallel to the axis
    getCorners(): number[] {
      return this.computePoints(this.radius, -0.5);
    }

    getFaceCenters(factor: number): number[] {
      return this.computePoints(this.radius * factor, 0);
    }

    private computePoints(radius: number, angleFactor: number): number[] {
      var corners: number[] = [];
      if (this.numSides < 3)
        return corners;

      const angle = 2 * Math.PI / this.numSides;
      const offset = Math.PI / 2 + angle * angleFactor;
      for (var i = 0; i < this.numSides; i++) {
        var thisAngle = angle * i + offset;
        var x = Math.cos(thisAngle);
        var y = Math.sin(thisAngle);
        corners.push(x * radius + this.xCenter);
        corners.push(y * radius + this.yCenter);
      }
      return corners;
    }
  }
}
