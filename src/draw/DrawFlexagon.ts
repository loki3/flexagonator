namespace Flexagonator {

  export function drawFlexagon(canvasId: string, numSides: number) {
    const output: HTMLCanvasElement = document.getElementById(canvasId) as HTMLCanvasElement;
    const ctx = output.getContext("2d") as CanvasRenderingContext2D;
    ctx.strokeStyle = "rgb(90, 150, 210)";

    ctx.moveTo(20, 20);
    ctx.lineTo(200, 200);
    ctx.stroke();
  }

}
