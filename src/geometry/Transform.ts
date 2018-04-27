namespace Flexagonator {

  export class Transform {
    constructor(readonly offset: Point, readonly scale: number) {
    }

    apply(point: Point): Point {
      return { x: (point.x + this.offset.x) * this.scale, y: (point.y + this.offset.y) * this.scale };
    }

    applyScale(len: number): number {
      return this.scale * len;
    }
  }

}
