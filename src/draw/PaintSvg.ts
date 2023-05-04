namespace Flexagonator {

  /** interface for drawing flexagons using SVG */
  export class PaintSvg implements Paint {
    private readonly svg: SVGSVGElement;
    private lineWidth: number = 1.5;
    private lineColor: string = "black";
    private fillColor: string = "black";
    private textColor: string = "black";
    private textSize: number = 10;
    private textAnchor: "start" | "middle" | "end" = "start";

    constructor(private readonly container: HTMLElement) {
      const [w, h] = this.getSize();
      this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      this.svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      this.svg.setAttribute("width", w.toString());
      this.svg.setAttribute("height", h.toString());
    }

    start(dontClear?: "dontClear" | undefined): void {
    }
    end(): void {
      this.container.appendChild(this.svg);
    }

    getSize(): [number, number] {
      const width = this.container.getAttribute("width");
      const height = this.container.getAttribute("height");
      return [width === null ? 400 : Number.parseInt(width), height === null ? 400 : Number.parseInt(height)];
    }

    setLineColor(color: string | number): void {
      this.lineColor = colorAsHtmlString(color);
    }
    setFillColor(color: string | number): void {
      this.fillColor = colorAsHtmlString(color);
    }
    setTextColor(color: string | number): void {
      this.textColor = colorAsHtmlString(color);
    }
    setTextSize(pixels: number): void {
      this.textSize = pixels;
    }
    setTextVertical(align: "bottom" | "middle"): void {
    }
    setTextHorizontal(align: "left" | "center" | "right"): void {
      this.textAnchor = align === "left" ? "start" : align === "right" ? "end" : "middle";
    }

    // <path style="" d="M x,y x,y" />
    drawLines(points: Point[], dashed?: "dashed" | undefined): void {
      const dasharray = dashed === "dashed" ? ";stroke-dasharray:10,5" : "";
      const style = `fill:none;stroke:${this.lineColor};stroke-width:${this.lineWidth}${dasharray}`;
      const pstr = points.map(p => `${p.x.toString()},${p.y.toString()}`);
      const d = `M ${pstr.join(' ')}`;

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("style", style);
      path.setAttribute("d", d);
      this.svg.appendChild(path);
    }
    drawPolygon(points: Point[], fill?: "fill" | undefined): void {
      const style = fill === 'fill'
        ? `fill:${this.fillColor}`
        : `fill:none;stroke:${this.lineColor};stroke-width:${this.lineWidth}`;
      const pstr = points.map(p => `${p.x.toString()},${p.y.toString()}`);
      const d = `M ${pstr.join(' ')}`;

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("style", style);
      line.setAttribute("d", d);
      this.svg.appendChild(line);
    }
    drawCircle(center: Point, radius: number): void {
    }

    // <text style="" x="" y="">text</text>
    drawText(str: string, x: number, y: number): void {
      if (str[0] === ' ') {
        // workaround for leading space being dropped in xml
        x += this.textSize * 0.3;
      }
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      const style = `font-size:${this.textSize}px;fill:${this.textColor};font-family:sans-serif;text-anchor:${this.textAnchor}`;
      text.setAttribute("style", style);
      text.setAttribute("x", x.toString());
      text.setAttribute("y", y.toString());
      text.textContent = str;
      this.svg.appendChild(text);
    }
  }
}
