namespace Flexagonator {

  export interface DrawPinchOptions {
    readonly flexes?: string;    // draw the graph for a set of flexes in {P, P', ^, <, >}
    readonly traverse?: string;  // draw the graph for the given Tuckerman traverse
    readonly drawEnds?: boolean; // show where 'flexes' starts & ends
  }

  const traverseColor = 0xb4b4b4;
  const flexColor = 0x1464aa;
  const startColor = 0x14c832;
  const endColor = 0xc81464;

  // draw the graph described by a given series of flexes in {P, P', ^, <, >},
  // and/or drawing the corresponding Tuckerman traverse
  export function drawPinchGraph(canvas: string | HTMLCanvasElement, options: DrawPinchOptions) {
    const output: HTMLCanvasElement = canvas instanceof HTMLCanvasElement ? canvas : document.getElementById(canvas) as HTMLCanvasElement;
    const ctx = output.getContext("2d") as CanvasRenderingContext2D;
    const paint = new PaintCanvas(ctx);
    const [w, h] = paint.getSize();
    const box = { x: w, y: h };
    paint.start();

    var transform = null;
    if (options.traverse) {
      const traverseGraph = createPinchGraph(options.traverse);
      if (isFlexError(traverseGraph)) {
        return traverseGraph;
      }
      transform = Transform.make(box, traverseGraph.min, traverseGraph.max, false);

      paint.setLineColor(traverseColor);
      drawGraph(paint, transform, traverseGraph);

      if (options.drawEnds && traverseGraph.points.length > 0) {
        paint.setLineColor(startColor);
        drawCircle(paint, transform, traverseGraph.points[0], 0.1);
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

      paint.setLineColor(flexColor);
      drawGraph(paint, transform, flexGraph);

      if (options.drawEnds && flexGraph.points.length > 0) {
        paint.setLineColor(endColor);
        drawCircle(paint, transform, flexGraph.points[flexGraph.points.length - 1], 0.09);
      }
    }
    paint.end();
    return true;
  }

  function drawGraph(paint: Paint, transform: Transform, graph: PinchGraph) {
    const points = graph.points.map(p => transform.apply(p));
    paint.drawLines(points);
  }

  function drawCircle(paint: Paint, transform: Transform, p: Point, radius: number) {
    const center = transform.apply(p);
    const size = transform.applyScale(radius);
    paint.drawCircle(center, size);
  }

}
