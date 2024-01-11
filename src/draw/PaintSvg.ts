namespace Flexagonator {

  /** interface for drawing flexagons using SVG */
  export class PaintSvg implements Paint {
    private readonly svg: SVGSVGElement;
    private lineWidth: number = 1.5;
    private lineColor: string = "black";
    private fillColor: string = "black";
    private textColor: string = "black";
    private textSize: number = 10;
    private textBaseline: "bottom" | "middle" = "bottom";
    private textAnchor: "start" | "middle" | "end" = "start";

    constructor(private readonly container: HTMLElement) {
      const [w, h] = this.getSize();
      this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      this.svg.setAttribute("viewBox", `0 0 ${w + 2} ${h + 2}`);
      this.svg.setAttribute("width", w.toString());
      this.svg.setAttribute("height", h.toString());
    }

    start(dontClear?: "dontClear" | undefined): void {
      if (dontClear !== "dontClear") {
        this.container.innerHTML = "";  // remove previous svg content
      }
    }
    end(): void {
      this.container.appendChild(this.svg);
    }

    getSize(): [number, number] {
      const width = this.container.getAttribute("width");
      const height = this.container.getAttribute("height");
      const useWidth = width === null ? 400 : Number.parseInt(width) - 2;
      const useHeight = height === null ? 400 : Number.parseInt(height) - 2;
      return [useWidth, useHeight];
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
      this.textBaseline = align;
    }
    setTextHorizontal(align: "left" | "center" | "right"): void {
      this.textAnchor = align === "left" ? "start" : align === "right" ? "end" : "middle";
    }

    // <path d="M x,y x,y" />
    drawLines(points: Point[], dashed?: "dashed" | undefined): void {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

      const pstr = points.map(p => `${p.x.toString()},${p.y.toString()}`);
      const d = `M ${pstr.join(' ')}`;
      path.setAttribute("d", d);

      path.setAttribute("stroke", this.lineColor);
      path.setAttribute("stroke-width", this.lineWidth.toString());
      path.setAttribute("fill", "none");
      if (dashed === "dashed") {
        path.setAttribute("stroke-dasharray", "10,5");
      }

      this.svg.appendChild(path);
    }
    // <polygon points="x,y x,y" />
    drawPolygon(points: Point[], fill?: "fill" | undefined): void {
      const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");

      const pstr = points.map(p => `${p.x.toString()},${p.y.toString()}`);
      const p = `${pstr.join(' ')}`;
      polygon.setAttribute("points", p);

      if (fill === "fill") {
        polygon.setAttribute("fill", this.fillColor.toString());
      } else {
        polygon.setAttribute("stroke", this.lineColor);
        polygon.setAttribute("stroke-width", this.lineWidth.toString());
        polygon.setAttribute("fill", "none");
      }

      this.svg.appendChild(polygon);
    }
    // <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" />
    drawCircle(center: Point, radius: number): void {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

      circle.setAttribute("cx", center.x.toString());
      circle.setAttribute("cy", center.y.toString());
      circle.setAttribute("r", radius.toString());

      circle.setAttribute("stroke", this.lineColor);
      circle.setAttribute("stroke-width", this.lineWidth.toString());
      circle.setAttribute("fill", "none");

      this.svg.appendChild(circle);
    }

    // <text x="" y="">text</text>
    drawText(str: string, x: number, y: number): void {
      if (str[0] === ' ') {
        // workaround for leading space being dropped in xml
        x += this.textSize * 0.3;
      }
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");

      text.setAttribute("x", x.toString());
      text.setAttribute("y", y.toString());
      text.textContent = str;

      text.setAttribute("font-size", this.textSize.toString());
      text.setAttribute("font-family", "sans-serif");
      text.setAttribute("fill", this.textColor);
      text.setAttribute("text-anchor", this.textAnchor.toString());
      if (this.textBaseline === "middle") {
        text.setAttribute("dominant-baseline", "middle");
      }

      this.svg.appendChild(text);
    }
  }
}
