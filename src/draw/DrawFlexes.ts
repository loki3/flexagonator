namespace Flexagonator {

  // draw possible flexes & create buttons that understand the associated flexes
  export function drawPossibleFlexes(ctx: CanvasRenderingContext2D, regions: RegionForFlexes[], height: number): ScriptButtons {

    const buttons = new ButtonsBuilder();

    ctx.font = height + "px sans-serif";
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";

    for (const i in regions) {
      addFlexes(ctx, regions[i], height, buttons);
    }
    return buttons.create();
  }

  // draw each flex and add a button that knows how to apply the flex
  function addFlexes(ctx: CanvasRenderingContext2D, region: RegionForFlexes, h: number,
    /*output*/ buttons: ButtonsBuilder) {

    const spaceWidth = ctx.measureText(' ').width;
    const pad = 3;
    const y = region.corner.y + h;
    let x = region.corner.x;

    for (let flex of region.flexes) {
      const metrics = ctx.measureText(flex);
      const thisx = region.isOnLeft ? x : x - metrics.width;
      const thisy = region.isOnTop ? y : y - h;
      const thisflex = region.prefix + flex + region.postfix;
      const thisWidth = metrics.width;

      ctx.fillText(flex, thisx, thisy);
      buttons.addFlexButton({ x: thisx - pad, y: thisy - h - pad, w: thisWidth + pad * 2, h: h + pad * 2 }, thisflex);

      x = region.isOnLeft ? x + thisWidth + spaceWidth : x - thisWidth - spaceWidth;
    }
  }

}
