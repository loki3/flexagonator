namespace Flexagonator {

  /** return the appropriate Paint implementation, either canvas or svg */
  export function newPaint(target: string | HTMLCanvasElement): Paint | null {
    // we either have an element name or the element itself
    const element: HTMLElement | null = (typeof target === 'string')
      ? document.getElementById(target as string)
      : target;
    if (element === null) {
      return null;
    }

    // figure out the appropriate paint
    if ((element as HTMLCanvasElement).getContext !== undefined) {
      return new PaintCanvas((element as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D);
    }
    return new PaintSvg(element);
  }

}
