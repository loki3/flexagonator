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
    'square' | 'rectangular' | 'rhombic' | 'kite';

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

}
