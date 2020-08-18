namespace Flexagonator {

  /*
    Manages a flexagon, its valid flexes, & applying flexes
  */
  export class FlexagonManager {
    flexagon: Flexagon;
    leafProps: PropertiesForLeaves;
    readonly allFlexes: Flexes;
    flexesToSearch: Flexes;
    interpolateNewLeaves?: 'never' | 'justColor' | 'colorAndLabel' = undefined;
    private angleInfo: FlexagonAngles = FlexagonAngles.makeDefault();
    private directions?: boolean[];
    private tracker: Tracker;
    private readonly history: History;

    constructor(flexagon: Flexagon, leafProps?: LeafProperties[]) {
      this.flexagon = flexagon;
      this.leafProps = new PropertiesForLeaves(leafProps);
      this.allFlexes = makeAllFlexes(flexagon.getPatCount());
      this.flexesToSearch = getPrimeFlexes(this.allFlexes);
      this.setIsosceles();
      this.tracker = Tracker.make(flexagon);
      this.history = new History(flexagon, this.tracker.getCopy());
    }

    static make(flexagon: Flexagon, leafProps?: LeafProperties[]) {
      return new FlexagonManager(flexagon, leafProps);
    }

    // apply a single flex;
    // if the flex string ends with +, generate the needed structure
    // if the flex string ends with *, generate the needed structure & apply the flex
    applyFlex(flexStr: string | FlexName): boolean | FlexError {
      const flexName = (typeof (flexStr) === 'string') ? makeFlexName(flexStr) : flexStr;
      const result = this.rawApplyFlex(flexName);
      if (isFlexError(result)) {
        return result;
      }
      this.history.add([flexName], this.flexagon, this.tracker.getCopy());
      return true;
    }

    // apply a series of flexes, e.g. "P > > S'+ ^ T"
    // as a single undoable operation
    applyFlexes(flexStr: string | FlexName[], separatelyUndoable: boolean): boolean | FlexError {
      const flexNames = (typeof (flexStr) === 'string') ? parseFlexSequence(flexStr) : flexStr;
      for (const flexName of flexNames) {
        const result = separatelyUndoable ? this.applyFlex(flexName) : this.rawApplyFlex(flexName);
        if (isFlexError(result)) {
          return { reason: FlexCode.CantApplyFlex, flexName: flexName.fullName };
        }
      }
      if (!separatelyUndoable) {
        this.history.add(flexNames, this.flexagon, this.tracker.getCopy());
      }
      return true;
    }

    // run the inverse of the flexes backwards to effectively undo a sequence
    applyInReverse(flexStr: string | FlexName[]): boolean | FlexError {
      // note: the call to map makes a copy so .reverse() won't modify the parameter passed to the function
      const forwardFlexNames = (typeof (flexStr) === 'string') ? parseFlexSequence(flexStr) : flexStr.map(f => f);
      const flexNames = forwardFlexNames.reverse();
      const inverseArray = flexNames.map(flexName => flexName.shouldApply ? flexName.getInverse().fullName : '');
      const inverses = inverseArray.join(' ');
      return this.applyFlexes(inverses, false);
    }

    // apply a flex without adding it to the history list
    private rawApplyFlex(flexName: FlexName): boolean | FlexError {
      const name = flexName.flexName;

      if (this.allFlexes[name] === undefined) {
        return { reason: FlexCode.UnknownFlex, flexName: name };
      }

      const [input, splits] = flexName.shouldGenerate
        ? this.allFlexes[name].createPattern(this.flexagon)
        : [this.flexagon, []];
      const result = flexName.shouldApply ? this.allFlexes[name].apply(input) : input;
      if (isFlexError(result)) {
        return { reason: FlexCode.CantApplyFlex, flexName: name };
      }

      if (this.interpolateNewLeaves === 'colorAndLabel' || this.interpolateNewLeaves === 'justColor') {
        splits.forEach(split => interpolateLeaves(split, this.leafProps, this.interpolateNewLeaves === 'colorAndLabel'));
      } else {
        splits.forEach(split => this.leafProps.adjustForSplit(split.getTop(), split.getBottom()));
      }

      if (flexName.shouldGenerate && this.flexagon.getLeafCount() !== result.getLeafCount()) {
        // whenever we add new structure, start tracking over again
        this.tracker = Tracker.make(result);
      } else {
        this.tracker.findMaybeAdd(result);
      }

      this.flexagon = result;
      return true;
    }

    setFaceLabel(label: string, front: boolean) {
      const ids = front ? this.flexagon.getTopIds() : this.flexagon.getBottomIds();
      for (const id of ids) {
        this.leafProps.setLabelProp(id, label);
      }
    }

    setUnsetFaceLabel(label: string, front: boolean): boolean {
      const ids = front ? this.flexagon.getTopIds() : this.flexagon.getBottomIds();
      let anyset = false;
      for (const id of ids) {
        if (this.leafProps.setUnsetLabelProp(id, label)) {
          anyset = true;
        }
      }
      return anyset;
    }

    setFaceColor(color: number, front: boolean) {
      const ids = front ? this.flexagon.getTopIds() : this.flexagon.getBottomIds();
      for (const id of ids) {
        this.leafProps.setColorProp(id, color);
      }
    }

    setUnsetFaceColor(color: number, front: boolean): boolean {
      const ids = front ? this.flexagon.getTopIds() : this.flexagon.getBottomIds();
      let anyset = false;
      for (const id of ids) {
        if (this.leafProps.setUnsetColorProp(id, color)) {
          anyset = true;
        }
      }
      return anyset;
    }

    setAngles(center: number, clock: number) {
      this.angleInfo = FlexagonAngles.makeAngles(center, clock);
    }
    setIsosceles() {
      this.angleInfo = FlexagonAngles.makeIsosceles(this.flexagon);
    }

    getAngleInfo(): FlexagonAngles {
      return this.angleInfo;
    }

    setDirections(directions?: boolean[]) {
      this.directions = directions;
    }
    getDirections(): boolean[] | undefined {
      return this.directions;
    }

    getFlexHistory(): string[] {
      const flexes = this.history.getCurrent().flexes;
      return flexes.map(flex => flex.fullName);
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
      this.tracker = Tracker.make(this.flexagon);
      this.history.clear(this.flexagon, this.tracker.getCopy());
    }
  }
}
