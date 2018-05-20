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
      readonly anglesDegrees: number[]) {
    }

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

      const angle = 2 * Math.PI / this.numSides;
      const offset = Math.PI / 2 + angle * angleFactor;
      const scales = this.getScales();
      for (var i = 0; i < this.numSides; i++) {
        const thisAngle = angle * i + offset;
        const x = Math.cos(thisAngle);
        const y = Math.sin(thisAngle);

        // this is how far from the center to put the corner.
        // if we're in the middle of a face (angleFactor ===0),
        //  we need to adjust for the two edges possibly being different
        var scale;
        if (angleFactor === 0) {
          scale = radius * (scales[0] + scales[1]) / 2;
        } else {
          scale = (i % 2 === 0) ? radius * scales[0] : radius * scales[1];
        }

        corners.push(x * scale + this.xCenter);
        corners.push(y * scale + this.yCenter);
      }
      return corners;
    }

    // Basic approach: pretend the center angle (angles[0]) is (2pi/n),
    // and scale the other two angles to keep their proportions the same.
    // Then we'll scale down the side opposite the smaller angle.
    // Returns the scaling to apply to the two radial sides of the leaf.
    private getScales(): number[] {
      if (this.anglesDegrees[0] === 60 && this.anglesDegrees[1] === 60) {
        return [1, 1];
      }

      const theta = 2 * Math.PI / this.numSides;
      const beta = toRadians(this.anglesDegrees[1]);
      const gamma = toRadians(this.anglesDegrees[2]);
      const angleScale = (Math.PI - theta) / (beta + gamma);
      const lengthScale = Math.sin(angleScale * gamma) / Math.sin(angleScale * beta);
      if (beta > gamma) {
        return [1, lengthScale];
      }
      return [1 / lengthScale, 1];
    }
  }
}
