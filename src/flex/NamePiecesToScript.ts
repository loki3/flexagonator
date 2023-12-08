namespace Flexagonator {

  /**
   * convert NamePieces to a series of script commands, reporting any errors encountered
   */
  export function namePiecesToScript(name: NamePieces): [ScriptItem[], NamePiecesError[]] {
    const info: InfoStorer = new InfoStorer();
    const patCount = getPatsPrefixAsNumber(name.patsPrefix);

    // patsPrefix -> numPats
    if (name.patsPrefix) {
      if (patCount === null) {
        info.add({ error: { nameError: 'unknown patsPrefix', propValue: name.patsPrefix.toString() } });
      } else {
        info.add({ numPats: patCount });
      }
    }

    // patCount, !leafShape, !overallShape -> angles
    if (patCount && !name.leafShape && !name.overallShape) {
      const item = patCountToAnglesScript(patCount);
      info.add(item);
    }

    // leafShape -> angles
    if (name.leafShape) {
      const item = leafShapeToScript(name.leafShape, patCount);
      info.add(item);
    }

    // overallShape + patCount + leafShape -> angles, directions
    if (name.overallShape && patCount) {
      const item = overallShapeToScript(name.overallShape as OverallShapeType, patCount, name.leafShape);
      if (item === null) {
        info.add({ error: { nameError: 'unrecognized overall shape', propValue: name.overallShape + ' ' + name.patsPrefix } });
      } else {
        info.add(item);
      }
    }

    // pats -> pats
    if (name.pats) {
      const item = { pats: name.pats };
      info.add(item);
    }

    // generator | faceCount -> flexes | pats
    if (name.generator) {
      // a generating sequence is more specific than faceCount, so try it first
      info.add({ flexes: name.generator });
    } else if (name.faceCount) {
      const item = faceCountToScript(info, name.faceCount);
      info.add(item);
    }

    // if there were no complaints, validate that the results will produce a valid flexagon
    if (info.errors.length === 0) {
      info.validate();
    }

    return [info.asScript(), info.errors];
  }

  /** errors/warnings encountered in namePiecesToScript */
  export interface NamePiecesError {
    readonly nameError:
    | 'unknown patsPrefix'
    | 'unrecognized overall shape'
    | 'unknown leafShape'
    | 'need a face count of at least 2'
    | 'warning: there are multiple possibilities for face count'
    | 'missing the number of pats'
    | 'numPats, pats, and directions should represent the same count'
    ;
    readonly propValue?: string;
  }
  export function isNamePiecesError(result: any): result is NamePiecesError {
    return result && (result as NamePiecesError).nameError !== undefined;
  }

  // assuming pats meet in the middle, figure out the angles
  function patCountToAnglesScript(patCount: number): Description {
    const center = 360 / patCount;
    return { angles2: [center, (180 - center) / 2] };
  }

  // convert overallShape to ScriptItem by leveraging patsPrefix
  function overallShapeToScript(
    overallShape: OverallShapeType, n: number, leafShape?: LeafShapeType
  ): Description | null {
    // number of sides in overall polygon, not including specific shapes like 'rhombic'
    const sides = adjectiveToNumber(overallShape);

    // overallShape & n agree, with optional isosceles
    if (sides === n && (!leafShape || leafShape.startsWith('isosceles'))) {
      return patCountToAnglesScript(n);
    }

    // stars, pats meet in the middle
    if (overallShape === 'star' && (n % 2 === 0 && n >= 6)) {
      switch (n) {
        // 6 & 8 are somewhat arbitrary, since an isosceles triangle wouldn't make a star
        case 6: return { angles2: [60, 15] };
        case 8: return { angles2: [45, 30] };
        // all others are isosceles triangles
        default: return { angles2: [360 / n, 360 / n] };
      }
    }

    // rings with a hole in the middle
    if (overallShape.endsWith('ring') && sides !== null) {
      // e.g. octagonal ring dodecaflexagon
      if (sides >= 6 && sides === 2 * n / 3) {
        return computeRing1Script(n);
      } if (sides === 6 && n === 18) {
        // hexagonal ring octadecaflexagon is special because the pattern would suggest it should be dodecagonal
        return computeRing1Script(n);
      }
      // e.g. triangular ring dodecaflexagon
      if (sides >= 3 && sides === n / 4) {
        return computeRing2Script(n);
      }
      // e.g. hexagonal ring isosceles dodecaflexagon
      if (sides >= 6 && sides === n / 2 && leafShape && leafShape.startsWith('isosceles')) {
        return computeRing3Script(n);
      }

      // hexagonal ring dodecaflexagon
      if (sides === 6 && n === 12) {
        return { angles2: [60, 60], directions: Directions.make('//|/'.repeat(3)) };
      }
      // hexagonal ring tetradecaflexagon
      if (sides === 6 && n === 14 && (!leafShape || leafShape === 'regular')) {
        return { angles2: [60, 60], directions: Directions.make('/|///|/'.repeat(2)) };
      }
      // hexagonal ring silver tetradecaflexagon
      if (sides === 6 && n === 14 && leafShape && leafShape.startsWith('silver')) {
        const directions = Directions.make('/|////|'.repeat(2));
        return { angles2: [90, 45], directions };
      }
      // octagonal ring tetradecaflexagon
      if (sides === 8 && n === 14) {
        return { angles2: [72, 72], directions: Directions.make('|//|//|'.repeat(2)) };
      }
    }

    // triangular bronze octadecaflexagon
    if (sides === 3 && leafShape && leafShape.startsWith('bronze') && n === 18) {
      const directions = Directions.make('/|//|/'.repeat(3));
      return { angles2: [30, 60], directions };
    }

    // hexagonal regular decaflexagon
    if (sides === 6 && leafShape === 'regular' && n === 10) {
      return { directions: Directions.make('//|//'.repeat(2)) };
    }
    // hexagonal silver dodecaflexagon
    if (sides === 6 && leafShape && leafShape.startsWith('silver') && n === 12) {
      const directions = Directions.make('|//'.repeat(4));
      return { angles2: [45, 90], directions };
    }
    if (overallShape === 'rhombic' && (!leafShape || leafShape.startsWith('bronze'))) {
      if (n === 4) {
        // rhombic tetra
        return { angles2: [90, 30] };
      } else if (n === 12) {
        // rhombic dodeca
        const directions = Directions.make('//||//'.repeat(2));
        return { angles2: [60, 90], directions };
      } else if (n === 16) {
        // rhombic hexadeca
        const directions = Directions.make('//|//|//'.repeat(2));
        return { angles2: [30, 90], directions };
      }
    }
    // kite bronze octaflexagon
    if (overallShape === 'kite' && leafShape === 'bronze' && n === 8) {
      const directions = Directions.make('/|////|/');
      return { angles2: [90, 30], directions };
    }
    // pentagonal silver decaflexagon
    if (overallShape === 'pentagonal' && leafShape === 'silver' && n === 10) {
      const directions = Directions.make('///|//|///');
      return { angles2: [45, 45], directions };
    }

    // all pats meet in middle, leaves are right triangles
    if (sides !== null && sides >= 3 && sides === n / 2) {
      return { angles2: [360 / n, 90] };
    }

    return null;
  }

  /// compute a ring flexagon where there's a single pat along each of the n/3 inside edges that form a regular (n/3)-gon
  function computeRing1Script(n: number): Description {
    const sides = 2 * n / 3;
    const total = (sides - 2) * 180;
    // total = sides * a + n * b = sides * a + n * (180 - 2a)
    const a = (total - 180 * n) / (sides - 2 * n);

    const directions = Directions.make('/|/'.repeat(n / 3));
    return { angles2: [a, 180 - 2 * a], directions };
  }

  /// compute a ring flexagon where there are 2 right triangle pats along each of the n/4 inside edges that form a regular (n/4)-gon
  function computeRing2Script(n: number): Description {
    const sides = n / 4;
    const a = 180 * (sides - 2) / (4 * sides);  // each corner of the outer polygon has 4 triangles in it
    const directions = Directions.make('/||/'.repeat(n / 4));
    return { angles2: [90 - a, a], directions };
  }

  /// compute a ring flexagon where there are 2 isosceles triangle pats along each of the n/2 inside edges
  function computeRing3Script(n: number): Description {
    // if you drew a reguluar (n/4)-gon, each corner would contain 2 full triangles & 2 half triangles
    const sides = n / 4;
    const a = ((180 * (sides - 2)) / sides) / 3;
    const directions = Directions.make('/||/'.repeat(n / 4));
    return { angles2: [(180 - a) / 2, a], directions };
  }

  // convert leafShape to ScriptItem
  function leafShapeToScript(leafShape: LeafShapeType, n: number | null): Description {
    if (n) {
      // leafShape & patCount may require a specific orientation
      if ((leafShape.startsWith('silver') || leafShape.startsWith('right')) && n === 4) {
        return { angles2: [90, 45] };
      } else if (leafShape.startsWith('bronze') && n === 4) {
        return { angles2: [90, 30] };
      } else if ((leafShape.startsWith('bronze') || leafShape.startsWith('right')) && n === 6) {
        return { angles2: [60, 90] };
      } else if ((leafShape.startsWith('silver') || leafShape.startsWith('right')) && n === 8) {
        return { angles2: [45, 90] };
      } else if ((leafShape.startsWith('bronze') || leafShape.startsWith('right')) && n === 12) {
        return { angles2: [30, 90] };
      } else if (leafShape.startsWith('right') && n % 2 === 0) {
        return { angles2: [360 / n, 90] };
      }
    }

    // just leafShape by itself
    switch (leafShape) {
      case 'triangle':
      case 'regular':
        return { angles2: [60, 60] };
      case 'silver':
      case 'silver triangle':
        return { angles2: [45, 45] };
      case 'bronze':
      case 'bronze triangle':
        return { angles2: [30, 60] };
      case 'right':
      case 'right triangle':
      case 'isosceles':
      case 'isosceles triangle':
        return {};  // not enough information
      default:
        return { error: { nameError: 'unknown leafShape', propValue: leafShape } };
    }
  }

  function faceCountToScript(info: InfoStorer, faceCount: GreekNumberType): Description {
    const n = greekPrefixToNumber(faceCount);
    if (n === null || n < 2) {
      return { error: { nameError: 'need a face count of at least 2', propValue: faceCount } };
    } else if (n === 2) {
      // don't need to do anything because it defaults to 2 faces
      return {};
    }

    if (info.doPatsMeetInCenter() && info.isEven()) {
      // use a generating sequence
      return faceCountToFlexes(n);
    }
    // create pat structure if possible
    const numPats = info.getNumPats();
    return numPats === null ? {} : faceCountToPats(n, numPats);
  }

  function faceCountToFlexes(n: number): Description {
    if (n < 6) {
      // 3, 4, 5 are all unambiguous
      return { flexes: 'P*'.repeat(n - 2) };
    } else if (n === 6) {
      // we'll assume they want the "straight strip" version
      return {
        flexes: 'P* P* P+ > P P*',
        error: { nameError: 'warning: there are multiple possibilities for face count', propValue: n.toString() }
      };
    }
    // >6 is ambiguous
    return {
      flexes: 'P*^>'.repeat(n - 2),
      error: { nameError: 'warning: there are multiple possibilities for face count', propValue: n.toString() }
    };
  }

  function faceCountToPats(n: number, numPats: number): Description {
    if (n % 2 === 0) {
      // even number of faces, so every pat is the same
      const pats = repeat(getPatStructure(n / 2), numPats) as LeafTree[];
      return { pats };
    } else if (numPats % 2 === 0) {
      // odd number of faces & even number of pats, so pats alternate structure
      const one = getPatStructure(Math.floor(n / 2)) as number[];
      const two = getPatStructure(Math.floor(n / 2) + 1) as number[];
      const pair = one.concat(two);
      const pats = repeat(pair, numPats / 2) as LeafTree[];
      return { pats };
    }
    // can't create an odd number of faces if there's an odd number of pats
    return {};
  }

  // create a well-balanced pat structure with the given number of faces in it
  function getPatStructure(n: number): any {
    // could put more effort into coming up with a general algorithm,
    // but this is good enough for now
    switch (n) {
      case 1: return [0];
      case 2: return [[0, 0]];
      case 3: return [[0, [0, 0]]];
      case 4: return [[[0, 0], [0, 0]]];
      case 5: return [[[[0, 0], 0], [0, 0]]];
      case 6: return [[[[0, 0], 0], [[0, 0], 0]]];
      case 7: return [[[[0, 0], [0, 0]], [[0, 0], 0]]];
      case 8: return [[[[0, 0], [0, 0]], [[0, 0], [0, 0]]]];
      case 9: return [[[[[0, 0], 0], [0, 0]], [[0, 0], [0, 0]]]];
      case 10: return [[[[[0, 0], 0], [0, 0]], [[[0, 0], 0], [0, 0]]]];
      case 11: return [[[[[0, 0], 0], [[0, 0], 0]], [[[0, 0], 0], [0, 0]]]];
      case 12: return [[[[[0, 0], 0], [[0, 0], 0]], [[[0, 0], 0], [[0, 0], 0]]]];
    }
    return [];
  }

  function adjectiveToNumber(adj: string): number | null {
    if (adj.startsWith('triangular')) {
      return 3;
    } else if (adj.startsWith('square')) {
      return 4;
    } else if (adj.startsWith('pentagonal')) {
      return 5;
    } else if (adj.startsWith('hexagonal')) {
      return 6;
    } else if (adj.startsWith('heptagonal')) {
      return 7;
    } else if (adj.startsWith('octagonal')) {
      return 8;
    } else if (adj.startsWith('enneagonal')) {
      return 9;
    } else if (adj.startsWith('decagonal')) {
      return 10;
    } else if (adj.startsWith('hendecagonal')) {
      return 11;
    } else if (adj.startsWith('dodecagonal')) {
      return 12;
    } else if (adj.startsWith('tridecagonal')) {
      return 13;
    } else if (adj.startsWith('tetradecagonal')) {
      return 14;
    } else if (adj.startsWith('pentadecagonal')) {
      return 15;
    } else if (adj.startsWith('hexadecagonal')) {
      return 16;
    }
    return null;
  }

  // repeat an array
  function repeat<T>(a: T[], n: number): T[] {
    let r: T[] = [];
    for (let i = 0; i < n; i++) { r = r.concat(a); }
    return r;
  }

  // convenient way to track script & errors
  class InfoStorer {
    private description: Description = {};
    readonly errors: NamePiecesError[] = [];

    add(item: Description): void {
      this.description = { ...this.description, ...item };
      if (this.description.error) {
        this.errors.push(this.description.error);
      }
    }

    asScript(): ScriptItem[] {
      const script: ScriptItem[] = [];
      if (this.description.pats) {
        script.push({ pats: this.description.pats });
      } else if (this.description.numPats) {
        script.push({ numPats: this.description.numPats });
      }
      if (this.description.angles2) {
        script.push({ angles2: this.description.angles2 });
      }
      if (this.description.directions) {
        script.push({ directions: this.description.directions.asRaw() });
      }
      if (this.description.flexes) {
        script.push({ flexes: this.description.flexes });
      }
      return script;
    }

    getNumPats(): number | null {
      if (this.description.numPats) {
        return this.description.numPats;
      } else if (this.description.pats) {
        return this.description.pats.length;
      }
      return null;
    }
    isEven(): boolean {
      const numPats = this.getNumPats();
      return numPats === null ? false : numPats % 2 === 0;
    }

    doPatsMeetInCenter(): boolean {
      return this.description.directions === undefined;
    }

    validate() {
      // need either numPats or pats
      if (!this.description.numPats && !this.description.pats) {
        this.errors.push({ nameError: 'missing the number of pats' });
      }

      // numPats, pats.length, & directions.length should all match
      const a = this.description.numPats;
      const b = this.description.pats ? this.description.pats.length : 0;
      const c = this.description.directions ? this.description.directions.getCount() : 0;
      if (a !== 0 && b !== 0 && a !== b) {
        this.errors.push({ nameError: 'numPats, pats, and directions should represent the same count' });
      } else if (a !== 0 && c !== 0 && a !== c) {
        this.errors.push({ nameError: 'numPats, pats, and directions should represent the same count' });
      } else if (b !== 0 && c !== 0 && b !== c) {
        this.errors.push({ nameError: 'numPats, pats, and directions should represent the same count' });
      }
    }
  }

  // description of the flexagon that corresponds to the name pieces
  interface Description {
    readonly numPats?: number;
    readonly pats?: LeafTree[];
    readonly angles2?: number[];
    readonly directions?: Directions;
    readonly flexes?: string;

    readonly error?: NamePiecesError;
  }

}
