namespace Flexagonator {

  export enum CenterAngle {
    Is360,
    GreaterThan360 = 1,
    LessThan360 = -1
  }

  /** object that understand which angles to use for leaves
    when given a flexagon */
  export class FlexagonAngles {
    /**
      angleCenter: angle in the center of the flexagon
      angleCounter:  angle counterclockwise from the center
      isDefault: is this a default set of angles or was it explicitly set?
      useCorrect: if false, use the deprecated way of tracking angles
    */
    private constructor(
      private readonly angleCenter: number, private readonly angleCounter: number,
      readonly isDefault: boolean, private readonly useCorrect: boolean) {
    }

    static makeDefault(): FlexagonAngles {
      return new FlexagonAngles(60, 60, true, true/*useCorrect*/);
    }

    /** center angle, angle in counterclockwise direction, useCorrect:false for deprecated behavior */
    static makeAngles(angleCenter: number, angleCounter: number, useCorrect: boolean): FlexagonAngles {
      return new FlexagonAngles(angleCenter, angleCounter, false, useCorrect);
    }

    static makeIsosceles(flexagon: Flexagon, useCorrect: boolean): FlexagonAngles {
      const center = 360 / flexagon.getPatCount();
      const clock = (180 - center) / 2;
      return new FlexagonAngles(center, clock, false, useCorrect);
    }

    // [center angle, clockwise, clockwise]
    getAngles(flexagon: Flexagon): number[] {
      const angles: number[] = [this.angleCenter, this.angleCounter, 180 - this.angleCenter - this.angleCounter];
      const v = this.useCorrect ? flexagon.angleTracker.whichCorner : flexagon.angleTracker.oldCorner;
      if (flexagon.angleTracker.isMirrored) {
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
      return this.getAnglesUsingDirection(flexagon, unfolded[0].isClock);
    }

    // lower level version for testing
    getAnglesUsingDirection(flexagon: Flexagon, isClock: boolean): number[] {
      const angles = this.getAngles(flexagon);
      return isClock ? [angles[1], angles[0], angles[2]] : [angles[2], angles[1], angles[0]];
    }
  }

}
