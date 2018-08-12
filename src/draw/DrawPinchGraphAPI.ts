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
    const box = { x: ctx.canvas.clientWidth, y: ctx.canvas.clientHeight };
    ctx.clearRect(0, 0, box.x, box.y);

    var transform = null;
    if (options.traverse) {
      const traverseGraph = createPinchGraph(options.traverse);
      if (isFlexError(traverseGraph)) {
        return traverseGraph;
      }
      transform = Transform.make(box, traverseGraph.min, traverseGraph.max, false);

      ctx.strokeStyle = traverseColor;
      drawGraph(ctx, transform, traverseGraph);
    }

    if (options.flexes) {
      const flexGraph = createPinchGraph(options.flexes);
      if (isFlexError(flexGraph)) {
        return flexGraph;
      }
      if (!transform) {
        transform = Transform.make(box, flexGraph.min, flexGraph.max, false);
      }

      ctx.strokeStyle = flexColor;
      drawGraph(ctx, transform, flexGraph, options.drawEnds);
    }
    return true;
  }

  function drawGraph(ctx: CanvasRenderingContext2D, transform: Transform, graph: PinchGraph, drawEnds?: boolean) {
    ctx.beginPath();
    for (const point of graph.points) {
      const p = transform.apply(point);
      ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();

    if (drawEnds && graph.points.length > 1) {
      const size = transform.applyScale(0.1);

      ctx.strokeStyle = startColor;
      const start = transform.apply(graph.points[0]);
      ctx.beginPath();
      ctx.ellipse(start.x, start.y, size, size, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = endColor;
      const end = transform.apply(graph.points[graph.points.length - 1]);
      ctx.beginPath();
      ctx.ellipse(end.x, end.y, size, size, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

}
