namespace Flexagonator {

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
    flexesToSearch: Flexes;
    private angleInfo: FlexagonAngles = new FlexagonAngles(60, 60);
    private tracker: Tracker;
    private readonly history: History;

    constructor(flexagon: Flexagon, leafProps?: LeafProperties[]) {
      this.flexagon = flexagon;
      this.leafProps = new PropertiesForLeaves(leafProps);
      this.allFlexes = makeAllFlexes(flexagon.getPatCount());
      this.flexesToSearch = getPrimeFlexes(this.allFlexes);
      this.setIsosceles();
      this.tracker = Tracker.New(flexagon);
      this.history = new History(flexagon, this.tracker.getCopy());
    }

    // apply a single flex;
    // if the flex string ends with +, generate the needed structure
    // if the flex string ends with *, generate the needed structure & apply the flex
    applyFlex(flexStr: string): boolean | FlexError {
      const result = this.rawApplyFlex(flexStr);
      if (isFlexError(result)) {
        return result;
      }
      this.history.add([flexStr], this.flexagon, this.tracker.getCopy());
      return true;
    }

    // apply a series of space delimited flexes, e.g. "P > > S'+ ^ T"
    // as a single undoable operation
    applyFlexes(flexStr: string, separatelyUndoable: boolean): boolean | FlexError {
      const flexNames: string[] = flexStr.split(" ");
      for (var flexName of flexNames) {
        if (flexName.length === 0) {
          continue;
        }
        const result = separatelyUndoable ? this.applyFlex(flexName) : this.rawApplyFlex(flexName);
        if (isFlexError(result)) {
          return { reason: FlexCode.CantApplyFlex, flexName: flexName };
        }
      }
      if (!separatelyUndoable) {
        this.history.add(flexNames, this.flexagon, this.tracker.getCopy());
      }
      return true;
    }

    // run the inverse of the flexes backwards to effectively undo a sequence
    applyInReverse(flexStr: string): boolean | FlexError {
      const flexStrings: string[] = flexStr.split(" ").reverse();
      var inverses = "";
      for (var alias of flexStrings) {
        if (alias.length === 0) {
          continue;
        }
        const flexName = makeFlexName(alias);
        if (flexName.shouldApply) {
          inverses += flexName.getInverse().fullName;
          inverses += ' ';
        }
      }
      return this.applyFlexes(inverses, false);
    }

    // apply a flex without adding it to the history list
    private rawApplyFlex(flexStr: string): boolean | FlexError {
      const flexName = makeFlexName(flexStr);
      const name = flexName.flexName;

      if (this.allFlexes[name] === undefined) {
        return { reason: FlexCode.UnknownFlex, flexName: name };
      }

      const input = flexName.shouldGenerate ? this.allFlexes[name].createPattern(this.flexagon) : this.flexagon;
      const result = flexName.shouldApply ? this.allFlexes[name].apply(input) : input;
      if (isFlexError(result)) {
        return { reason: FlexCode.CantApplyFlex, flexName: name };
      }

      if (flexName.shouldGenerate && this.flexagon.getLeafCount() !== result.getLeafCount()) {
        // whenever we add new structure, start tracking over again
        this.tracker = Tracker.New(result);
      } else {
        this.tracker.findMaybeAdd(result);
      }

      this.flexagon = result;
      return true;
    }

    setFaceLabel(label: string, front: boolean) {
      const ids = front ? this.flexagon.getTopIds() : this.flexagon.getBottomIds();
      for (var id of ids) {
        this.leafProps.setLabelProp(id, label);
      }
    }

    setUnsetFaceLabel(label: string, front: boolean) {
      const ids = front ? this.flexagon.getTopIds() : this.flexagon.getBottomIds();
      for (var id of ids) {
        this.leafProps.setUnsetLabelProp(id, label);
      }
    }

    setFaceColor(color: number, front: boolean) {
      const ids = front ? this.flexagon.getTopIds() : this.flexagon.getBottomIds();
      for (var id of ids) {
        this.leafProps.setColorProp(id, color);
      }
    }

    setUnsetFaceColor(color: number, front: boolean) {
      const ids = front ? this.flexagon.getTopIds() : this.flexagon.getBottomIds();
      for (var id of ids) {
        this.leafProps.setUnsetColorProp(id, color);
      }
    }

    setAngles(center: number, clock: number) {
      this.angleInfo = new FlexagonAngles(center, clock);
    }
    setIsosceles() {
      this.angleInfo = FlexagonAngles.makeIsosceles(this.flexagon);
    }

    getAngleInfo(): FlexagonAngles {
      return this.angleInfo;
    }

    getFlexHistory(): string[] {
      return this.history.getCurrent().flexes;
    }

    getBaseFlexagon(): Flexagon {
      return this.history.getStart().flexagon;
    }

    // get the total number of states this flexagon has been flexed through
    getTotalStates(): number {
      return this.tracker.getTotalStates();
    }

    // out of the all the states this flexagon has been in, get which state we're in currently
    // (0-based)
    getCurrentState(): number {
      return this.tracker.getCurrentState();
    }

    undoAll() {
      this.history.undoAll();
      this.flexagon = this.history.getCurrent().flexagon;
      this.tracker = this.history.getCurrent().tracker.getCopy();
    }

    undo() {
      this.history.undo();
      this.flexagon = this.history.getCurrent().flexagon;
      this.tracker = this.history.getCurrent().tracker.getCopy();
    }

    redo() {
      this.history.redo();
      this.flexagon = this.history.getCurrent().flexagon;
      this.tracker = this.history.getCurrent().tracker.getCopy();
    }

    clearHistory() {
      this.tracker = Tracker.New(this.flexagon);
      this.history.clear(this.flexagon, this.tracker.getCopy());
    }
  }
}
