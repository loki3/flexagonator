namespace Flexagonator {

  // draw possible flexes & create buttons that understand the associated flexes
  export function drawPossibleFlexes(ctx: CanvasRenderingContext2D, fm: FlexagonManager, polygon: Polygon): ScriptButtons {
    var buttons: ScriptButtons = new ScriptButtons();

    const height = polygon.radius / 10;
    ctx.font = height + "px sans-serif";
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";

    const corners = polygon.getCorners();
    var prefix = "";
    for (var i = 0; i < fm.flexagon.getPatCount(); i++) {
      const x = corners[i * 2];
      const y = corners[i * 2 + 1];
      const left = x > polygon.xCenter;
      const up = y > polygon.yCenter;

      const flexes: string[] = fm.checkForFlexes(false, i);
      addFlexes(ctx, flexes, prefix, x, y, height, left, up, buttons);
      prefix += "> ";
    }
    return buttons;
  }

  // draw each flex and add a button that knows how to apply the flex
  function addFlexes(ctx: CanvasRenderingContext2D,
    flexes: string[], prefix: string,
    x: number, y: number, h: number, left: boolean, up: boolean,
    /*output*/ buttons: ScriptButtons) {

    const spaceWidth = ctx.measureText(' ').width;
    y += h;

    for (var flex of flexes) {
      const metrics = ctx.measureText(flex);
      const thisx = left ? x : x - metrics.width;
      const thisy = up ? y : y - h;
      const thisflex = prefix + flex;
      const thisWidth = metrics.width;

      ctx.fillText(flex, thisx, thisy);
      buttons.addFlexButton({ x: thisx, y: thisy - h, w: thisWidth, h: h }, thisflex);

      x = left ? x + thisWidth + spaceWidth : x - thisWidth - spaceWidth;
    }
  }

}
