namespace Flexagonator {

  /** simplify various tasks around creating flexagons & figuring out their properties */
  export class Creator {
    private fm: FlexagonManager;
    private pieces: NamePieces;
    private generator?: string;
    private pats?: LeafTree[];
    private interestingFlexes: string[] = [];
    private primeFlexes: string = ''

    /** pass colors to use when creating flexagons, initializes a default hexa-hexaflexagon */
    constructor(private readonly colors: number[]) {
      this.pieces = { patsPrefix: 6 };
      this.pats = [[0, 0], [[0, 0], [0, 0]], [0, 0], [[0, 0], [0, 0]], [0, 0], [[0, 0], [0, 0]]];
      const script: ScriptItem[] = [
        { pats: this.pats },
        { normalizeIds: true, labelAsTree: colors }
      ];
      this.fm = createFromScript(script) as FlexagonManager;
      this.interestingFlexes = findInterestingFlexes(this.fm);
      this.primeFlexes = filterToPrime(this.interestingFlexes, 6).join(' ');
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

    /** get a list of flexes to display in the UI */
    getInterestingFlexes(): string[] {
      return this.interestingFlexes;
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

      // reset everything
      this.pieces = pieces;
      this.generator = undefined;
      this.pats = undefined;
      this.interestingFlexes = [];
      this.primeFlexes = '';

      const result = this.newFlexagon();
      if (result === true) {  // figure out flexes to show in UI
        this.interestingFlexes = findInterestingFlexes(this.fm);
        this.primeFlexes = filterToPrime(this.interestingFlexes, this.fm.flexagon.getPatCount()).join(' ');
        runScriptItem(this.fm, { searchFlexes: this.primeFlexes });
      }
      return result;
    }

    /** create a new flexagon from a flex sequence */
    createFromSequence(flexes: string): boolean | TreeError | FlexError {
      this.generator = flexes;
      this.pats = undefined;
      return this.newFlexagon();
    }

    /** create a new flexagon from a description of the pats to use */
    createFromPats(rawPats: string): boolean | TreeError | FlexError {
      const n = getPatsPrefixAsNumber(this.pieces.patsPrefix);
      if (n === null) {
        return false;
      }
      const parsed = parsePats(rawPats, n);
      if (!parsed) {
        return { reason: TreeCode.ParseError, context: rawPats };
      }
      this.pats = parsed;
      this.generator = undefined;
      return this.newFlexagon();
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
      script.push({ addMorphFlexes: true });
      if (this.generator) {
        script.push({ flexes: this.generator, history: 'clear' });
      } else if (this.pats) {
        script.push({ pats: this.pats });
      }
      script.push({ labelAsTree: this.colors }); // label & color
      if (this.primeFlexes.length > 0) {
        script.push({ searchFlexes: this.primeFlexes });
      }

      // create flexagon
      const result = Flexagonator.createFromScript(script);
      if (Flexagonator.isError(result)) {
        return result;  // report specific error
      }
      this.fm = result;
      return true;  // success
    }
  }

  /** figure out which flexes can be used based on pat direction, not pat structure */
  function findInterestingFlexes(fm: FlexagonManager): string[] {
    const flexes: Flexes = {};
    const allNames = Object.getOwnPropertyNames(fm.allFlexes);
    allNames.forEach(name => {
      const c = name[0];  // ignore shifts & rotates
      if (c !== '>' && c !== '<' && c !== '^' && c !== '~') {
        flexes[name] = fm.allFlexes[name];
      }
    })
    const supported = checkForPossibleFlexes(fm.flexagon, fm.allFlexes, flexes);
    return filterToInteresting(supported);
  }

}
