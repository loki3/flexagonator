namespace Flexagonator {

  export function drawAll(canvasId: string, fm: FlexagonManager) {
    const output: HTMLCanvasElement = document.getElementById(canvasId) as HTMLCanvasElement;
    const ctx = output.getContext("2d") as CanvasRenderingContext2D;

    const xCenter = 300;
    const yCenter = 250;
    const radius = 200;

    drawFlexagon(ctx, fm.flexagon, xCenter, yCenter, radius);
  }

}
