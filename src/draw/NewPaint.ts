namespace Flexagonator {

  /** return the appropriate Paint implementation, either canvas or svg */
  export function newPaint(target: string | HTMLCanvasElement): Paint | null {
    const isCanvas = (target as HTMLCanvasElement).getContext !== undefined;
    if (isCanvas) {
      return new PaintCanvas((target as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D);
    }

    const element = document.getElementById(target as string);
    if (element === null) {
      return null;
    }

    if (element.getAttribute("type") === "image/svg+xml") {
      return new PaintSvg(element);
    }

    return new PaintCanvas((element as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D);
  }

}
