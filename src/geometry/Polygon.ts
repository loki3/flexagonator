namespace Flexagonator {

  export interface Triangle {
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
  }

  /*
    This describes the polygon that will be displayed to represent
    a flexagon of triangles where all triangles meet in the middle.
    Every leaf is the same (or a mirror image) and can be any
    arbitrary triangle.  However, there's only one possible angle for
    the vertex in the middle that will make for a closed polygon,
    namely (2*pi/number-of-pats-around-the-center), even though the
    actual leaves might have any angle at all.  This means that
    sometimes the central angle will be >360 and won't lie flat,
    and sometimes it'll be <360 and won't open up all the way.
    For the simple 2D on-screen representation, the central angle
    will always be (2pi/n), and we'll scale the other angles
    appropriately.
  */
  export class Polygon {
    constructor(
      readonly numSides: number,
      readonly xCenter: number,
      readonly yCenter: number,
      readonly radius: number,
      readonly anglesDegrees: number[],
      readonly showFront: boolean) { }

    // returns an array of corners [x1, y1, x2, y2...]
    // the bottom side is parallel to the axis
    getCorners(): number[] {
      return this.computePoints(this.radius, -0.5);
    }

    getFaceCenters(factor: number): number[] {
      return this.computePoints(this.radius * factor, 0);
    }

    getLeafTriangles(): Triangle[] {
      const triangles: Triangle[] = [];
      const corners = this.computePoints(this.radius, -0.5);
      for (var i = 0; i < this.numSides; i++) {
        const j = i == this.numSides - 1 ? 0 : i + 1;
        const triangle: Triangle = {
          x1: this.xCenter, y1: this.yCenter,
          x2: corners[i * 2], y2: corners[i * 2 + 1],
          x3: corners[j * 2], y3: corners[j * 2 + 1],
        };
        triangles.push(triangle);
      }
      return triangles;
    }

    private computePoints(radius: number, angleFactor: number): number[] {
      var corners: number[] = [];
      if (this.numSides < 3)
        return corners;

      const angles = new Angles(this.numSides, angleFactor, this.showFront);
      const scales = new Scales(this.numSides, this.anglesDegrees, radius, angleFactor);
      for (var i = 0; i < this.numSides; i++) {
        const point = angles.computePoint(i);
        const scale = scales.computeScale(i);

        corners.push(point[0] * scale + this.xCenter);
        corners.push(point[1] * scale + this.yCenter);
      }
      return corners;
    }
  }

  // computes the angles for each point around the polygon
  class Angles {
    private readonly centerAngle: number;
    private readonly offsetAngle: number;

    constructor(numSides: number, angleFactor: number, showFront: boolean) {
      this.centerAngle = 2 * Math.PI / numSides;
      // the goal in determining this base angle is to put the current vertex
      // at the top or just to the right of the top (mirrored on the backside)
      // & have the base of a regular polygon at the bottom
      const value = showFront ? 1 : 2;
      const adjust = (Math.floor((numSides + value) / 2) - 1) * this.centerAngle;
      this.offsetAngle = Math.PI / 2 + this.centerAngle * angleFactor - adjust;
    }

    computePoint(i: number): number[] {
      const thisAngle = this.centerAngle * i + this.offsetAngle;
      const x = Math.cos(thisAngle);
      const y = Math.sin(thisAngle);
      return [x, y];
    }
  }

  // computes the scales used to place the points somewhere between
  // the polygon center and its edges
  class Scales {
    private readonly scales: number[];
    private readonly radius: number;
    private readonly angleFactor: number;

    constructor(numSides: number, anglesDegrees: number[], radius: number, angleFactor: number) {
      this.scales = this.getScales(numSides, anglesDegrees);
      this.radius = radius;
      this.angleFactor = angleFactor;
    }

    computeScale(i: number): number {
      // this is how far from the center to put the corner.
      // if we're in the middle of a face (angleFactor ===0),
      //  we need to adjust for the two edges possibly being different
      if (this.angleFactor === 0) {
        return this.radius * (this.scales[0] + this.scales[1]) / 2;
      } else {
        return (i % 2 === 0) ? this.radius * this.scales[0] : this.radius * this.scales[1];
      }
    }

    // Basic approach: pretend the center angle (angles[0]) is (2pi/n),
    // and scale the other two angles to keep their proportions the same.
    // Then we'll scale down the side opposite the smaller angle.
    // Returns the scaling to apply to the two radial sides of the leaf.
    private getScales(numSides: number, anglesDegrees: number[]): number[] {
      if (anglesDegrees[0] === 60 && anglesDegrees[1] === 60) {
        return [1, 1];
      }

      const theta = 2 * Math.PI / numSides;
      const beta = toRadians(anglesDegrees[1]);
      const gamma = toRadians(anglesDegrees[2]);
      const angleScale = (Math.PI - theta) / (beta + gamma);
      const lengthScale = Math.sin(angleScale * gamma) / Math.sin(angleScale * beta);
      if (beta > gamma) {
        return [1, lengthScale];
      }
      return [1 / lengthScale, 1];
    }
  }
}
