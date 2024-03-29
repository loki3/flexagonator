namespace Flexagonator {

  export interface NamePieces {
    // overall shape of the folded flexagon
    readonly overallShape?: OverallShapeType | string;
    // shape of a leaf
    readonly leafShape?: LeafShapeType;
    // theoretical number of faces
    readonly faceCount?: GreekNumberType;
    // number of pats in the main position
    readonly patsPrefix?: GreekNumberType | number;
    // flex generating sequence
    readonly generator?: string;
    // internal structure of all the pats
    readonly pats?: LeafTree[];
  }

  // basic shapes, can also add modifiers such as 'regular' and 'ring'
  export type OverallShapeType =
    'triangular' | 'quadrilateral' | 'pentagonal' | 'hexagonal' | 'heptagonal' | 'octagonal' | 'enneagonal' |
    'decagonal' | 'hendecagonal' | 'dodecagonal' | 'dodecagonal ring' |
    'star' | 'triangular ring' | 'square ring' | 'pentagonal ring' | 'hexagonal ring' | 'octagonal ring' | 'decagonal ring' |
    'square' | 'rectangular' | 'rhombic' | 'kite' |
    'pyramid' | 'bracelet';

  // various triangles are supported, while other shapes have very limited support
  export type LeafShapeType = 'triangle' | 'regular' | 'isosceles' | 'isosceles triangle'
    | 'right' | 'right triangle' | 'silver' | 'silver triangle' | 'bronze' | 'bronze triangle'
    // limited support
    | 'square' | 'rhombus' | 'kite' | 'trapezoid'
    | 'pentagon' | 'hexagon' | 'heptagon' | 'octagon'
    ;

  // greek number prefixes (simplified) - see https://en.wikipedia.org/wiki/List_of_polygons#List_of_n-gons_by_Greek_numerical_prefixes
  export type GreekNumberType =
    'di' | 'tri' | 'tetra' | 'penta' | 'hexa' | 'hepta' | 'octa' | 'ennea' |
    'deca' | 'hendeca' | 'dodeca' | 'trideca' | 'tetradeca' | 'pentadeca' | 'hexadeca' | 'heptadeca' | 'octadeca' | 'enneadeca' |
    'icosa' | 'icosihena' | 'icosidi' | 'icositri' | 'icositetra';

  /** create a full flexagon name from pieces */
  export function namePiecesToName(pieces: NamePieces): string {
    let name = '';
    if (pieces.overallShape) {
      name += pieces.overallShape + ' ';
    }
    if (pieces.leafShape) {
      name += pieces.leafShape + ' ';
    }
    if (pieces.faceCount) {
      name += pieces.faceCount + "-"
    }
    if (pieces.patsPrefix) {
      let prefix = pieces.patsPrefix.toString();
      if (typeof pieces.patsPrefix === 'number') {
        const greek = numberToGreekPrefix(pieces.patsPrefix);
        if (greek) {
          prefix = greek;
        }
      }
      name += prefix;
    }
    name += "flexagon";
    return name;
  }

  export function getPatsPrefixAsNumber(patsPrefix?: GreekNumberType | number): number | null {
    if (patsPrefix === undefined) {
      return null;
    }
    if (typeof patsPrefix === 'string') {
      return greekPrefixToNumber(patsPrefix);
    }
    return patsPrefix;
  }

  export function greekPrefixToNumber(prefix: GreekNumberType): number | null {
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
  function numberToGreekPrefix(n: number): GreekNumberType | null {
    switch (n) {
      case 2: return 'di';
      case 3: return 'tri';
      case 4: return 'tetra';
      case 5: return 'penta';
      case 6: return 'hexa';
      case 7: return 'hepta';
      case 8: return 'octa';
      case 9: return 'ennea';
      case 10: return 'deca';
      case 11: return 'hendeca';
      case 12: return 'dodeca';
      case 13: return 'trideca';
      case 14: return 'tetradeca';
      case 15: return 'pentadeca';
      case 16: return 'hexadeca';
      case 17: return 'heptadeca';
      case 18: return 'octadeca';
      case 19: return 'enneadeca';
      case 20: return 'icosa';
      case 21: return 'icosihena';
      case 22: return 'icosidi';
      case 23: return 'icositri';
      case 24: return 'icositetra';
      default: return null;
    }
  }

}
