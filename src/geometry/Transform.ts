namespace Flexagonator {

  export class Transform {
    private readonly offset: Point;
    private readonly scale: number;
    private readonly xmax: number;

    constructor(outputSize: Point, inputMin: Point, inputMax: Point, flip: boolean) {
      const scalex = outputSize.x / (inputMax.x - inputMin.x);
      const scaley = outputSize.y / (inputMax.y - inputMin.y);
      const scale = Math.min(scalex, scaley);

      this.offset = { x: -inputMin.x, y: -inputMin.y };
      this.scale = scale;
      this.xmax = flip ? outputSize.x : 0;
    }

    apply(point: Point): Point {
      const p: Point = { x: (point.x + this.offset.x) * this.scale, y: (point.y + this.offset.y) * this.scale };
      return this.xmax === 0 ? p : { x: this.xmax - p.x, y: p.y };
    }

    applyScale(len: number): number {
      return this.scale * len;
    }
  }

}
