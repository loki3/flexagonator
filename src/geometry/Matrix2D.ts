namespace Flexagonator {

  /** matrix that does 2D transformations of points */
  export class Matrix2D {
    /*
      a b u
      c d v
      0 0 1
    */
    private constructor(
      private readonly a = 1, private readonly b = 0, private readonly u = 0,
      private readonly c = 0, private readonly d = 1, private readonly v = 0) { }
    private unitLength: number | null = null;

    /** create an identity matrix */
    static new() { return new Matrix2D(); }

    /** apply 2D transformation to a point */
    transform(p: Point): Point {
      const x = this.a * p.x + this.b * p.y + this.u;
      const y = this.c * p.x + this.d * p.y + this.v;
      return { x, y };
    }

    /** apply 2D transformation to a length */
    transformLength(length: number): number {
      if (this.unitLength === null) {
        const zero = this.transform({ x: 0, y: 0 });
        const one = this.transform({ x: 1, y: 0 });
        this.unitLength = Math.sqrt((one.x - zero.x) * (one.x - zero.x) + (one.y - zero.y) * (one.y - zero.y));
      }
      return this.unitLength * length;
    }

    /** add offset to current transformation */
    offset(x: number, y: number): Matrix2D {
      return this.compose(1, 0, x, 0, 1, y);
    }

    /** add uniform scaling to current transformation */
    scale(scale: number): Matrix2D {
      return this.compose(scale, 0, 0, 0, scale, 0);
    }

    /** add rotation to current transformation: counterclockwise radians */
    rotate(theta: number): Matrix2D {
      const cos = Math.cos(theta);
      const sin = Math.sin(theta);
      return this.compose(cos, -sin, 0, sin, cos, 0);
    }

    /** add mirroring over the x or y axis to current transformation */
    mirror(dir: 'x' | 'y'): Matrix2D {
      switch (dir) {
        case 'x': return this.compose(-1, 0, 0, 0, 1, 0);
        case 'y': return this.compose(1, 0, 0, 0, -1, 0);
      }
    }

    /** follow this transform by another transform */
    times(m: Matrix2D): Matrix2D {
      return this.compose(m.a, m.b, m.u, m.c, m.d, m.v);
    }

    /** get the inverse matrix that undoes the transformation */
    getInverse(): Matrix2D | false {
      const den = this.a * this.d - this.b * this.c;
      if (den === 0) {
        return false;
      }
      const a = this.d / den;
      const b = -this.b / den;
      const u = -(this.d * this.u - this.b * this.v) / den;
      const c = -this.c / den;
      const d = this.a / den;
      const v = -(this.a * this.v - this.c * this.u) / den;
      return new Matrix2D(a, b, u, c, d, v);
    }

    /** follow this transform by another transform */
    private compose(a: number, b: number, u: number, c: number, d: number, v: number): Matrix2D {
      const a2 = a * this.a + b * this.c;
      const b2 = a * this.b + b * this.d;
      const u2 = a * this.u + b * this.v + u;
      const c2 = c * this.a + d * this.c;
      const d2 = c * this.b + d * this.d;
      const v2 = c * this.u + d * this.v + v;
      return new Matrix2D(a2, b2, u2, c2, d2, v2);
    }
  }

}
