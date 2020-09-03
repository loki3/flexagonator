namespace Flexagonator {

  export interface NamePieces {
    // overall shape of the folded flexagon
    readonly overallShape?: OverallShapeType | string;
    // shape of a leaf
    readonly leafShape?: LeafShapeType;
    // theoretical number of faces
    readonly faceCount?: GreekNumberType;
    // number of pats in the main position
    readonly patsPrefix?: GreekNumberType;
    // total number of leaves
    readonly leaves?: number;
    // flex generating sequence
    readonly generator?: string;
    // internal structure of all the pats
    readonly pats?: LeafTree[];
  }

  // basic shapes, can also add modifiers such as 'regular' and 'ring'
  export type OverallShapeType =
    'triangular' | 'quadrilateral' | 'pentagonal' | 'hexagonal' | 'heptagonal' | 'octagonal' | 'enneagonal' |
    'decagonal' | 'hendecagonal' | 'dodecagonal' |
    'star' | 'octagonal ring' | 'decagonal ring' |
    'square' | 'rectanglular' | 'rhombic';

  // limited to various triangles because other shapes (like squares and pentagons) currently aren't supported
  export type LeafShapeType = 'triangle' | 'regular' | 'isosceles' | 'isosceles triangle'
    | 'right' | 'right triangle' | 'silver' | 'silver triangle' | 'bronze' | 'bronze triangle';

  // greek number prefixes (simplified) - see https://en.wikipedia.org/wiki/List_of_polygons#List_of_n-gons_by_Greek_numerical_prefixes
  export type GreekNumberType =
    'di' | 'tri' | 'tetra' | 'penta' | 'hexa' | 'hepta' | 'octa' | 'ennea' |
    'deca' | 'hendeca' | 'dodeca' | 'trideca' | 'tetradeca' | 'pentadeca' | 'hexadeca' | 'heptadeca' | 'octadeca' | 'enneadeca' |
    'icosa' | 'icosihena' | 'icosidi' | 'icositri' | 'icositetra';

}
