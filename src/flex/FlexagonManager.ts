namespace Flexagonator {

  export enum CenterAngle {
    Is360,
    GreaterThan360 = 1,
    LessThan360 = -1
  }

  export function makeFlexagonManager(flexagon: Flexagon, leafProps?: LeafProperties[]) {
    return new FlexagonManager(flexagon, leafProps);
  }

  /*
    Manages a flexagon, its valid flexes, & applying flexes
  */
  export class FlexagonManager {
    flexagon: Flexagon;
    leafProps: PropertiesForLeaves;
    readonly allFlexes: Flexes;
    readonly primeFlexes: Flexes;
    private angleCenter: number;
    private angleClock: number;
    private readonly history: History;

    constructor(flexagon: Flexagon, leafProps?: LeafProperties[]) {
      this.flexagon = flexagon;
      this.leafProps = new PropertiesForLeaves(leafProps);
      this.allFlexes = makeAllFlexes(flexagon.getPatCount());
      this.primeFlexes = getPrimeFlexes(this.allFlexes);
      this.angleCenter = 60;
      this.angleClock = 60;
      this.setIsosceles();
      this.history = new History(flexagon);
    }

    // possibly flip the flexagon and rotate 'rightSteps',
    // then check which prime flexes can be performed at the current vertex
    checkForPrimeFlexes(flip: boolean, rightSteps: number): string[] {
      var modified = this.flexagon;
      if (flip) {
        modified = this.allFlexes["^"].apply(modified) as Flexagon;
      }
      for (var i = 0; i < rightSteps; i++) {
        modified = this.allFlexes[">"].apply(modified) as Flexagon;
      }
      return checkForFlexes(modified, this.primeFlexes);
    }

    // apply a single flex;
    // if the flex string ends with +, generate the needed structure first
    applyFlex(flexStr: string): boolean | FlexError {
      const generate = (flexStr[flexStr.length - 1] === '+');
      const flexName = generate ? flexStr.substring(0, flexStr.length - 1) : flexStr;
      if (this.allFlexes[flexName] === undefined) {
        return { reason: FlexCode.UnknownFlex, flexName: flexName };
      }

      const input = generate ? this.allFlexes[flexName].createPattern(this.flexagon) : this.flexagon;
      const result = this.allFlexes[flexName].apply(input);
      if (isFlexError(result)) {
        return { reason: FlexCode.CantApplyFlex, flexName: flexName };
      }
      this.flexagon = result;
      this.history.add([flexStr], this.flexagon);
      return true;
    }

    // apply a series of space delimited flexes, e.g. "P > > S'+ ^ T"
    applyFlexes(flexStr: string): boolean | FlexError {
      const flexNames: string[] = flexStr.split(" ");
      for (var flexName of flexNames) {
        const result = this.applyFlex(flexName);
        if (isFlexError(result)) {
          return { reason: FlexCode.CantApplyFlex, flexName: flexName };
        }
      }
      return true;
    }

    setFaceLabel(label: string, front: boolean) {
      const ids = front ? this.flexagon.getTopIds() : this.flexagon.getBottomIds();
      for (var id of ids) {
        this.leafProps.setLabelProp(id, label);
      }
    }

    setFaceColor(color: number, front: boolean) {
      const ids = front ? this.flexagon.getTopIds() : this.flexagon.getBottomIds();
      for (var id of ids) {
        this.leafProps.setColorProp(id, color);
      }
    }

    setAngles(center: number, clock: number) {
      this.angleCenter = center;
      this.angleClock = clock;
    }
    setIsosceles() {
      this.angleCenter = 360 / this.flexagon.getPatCount();
      this.angleClock = (180 - this.angleCenter) / 2;
    }

    // [center angle, clockwise, clockwise]
    getAngles(): number[] {
      const angles: number[] = [this.angleCenter, this.angleClock, 180 - this.angleCenter - this.angleClock];
      const v = this.flexagon.whichVertex;
      if (this.flexagon.isFirstMirrored) {
        return [angles[v], angles[(v + 2) % 3], angles[(v + 1) % 3]];
      }
      return [angles[v], angles[(v + 1) % 3], angles[(v + 2) % 3]];
    }

    getCenterAngleSum(): CenterAngle {
      const angles = this.getAngles();
      const angle = angles[0] * this.flexagon.getPatCount();
      if (Math.round(angle) === 360) {
        return CenterAngle.Is360;
      }
      return (angle < 360) ? CenterAngle.LessThan360 : CenterAngle.GreaterThan360;
    }

    getFlexHistory(): string[] {
      return this.history.getCurrent().flexes;
    }

    undoAll() {
      this.history.undoAll();
      this.flexagon = this.history.getCurrent().flexagon;
    }

    undo() {
      this.history.undo();
      this.flexagon = this.history.getCurrent().flexagon;
    }

    redo() {
      this.history.redo();
      this.flexagon = this.history.getCurrent().flexagon;
    }
  }
}
