namespace Flexagonator {

  export interface Point {
    readonly x: number,
    readonly y: number
  }
  export interface Line {
    readonly a: Point,
    readonly b: Point
  }

  // given a=(0,0), b(1,0), angle1=(c,a,b), angle2=(a,b,c), find c
  export function computeTrianglePoint(angle1: number, angle2: number): Point {
    const cota = Math.cos(angle1) / Math.sin(angle1);
    const cotb = Math.cos(angle2) / Math.sin(angle2);
    return { x: cota / (cota + cotb), y: 1 / (cota + cotb) };
  }

  export function toRadians(degrees: number) {
    return degrees * Math.PI / 180;
  }

  // mirror p over the line (p1, p2)
  export function mirror(p1: Point, p2: Point, p: Point): Point {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dx2 = dx * dx;
    const dy2 = dy * dy;

    const a = (dx2 - dy2) / (dx2 + dy2);
    const b = 2 * dx * dy / (dx2 + dy2);

    const x2 = a * (p.x - p1.x) + b * (p.y - p1.y) + p1.x;
    const y2 = b * (p.x - p1.x) - a * (p.y - p1.y) + p1.y;

    return { x: x2, y: y2 };
  }

  // get the incenter of a triangle
  export function getIncenter(p1: Point, p2: Point, p3: Point): Point {
    const a = lengthOf(p2, p3);
    const b = lengthOf(p1, p3);
    const c = lengthOf(p1, p2);
    const x = (a * p1.x + b * p2.x + c * p3.x) / (a + b + c);
    const y = (a * p1.y + b * p2.y + c * p3.y) / (a + b + c);
    return { x: x, y: y };
  }

  export function lengthOf(a: Point, b: Point) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

}
