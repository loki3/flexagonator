namespace Flexagonator {

  // draw possible flexes & create buttons that understand the associated flexes
  export function drawPossibleFlexes(ctx: CanvasRenderingContext2D, flexagon: Flexagon,
    allFlexes: Flexes, flexesToSearch: Flexes, polygon: Polygon): ScriptButtons {

    var buttons = new ButtonsBuilder();

    const height = polygon.radius / 9;
    ctx.font = height + "px sans-serif";
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";

    const corners = polygon.getCorners();
    var prefix = "", postfix = "";
    for (var i = 0; i < flexagon.getPatCount(); i++) {
      const x = corners[i * 2];
      const y = corners[i * 2 + 1];
      const left = x > polygon.xCenter;
      const up = y > polygon.yCenter;

      const flexes: string[] = checkForFlexesAtVertex(flexagon, allFlexes, flexesToSearch, false, i);
      addFlexes(ctx, flexes, prefix, postfix, x, y, height, left, up, buttons);
      prefix += "> ";
      postfix += " <";
    }
    return buttons.create();
  }

  // draw each flex and add a button that knows how to apply the flex
  function addFlexes(ctx: CanvasRenderingContext2D,
    flexes: string[], prefix: string, postfix: string,
    x: number, y: number, h: number, left: boolean, up: boolean,
    /*output*/ buttons: ButtonsBuilder) {

    const spaceWidth = ctx.measureText(' ').width;
    const pad = 3;
    y += h;

    for (var flex of flexes) {
      const metrics = ctx.measureText(flex);
      const thisx = left ? x : x - metrics.width;
      const thisy = up ? y : y - h;
      const thisflex = prefix + flex + postfix;
      const thisWidth = metrics.width;

      ctx.fillText(flex, thisx, thisy);
      buttons.addFlexButton({ x: thisx - pad, y: thisy - h - pad, w: thisWidth + pad * 2, h: h + pad * 2 }, thisflex);

      x = left ? x + thisWidth + spaceWidth : x - thisWidth - spaceWidth;
    }
  }

}
