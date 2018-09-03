namespace Flexagonator {

  export interface FlexAndColorOptions {
    // a sequence of flexes
    readonly flexes: string;
    // make the new faces these colors
    readonly colors?: number[];
  }

  // apply a series of flexes, coloring & numbering faces whenever a * or + creates new structure
  export function flexAndColor(fm: FlexagonManager, options: FlexAndColorOptions): boolean | FlexError {
    const { flexes, colors } = options;
    const flexNames: FlexName[] = parseFlexSequence(flexes);
    const faceProps = new FaceSetter(colors ? colors : []);

    // first apply all the flexes so the proper structure is created,
    // and run them in reverse so we're back at the start
    const result = fm.applyFlexes(flexNames, false);
    if (isFlexError(result)) {
      return result;
    }
    fm.applyInReverse(flexNames);

    // set properties on the front & back
    faceProps.setFaceProps(fm, true);
    faceProps.setFaceProps(fm, false);

    // now step through each flex, applying leaf properties for a * or +
    for (const flexName of flexNames) {
      if (flexName.shouldGenerate && flexName.shouldApply) {
        // e.g. P*
        fm.applyFlex(flexName);
        faceProps.setFaceProps(fm, true);
      } else if (flexName.shouldGenerate && !flexName.shouldApply) {
        // e.g. P+
        fm.applyFlex(flexName.flexName);  // e.g. P'
        faceProps.setFaceProps(fm, true);
        fm.applyInReverse(flexName.flexName);
      } else {
        fm.applyFlex(flexName);
      }
    }
    return true;
  }

  // used for stepping through the faces and numbering each one, optionally coloring
  class FaceSetter {
    private n: number = 0;

    constructor(private readonly colors: number[]) {
    }

    setFaceProps(fm: FlexagonManager, front: boolean): void {
      fm.setUnsetFaceLabel((this.n + 1).toString(), front);
      if (this.n < this.colors.length) {
        fm.setUnsetFaceColor(this.colors[this.n], front);
      }
      this.n++;
    }
  }
}
