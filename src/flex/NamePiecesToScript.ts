namespace Flexagonator {

  /**
   * convert NamePieces to a series of script commands, reporting any errors encountered
   */
  export function namePiecesToScript(name: NamePieces): [ScriptItem[], NamePiecesError[]] {
    const info: InfoStorer = new InfoStorer();

    // patsPrefix -> numPats
    if (name.patsPrefix) {
      const item = patsPrefixToScript(name.patsPrefix);
      info.add(item);
    }

    // overallShape + patsPrefix -> angles
    if (name.overallShape && name.patsPrefix) {
      const item = overallShapeToScript(name.overallShape as OverallShapeType, name.patsPrefix);
      info.add(item);
    }

    // leafShape -> angles
    if (name.leafShape) {
      const item = leafShapeToScript(name.leafShape);
      info.add(item);
    }

    // pats -> pats
    if (name.pats) {
      const item = { pats: name.pats };
      info.add(item);
    }

    // generator | pinchFaces -> flexes
    if (name.generator) {
      // a generating sequence is more specific than pinchFaces, so try it first
      info.add({ flexes: name.generator });
    } else if (name.pinchFaces) {
      const [script, error] = pinchFacesToScript(name.pinchFaces);
      info.add(script);
      info.add(error);
    }

    // if there were no complaints, validate that the results will produce a valid flexagon
    if (info.errors.length === 0) {
      const finalError = validateScript(info.script);
      info.add(finalError);
    }

    return [info.script, info.errors];
  }

  /** errors/warnings encountered in namePiecesToScript */
  export interface NamePiecesError {
    readonly nameError:
    | 'unknown patsPrefix'
    | 'unrecognized overall shape'
    | 'unknown leafShape'
    | 'need at least 2 pinch faces'
    | 'warning: there are multiple possibilities for pinch face count'
    | 'missing the number of pats'
    | 'numPats, pats, and directions should represent the same count'
    ;
    readonly propValue?: string;
  }
  export function isNamePiecesError(result: any): result is NamePiecesError {
    return result && (result as NamePiecesError).nameError !== undefined;
  }

  // convenient way to track script & errors
  class InfoStorer {
    readonly script: ScriptItem[] = [];
    readonly errors: NamePiecesError[] = [];

    add(item: ScriptItem | ScriptItem[] | NamePiecesError | null): void {
      if (item === null) {
        return;
      }
      if (isNamePiecesError(item)) {
        this.errors.push(item);
      } else if (Array.isArray(item)) {
        item.forEach(i => this.script.push(i));
      } else {
        this.script.push(item);
      }
    }
  }

  function greekPrefixToNumber(prefix: GreekNumberType): number | null {
    switch (prefix) {
      case 'di': return 2;
      case 'tri': return 3;
      case 'tetra': return 4;
      case 'penta': return 5;
      case 'hexa': return 6;
      case 'hepta': return 7;
      case 'octa': return 8;
      case 'ennea': return 9;
      case 'deca': return 10;
      case 'hendeca': return 11;
      case 'dodeca': return 12;
      case 'trideca': return 13;
      case 'tetradeca': return 14;
      case 'pentadeca': return 15;
      case 'hexadeca': return 16;
      case 'heptadeca': return 17;
      case 'octadeca': return 18;
      case 'enneadeca': return 19;
      case 'icosa': return 20;
      case 'icosihena': return 21;
      case 'icosidi': return 22;
      case 'icositri': return 23;
      case 'icositetra': return 24;
      default: return null;
    }
  }

  function patsPrefixToScript(patsPrefix: GreekNumberType): ScriptItem | NamePiecesError {
    const n = greekPrefixToNumber(patsPrefix);
    if (n === null) {
      return { nameError: 'unknown patsPrefix', propValue: patsPrefix };
    }
    return { numPats: n };
  }

  // convert overallShape to ScriptItem by leveraging patsPrefix
  function overallShapeToScript(overallShape: OverallShapeType, patsPrefix: GreekNumberType): ScriptItem[] | NamePiecesError {
    const n = greekPrefixToNumber(patsPrefix);
    if (n === null) {
      return { nameError: 'missing the number of pats' };
    }

    // all pats meet in middle, leaves are right triangles
    if ((overallShape === 'triangular' && n === 6)
      || (overallShape === 'square' && n === 8)
      || (overallShape === 'pentagonal' && n === 10)
      || (overallShape === 'hexagonal' && n === 12)
      || (overallShape === 'heptagonal' && n === 14)
      || (overallShape === 'octagonal' && n === 16)
      || (overallShape === 'enneagonal' && n === 18)
      || (overallShape === 'decagonal' && n === 20)
    ) {
      return [{ angles: [360 / n, 90] }];
    }

    // stars, pats meet in the middle
    if (overallShape === 'star' && (n % 2 === 0 && n >= 6)) {
      switch (n) {
        // 6 & 8 are somewhat arbitrary, since an isosceles triangle wouldn't make a star
        case 6: return [{ angles: [60, 15] }];
        case 8: return [{ angles: [45, 30] }];
        // all others are isosceles triangles
        default: return [{ angles: [360 / n, 360 / n] }];
      }
    }

    // rings with a hole in the middle
    if (overallShape.endsWith(' ring')) {
      if ((overallShape.startsWith('octagonal') && n === 12)
        || (overallShape.startsWith('decagonal') && n === 15)
        || (overallShape.startsWith('dodecagonal') && n === 18)
        || (overallShape.startsWith('tetradecagonal') && n === 21)
        || (overallShape.startsWith('hexadecagonal') && n === 24)
      ) {
        return computeRing1Script(n);
      }
    }

    return { nameError: 'unrecognized overall shape', propValue: overallShape + ' ' + patsPrefix };
  }

  /// compute a ring flexagon where there's a single pat along each of the n/3 inside edges that form a regular (n/3)-gon
  function computeRing1Script(n: number): ScriptItem[] {
    const sides = 2 * n / 3;
    const total = (sides - 2) * 180;
    // total = sides * a + n * b = sides * a + n * (180 - 2a)
    const a = (total - 180 * n) / (sides - 2 * n);

    let d: boolean[] = [];
    for (let i = 0; i < n / 3; i++) { d = d.concat([true, false, true]); }

    return [{ angles: [a, 180 - 2 * a] }, { directions: d }]
  }

  // convert leafShape to ScriptItem
  function leafShapeToScript(leafShape: LeafShapeType): ScriptItem | NamePiecesError {
    switch (leafShape) {
      case 'triangle':
      case 'equilateral triangle':
        return { angles: [60, 60] };
      case 'silver':
      case 'silver triangle':
        return { angles: [45, 45] };
      case 'bronze':
      case 'bronze triangle':
        return { angles: [30, 60] };
      default:
        return { nameError: 'unknown leafShape', propValue: leafShape };
    }
  }

  function pinchFacesToScript(pinchFaces: GreekNumberType): [ScriptItem | null, NamePiecesError | null] {
    const n = greekPrefixToNumber(pinchFaces);
    if (n === null || n < 2) {
      return [null, { nameError: 'need at least 2 pinch faces', propValue: pinchFaces }];
    } else if (n === 2) {
      // don't need to do anything because it defaults to 2 faces
      return [null, null];
    } else if (n < 6) {
      // 3, 4, 5 are all unambiguous
      const script: ScriptItem = { flexes: 'P*'.repeat(n - 2) };
      return [script, null];
    } else if (n === 6) {
      // we'll assume they want the "straight strip" version
      const script: ScriptItem = { flexes: 'P* P* P+ > P P*' };
      const error: NamePiecesError = { nameError: 'warning: there are multiple possibilities for pinch face count', propValue: pinchFaces };
      return [script, error];
    }
    // >6 is ambiguous
    const script: ScriptItem = { flexes: 'P*'.repeat(n - 2) };
    const error: NamePiecesError = { nameError: 'warning: there are multiple possibilities for pinch face count', propValue: pinchFaces };
    return [script, error];
  }

  // make sure the generated script is ok
  function validateScript(script: ScriptItem[]): NamePiecesError | null {
    // need either numPats or pats
    const numPats = script.filter(item => item.numPats !== undefined);
    const pats = script.filter(item => item.pats !== undefined);
    if (numPats.length === 0 && pats.length === 0) {
      return { nameError: 'missing the number of pats' };
    }

    // numPats, pats.length, & directions.length should all match
    const patsArray = pats.length > 0 ? pats[0].pats : undefined;
    const directions = script.filter(item => item.directions !== undefined);
    const directionsArray = directions.length > 0 ? directions[0].directions : undefined;
    const a = numPats.length === 0 ? 0 : (numPats[0].numPats ? numPats[0].numPats : 0);
    const b = pats.length === 0 ? 0 : (patsArray ? patsArray.length : 0);
    const c = directions.length === 0 ? 0 : (directionsArray ? directionsArray.length : 0);
    if (a !== 0 && b !== 0 && a !== b) {
      return { nameError: 'numPats, pats, and directions should represent the same count' };
    } else if (a !== 0 && c !== 0 && a !== c) {
      return { nameError: 'numPats, pats, and directions should represent the same count' };
    } else if (b !== 0 && c !== 0 && b !== c) {
      return { nameError: 'numPats, pats, and directions should represent the same count' };
    }

    return null;
  }

}
