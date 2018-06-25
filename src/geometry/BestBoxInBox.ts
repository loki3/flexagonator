namespace Flexagonator {

  // starts with the box that we're drawing into,
  // and evaluates new boxes to see if they fill the original box
  // better than others we've seen so far
  export class BestBoxInBox {
    private readonly ratio: number;
    private bestfit: number;

    constructor(extents: Point) {
      this.ratio = extents.x / extents.y;
      this.bestfit = 0;
    }

    isBest(p0: Point, p1: Point): boolean {
      const thisratio = Math.abs(p1.x - p0.x) / Math.abs(p1.y - p0.y);
      const thisfit = (thisratio < this.ratio) ? thisratio / this.ratio : this.ratio / thisratio;
      if (thisfit <= this.bestfit) {
        return false;
      }
      this.bestfit = thisfit;
      return true;
    }
  }

}
