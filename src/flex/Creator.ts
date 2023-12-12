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
      this.generator = "P* P* P+ > P P+";
      const script: ScriptItem[] = [
        { flexes: this.generator },
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

    /** get all 3 leaf angles as a string with n significant digits */
    getLeafAngles(n: number): string {
      const angles = this.fm.getAngleInfo().getAngles(this.fm.flexagon);
      const twoDigits = angles.map(a => a === Math.trunc(a) ? a.toString() : a.toPrecision(n));
      return `[${twoDigits.join(', ')}]`;
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

    /** get a flexagonator script that can create the current flexagon */
    getCreationScript(): string {
      const script = this.makeNewFlexagonScript();
      if (script.length === 0) {
        return '';
      }
      const content = script.map(item => JSON.stringify(item));
      const text = `[\n${content.join(',\n')}\n]`;
      return text;
    }

    runScriptItem(script: ScriptItem): true | FlexError | TreeError {
      const result = runScriptItem(this.fm, script);
      if (isError(result)) {
        return result;
      }
      this.fm = result;
      return true;
    }

    runScriptString(str: string): true | FlexError | TreeError {
      const result = runScriptString(this.fm, str);
      if (isError(result)) {
        return result;
      }
      this.fm = result;
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
      const script = this.makeNewFlexagonScript();
      if (script.length === 0) {
        return false; // insufficient info, so nothing changed
      }

      // create flexagon
      const result = Flexagonator.createFromScript(script);
      if (Flexagonator.isError(result)) {
        return result;  // report specific error
      }
      this.fm = result;
      return true;  // success
    }

    /**
     * make a script that will create a flexagon given the current creation setting
     * @returns full script needed to create flexagon, or empty script if not enough information
     */
    private makeNewFlexagonScript(): ScriptItem[] {
      // check if name is complete enough
      const [, errors] = namePiecesToScript(this.pieces);
      if (errors.length > 0) {
        return []; // insufficient info, don't create a script
      }
      const name = namePiecesToName(this.pieces);

      // build up complete script for creating flexagon
      const script: ScriptItem[] = [];
      script.push({ name });
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
      return script;
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
