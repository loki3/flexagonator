namespace Flexagonator {

  export class Transform {
    private constructor(
      private readonly offset: Point, // offset before scale, in input coordinates
      private readonly scale: number,
      private readonly xmax: number,
      private readonly offsetPx: number) {  // offset after scale, in pixels
    }

    static make(outputSize: Point, inputMin: Point, inputMax: Point, flip: boolean, scale?: number, insetPx?: number): Transform {
      if (insetPx) {  // inset all 4 sides by insetPx pixels
        outputSize = { x: outputSize.x - 2 * insetPx, y: outputSize.y - 2 * insetPx };
      }
      if (!scale) {
        const scalex = outputSize.x / (inputMax.x - inputMin.x);
        const scaley = outputSize.y / (inputMax.y - inputMin.y);
        scale = Math.min(scalex, scaley);
      }

      const offset = { x: -inputMin.x, y: -inputMin.y };
      const xmax = flip ? outputSize.x : 0;
      return new Transform(offset, scale, xmax, insetPx ? insetPx : 0);
    }

    apply(point: Point): Point {
      const p: Point = { x: (point.x + this.offset.x) * this.scale, y: (point.y + this.offset.y) * this.scale };
      const p1: Point = this.xmax === 0 ? p : { x: this.xmax - p.x, y: p.y };
      return { x: p1.x + this.offsetPx, y: p1.y + this.offsetPx };
    }

    applyScale(len: number): number {
      return this.scale * len;
    }
  }

}
