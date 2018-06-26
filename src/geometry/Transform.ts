namespace Flexagonator {

  export class Transform {
    private constructor(
      private readonly offset: Point,
      private readonly scale: number,
      private readonly xmax: number) {
    }

    static make(outputSize: Point, inputMin: Point, inputMax: Point, flip: boolean, scale?: number): Transform {
      if (!scale) {
        const scalex = outputSize.x / (inputMax.x - inputMin.x);
        const scaley = outputSize.y / (inputMax.y - inputMin.y);
        scale = Math.min(scalex, scaley);
      }

      const offset = { x: -inputMin.x, y: -inputMin.y };
      const xmax = flip ? outputSize.x : 0;
      return new Transform(offset, scale, xmax);
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
