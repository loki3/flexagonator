namespace Flexagonator {

  export interface DrawPinchOptions {
    readonly flexes?: string;    // draw the graph for a set of flexes in {P, <, >}
    readonly traverse?: string;  // draw the graph for the given Tuckerman traverse
    readonly drawEnds?: boolean; // show where 'flexes' starts & ends
  }

  const traverseColor = "rgb(180, 180, 180)";
  const flexColor = "rgb(20, 100, 170)";
  const startColor = "rgb(20, 200, 50)";
  const endColor = "rgb(200, 20, 100)";

  // draw the graph described by a given series of flexes in {P, <, >},
  // and/or drawing the corresponding Tuckerman traverse
  export function drawPinchGraph(canvas: string | HTMLCanvasElement, options: DrawPinchOptions) {
    const output: HTMLCanvasElement = canvas instanceof HTMLCanvasElement ? canvas : document.getElementById(canvas) as HTMLCanvasElement;
    const ctx = output.getContext("2d") as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

    if (options.traverse) {
      const traverseGraph = createPinchGraph(options.traverse);
      if (isFlexError(traverseGraph)) {
        return traverseGraph;
      }
      ctx.strokeStyle = traverseColor;
      drawGraph(ctx, traverseGraph);
    }

    if (options.flexes) {
      const flexGraph = createPinchGraph(options.flexes);
      if (isFlexError(flexGraph)) {
        return flexGraph;
      }
      ctx.strokeStyle = flexColor;
      drawGraph(ctx, flexGraph, options.drawEnds);
    }
    return true;
  }

  function drawGraph(ctx: CanvasRenderingContext2D, graph: PinchGraph, drawEnds?: boolean) {
    ctx.beginPath();
    for (const point of graph.points) {
      const p = transform(point);
      ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();

    if (drawEnds && graph.points.length > 1) {
      ctx.strokeStyle = startColor;
      const start = transform(graph.points[0]);
      ctx.beginPath();
      ctx.ellipse(start.x, start.y, 5, 5, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = endColor;
      const end = transform(graph.points[graph.points.length - 1]);
      ctx.beginPath();
      ctx.ellipse(end.x, end.y, 5, 5, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // just a fake transform for now
  function transform(p: Point): Point {
    return { x: p.x * 30 + 90, y: p.y * 30 + 90 };
  }
}
