namespace Flexagonator {

  export interface DrawPinchOptions {
    readonly flexes?: string;    // draw the graph for a set of flexes in {P, P', ^, <, >}
    readonly traverse?: string;  // draw the graph for the given Tuckerman traverse
    readonly drawEnds?: boolean; // show where 'flexes' starts & ends
  }

  const traverseColor = "rgb(180, 180, 180)";
  const flexColor = "rgb(20, 100, 170)";
  const startColor = "rgb(20, 200, 50)";
  const endColor = "rgb(200, 20, 100)";

  // draw the graph described by a given series of flexes in {P, P', ^, <, >},
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

      if (options.drawEnds && traverseGraph.points.length > 0) {
        ctx.strokeStyle = startColor;
        drawCircle(ctx, transform, traverseGraph.points[0], 0.1);
      }
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
      drawGraph(ctx, transform, flexGraph);

      if (options.drawEnds && flexGraph.points.length > 0) {
        ctx.strokeStyle = endColor;
        drawCircle(ctx, transform, flexGraph.points[flexGraph.points.length - 1], 0.09);
      }
    }
    return true;
  }

  function drawGraph(ctx: CanvasRenderingContext2D, transform: Transform, graph: PinchGraph) {
    ctx.beginPath();
    for (const point of graph.points) {
      const p = transform.apply(point);
      ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
  }

  function drawCircle(ctx: CanvasRenderingContext2D, transform: Transform, p: Point, radius: number) {
    const center = transform.apply(p);
    const size = transform.applyScale(radius);
    ctx.beginPath();
    ctx.ellipse(center.x, center.y, size, size, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

}
