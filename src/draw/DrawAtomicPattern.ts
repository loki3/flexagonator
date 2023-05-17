namespace Flexagonator {

  /** unfold an atomic pattern and draw it */
  export function drawAtomicPatternUnfolded(
    canvas: string | HTMLCanvasElement,
    pattern: AtomicPattern,
    angleInfo: FlexagonAngles,
    options?: DrawStripOptions
  ): void {
    const pats = getAtomicPatternPats(pattern);
    const flexagon = new Flexagon(pats);

    const patternDirections = getAtomicPatternDirections(pattern);
    const directions = patternDirections.map(d => d === '/');

    const leafProps = new PropertiesForLeaves();

    const objects: DrawStripObjects = { flexagon, angleInfo, directions, leafProps };
    Flexagonator.drawUnfoldedObjects(canvas, objects, options);
  }

}
