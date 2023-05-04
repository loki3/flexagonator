namespace Flexagonator {

  /** interface for drawing flexagons on a canvas */
  export class PaintCanvas implements Paint {
    constructor(private readonly ctx: CanvasRenderingContext2D) { }

    start(dontClear?: "dontClear"): void {
      if (dontClear !== "dontClear") {
        const [width, height] = this.getSize();
        this.ctx.clearRect(0, 0, width, height);
      }
      this.ctx.save();
    }
    end(): void {
      this.ctx.restore();
    }

    getSize(): [number, number] {
      return [this.ctx.canvas.clientWidth, this.ctx.canvas.clientHeight];
    }

    setLineColor(color: string | number): void {
      this.ctx.strokeStyle = colorAsHtmlString(color);
    }
    setFillColor(color: string | number): void {
      this.ctx.fillStyle = colorAsHtmlString(color);
    }
    setTextColor(color: string | number): void {
      this.ctx.fillStyle = colorAsHtmlString(color);
    }
    setTextSize(pixels: number): void {
      this.ctx.font = pixels.toString() + "px sans-serif";
    }
    setTextVertical(align: "bottom" | "middle"): void {
      this.ctx.textBaseline = align;
    }
    setTextHorizontal(align: "left" | "center" | "right"): void {
      this.ctx.textAlign = align;
    }

    drawLines(points: Point[], dashed?: "dashed"): void {
      if (dashed === 'dashed') {
        this.ctx.save();

        this.ctx.setLineDash([10, 5]);
        this.connectTheDots(points);
        // draw white on top for the case where the leaf faces are a solid color
        this.ctx.strokeStyle = "white";
        this.ctx.setLineDash([0, 10, 5, 0]);
        this.connectTheDots(points);

        this.ctx.restore();
      } else {
        this.connectTheDots(points);
      }
    }
    private connectTheDots(points: Point[]): void {
      this.ctx.beginPath();
      points.forEach((p, i) => {
        i === 0 ? this.ctx.moveTo(p.x, p.y) : this.ctx.lineTo(p.x, p.y);
      });
      this.ctx.stroke();
    }

    drawPolygon(points: Point[], fill?: "fill"): void {
      this.ctx.beginPath();
      points.forEach((p, i) => {
        i === 0 ? this.ctx.moveTo(p.x, p.y) : this.ctx.lineTo(p.x, p.y);
      });
      this.ctx.closePath();
      if (fill === "fill") {
        this.ctx.fill();
      }
    }

    drawCircle(center: Point, radius: number): void {
      this.ctx.beginPath();
      this.ctx.ellipse(center.x, center.y, radius, radius, 0, 0, Math.PI * 2);
      this.ctx.stroke();
    }

    drawText(text: string, x: number, y: number): void {
      this.ctx.fillText(text, x, y);
    }
  }

}
