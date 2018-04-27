namespace Flexagonator {

  export class Transform {
    private readonly offset: Point;
    private readonly scale: number;

    constructor(outputSize: Point, inputMin: Point, inputMax: Point) {
      const scalex = outputSize.x / (inputMax.x - inputMin.x);
      const scaley = outputSize.y / (inputMax.y - inputMin.y);
      const scale = Math.min(scalex, scaley);

      this.offset = { x: -inputMin.x, y: -inputMin.y };
      this.scale = scale;
    }

    apply(point: Point): Point {
      return { x: (point.x + this.offset.x) * this.scale, y: (point.y + this.offset.y) * this.scale };
    }

    applyScale(len: number): number {
      return this.scale * len;
    }
  }

}
