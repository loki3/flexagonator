namespace Flexagonator {

  export enum CenterAngle {
    Is360,
    GreaterThan360 = 1,
    LessThan360 = -1
  }

  // object that understand which angles to use for leaves
  // when given a flexagon
  export class FlexagonAngles {
    private angleCenter: number = 60;
    private angleClock: number = 60;

    setAngles(center: number, clock: number) {
      this.angleCenter = center;
      this.angleClock = clock;
    }

    setIsosceles(flexagon: Flexagon) {
      this.angleCenter = 360 / flexagon.getPatCount();
      this.angleClock = (180 - this.angleCenter) / 2;
    }

    // [center angle, clockwise, clockwise]
    getAngles(flexagon: Flexagon): number[] {
      const angles: number[] = [this.angleCenter, this.angleClock, 180 - this.angleCenter - this.angleClock];
      const v = flexagon.whichVertex;
      if (flexagon.isFirstMirrored) {
        return [angles[v], angles[(v + 2) % 3], angles[(v + 1) % 3]];
      }
      return [angles[v], angles[(v + 1) % 3], angles[(v + 2) % 3]];
    }

    getCenterAngleSum(flexagon: Flexagon): CenterAngle {
      const angles = this.getAngles(flexagon);
      const angle = angles[0] * flexagon.getPatCount();
      if (Math.round(angle) === 360) {
        return CenterAngle.Is360;
      }
      return (angle < 360) ? CenterAngle.LessThan360 : CenterAngle.GreaterThan360;
    }

    // get the angles along the edge of the 1st leaf that we'll reflect the 2nd leaf across
    getUnfoldedAngles(flexagon: Flexagon, unfolded: Leaf[]): number[] {
      const angles = this.getAngles(flexagon);
      return unfolded[0].isClock ? [angles[2], angles[0], angles[1]] : [angles[1], angles[2], angles[0]];
    }
  }

}
