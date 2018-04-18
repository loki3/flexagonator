namespace Flexagonator {

  // returns an array of corners [x1, y1, x2, y2...]
  // the bottom side is parallel to the axis
  export function createPolygon(numSides: number, xCenter: number, yCenter: number, radius: number): number[] {
    var corners: number[] = [];
    if (numSides < 3)
      return corners;

    const angle = 2 * Math.PI / numSides;
    for (var i = 0; i < numSides; i++) {
      var thisAngle = angle * i - Math.PI / 2;
      var x = Math.cos(thisAngle);
      var y = Math.sin(thisAngle);
      corners.push(x * radius + xCenter);
      corners.push(y * radius + yCenter);
    }
    return corners;
  }
}
