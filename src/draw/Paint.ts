namespace Flexagonator {

  /** general interface for drawing the details needed for a flexagon */
  export interface Paint {
    start(): void;
    end(): void;

    /** get [width, height] of paint area */
    getSize(): [number, number];

    /** set the line color either as name (e.g., "black") or rgb (e.g., 0x123456) */
    setLineColor(color: string | number): void;
    /** set the fill color either as name (e.g., "black") or rgb (e.g., 0x123456) */
    setFillColor(color: string | number): void;
    /** set the text color either as name (e.g., "black") or rgb (e.g., 0x123456) */
    setTextColor(color: string | number): void;
    /** set the font size in pixels */
    setTextSize(pixels: number): void;
    /** set vertical alignment of text */
    setTextVertical(align: "bottom" | "middle"): void;
    /** set horizontal alignment of text */
    setTextHorizontal(align: "left" | "center" | "right"): void;

    /** draw lines connecting a series of points, optionally drawing them dashed */
    drawLines(points: Point[], dashed?: "dashed"): void;
    /** draw a closed polygon, optionally filling it */
    drawPolygon(points: Point[], fill?: "fill"): void;
    /** draw a circle */
    drawCircle(center: Point, radius: number): void;
    /** draw text */
    drawText(text: string, x: number, y: number): void;
  }

}
