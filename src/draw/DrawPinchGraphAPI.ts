namespace Flexagonator {

  // draw the graph described by a given series of flexes in {P, <, >},
  // and/or drawing the corresponding Tuckerman traverse
  export function drawPinchGraph(canvas: string | HTMLCanvasElement, flexes?: string, traverse?: string) {
    const output: HTMLCanvasElement = canvas instanceof HTMLCanvasElement ? canvas : document.getElementById(canvas) as HTMLCanvasElement;
    const ctx = output.getContext("2d") as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

    if (traverse) {
      const traverseGraph = createPinchGraph(traverse);
      if (isFlexError(traverseGraph)) {
        return traverseGraph;
      }
      drawGraph(ctx, traverseGraph);
    }

    if (flexes) {
      const flexGraph = createPinchGraph(flexes);
      if (isFlexError(flexGraph)) {
        return flexGraph;
      }
      drawGraph(ctx, flexGraph);
    }
    return true;
  }

  function drawGraph(ctx: CanvasRenderingContext2D, graph: PinchGraph) {
    ctx.beginPath();
    for (const point of graph.points) {
      ctx.lineTo(point.x * 20 + 100, point.y * 20 + 100);
    }
    ctx.closePath();
    ctx.stroke();
  }

}
