namespace Flexagonator {

  /** lists of possible pieces of flexagon names */
  export interface NamePieceLists {
    readonly overallShapes: string[];
    readonly leafShapes: string[];
    readonly patCounts: number[];
  }

  /**
   * return lists of valid name pieces.
   * optionally filtered to a selected overall shape, leaf shape, and/or pat count
   */
  export function getNamePieces(filter: NamePieces): NamePieceLists {
    // TODO: implement filter
    return {
      overallShapes: overallShapeNames,
      leafShapes: leafShapeNames,
      patCounts: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
    };
  }
}
