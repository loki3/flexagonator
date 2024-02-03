namespace Flexagonator {

  export class Transform {
    private constructor(
      private readonly offset: Point, // offset before scale, in input coordinates
      private readonly scale: number,
      private readonly xmax: number,
      private readonly ymax: number,
      private readonly offsetPx: number) {  // offset after scale, in pixels
    }

    static make(
      outputSize: Point, inputMin: Point, inputMax: Point, flip?: 'x' | 'y',
      scale?: number, insetPx?: number, center?: boolean
    ): Transform {
      const offset = getOffset(outputSize, inputMin, inputMax, center);
      if (insetPx) {  // inset all 4 sides by insetPx pixels
        outputSize = { x: outputSize.x - 2 * insetPx, y: outputSize.y - 2 * insetPx };
      }
      if (!scale) {
        const scalex = outputSize.x / (inputMax.x - inputMin.x);
        const scaley = outputSize.y / (inputMax.y - inputMin.y);
        scale = Math.min(scalex, scaley);
      }

      const xmax = flip === 'x' ? outputSize.x : 0;
      const ymax = flip === 'y' ? outputSize.y : 0;
      return new Transform(offset, scale, xmax, ymax, insetPx ? insetPx : 0);
    }

    apply(point: Point): Point {
      const p: Point = { x: (point.x + this.offset.x) * this.scale, y: (point.y + this.offset.y) * this.scale };
      const x = this.xmax === 0 ? p.x : this.xmax - p.x;
      const y = this.ymax === 0 ? p.y : this.ymax - p.y;
      return { x: x + this.offsetPx, y: y + this.offsetPx };
    }

    applyScale(len: number): number {
      return this.scale * len;
    }
  }

  /** get offset necessary so that inputMin maps to (0,0), or so the input center maps to the output center */
  function getOffset(outputSize: Point, inputMin: Point, inputMax: Point, center?: boolean): Point {
    if (center !== true || inputMax.x === inputMin.x || inputMax.y === inputMin.y || outputSize.x === 0 || outputSize.y === 0) {
      return { x: -inputMin.x, y: -inputMin.y };
    }

    const outAspect = outputSize.x / outputSize.y;
    const inAspect = (inputMax.x - inputMin.x) / (inputMax.y - inputMin.y);
    let xOff = 0, yOff = 0;
    if (inAspect < outAspect) {
      // center x
      const inSize = inputMax.x - inputMin.x;
      const inFullSize = inSize * outAspect / inAspect;
      xOff = (inFullSize - inSize) / 2;
    } else {
      // center y
      const inSize = inputMax.y - inputMin.y;
      const inFullSize = inSize * inAspect / outAspect;
      yOff = (inFullSize - inSize) / 2;
    }
    return { x: xOff - inputMin.x, y: yOff - inputMin.y };
  }
}
