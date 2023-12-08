namespace Flexagonator {

  /** simplify various tasks around creating flexagons & figuring out their properties */
  export class Creator {
    private fm: FlexagonManager;
    private pieces: NamePieces;
    private generator?: string;
    private pats?: LeafTree[];

    /** pass colors to use when creating flexagons, initializes a default hexa-hexaflexagon */
    constructor(private readonly colors: number[]) {
      this.pieces = { patsPrefix: 6 };
      this.pats = [[0, 0], [[0, 0], [0, 0]], [0, 0], [[0, 0], [0, 0]], [0, 0], [[0, 0], [0, 0]]];
      const script: ScriptItem[] = [
        { pats: this.pats },
        { normalizeIds: true, labelAsTree: colors }
      ];
      this.fm = createFromScript(script) as FlexagonManager;
    }

    getFlexagonManager(): FlexagonManager {
      return this.fm;
    }

    /** get the name of the current flexagon */
    getName() {
      let name = namePiecesToName(this.pieces);
      if (this.generator) {
        name += ` (generator: ${this.generator})`;
      }
      if (this.pats) {
        name += ` (pats: ${JSON.stringify(this.pats)})`;
      }
      return name;
    }

    /** get the directions between pats */
    getDirections(): string {
      const dirs = this.fm.getDirections();
      return !dirs ? '' : dirs.asString(false);
    }

    /** get a list of all supported flexes */
    getSupportedFlexes() {
      // TBD
    }

    runScriptItem(script: ScriptItem): true | FlexError | TreeError {
      const result = runScriptItem(this.fm, script);
      if (isError(result)) {
        return result;
      }
      return true;
    }

    /** use the given name pieces to generate subsequent flexagons */
    setNamePieces(pieces: NamePieces): boolean | TreeError | FlexError {
      if (namePiecesToScript(pieces)[1].length > 0) {
        return false; // not enough pieces to determine flexagon
      }
      this.pieces = pieces;
      this.generator = undefined;
      this.pats = undefined;
      return this.newFlexagon();
    }

    /** create a new flexagon from a flex sequence */
    createFromSequence(flexes: string): boolean | TreeError | FlexError {
      this.generator = flexes;
      this.pats = undefined;
      return this.newFlexagon();
    }

    /** create a new flexagon from a description of the pats to use */
    createFromPats(rawPats: string): boolean | TreeError | FlexError {
      try {
        const parsed = JSON.parse(rawPats);
        if (!Array.isArray(parsed)) {
          return { reason: TreeCode.ExpectedArray, context: rawPats };
        }
        this.pats = parsed;
        return this.newFlexagon();
      } catch (e) {
        return { reason: TreeCode.ExpectedArray, context: rawPats };
      }
    }

    /**
     * create a flexagon given the current creation setting
     * @returns true for success, false if name is incomplete, or specific error
     */
    private newFlexagon(): boolean | TreeError | FlexError {
      // use name pieces if complete enough
      const [script, errors] = namePiecesToScript(this.pieces);
      if (errors.length > 0) {
        return false; // insufficient info, so nothing changed
      }

      // build up complete script for creating flexagon
      if (this.generator) {
        script.push({ flexes: this.generator, history: 'clear' });
      } else if (this.pats) {
        script.push({ pats: this.pats });
      }
      script.push({ labelAsTree: this.colors }); // label & color

      // create flexagon
      const result = Flexagonator.createFromScript(script);
      if (Flexagonator.isError(result)) {
        return result;  // report specific error
      }
      this.fm = result;
      return true;  // success
    }
  }

}
