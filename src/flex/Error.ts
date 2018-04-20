namespace Flexagonator {
  /*
    Error parsing a leaf tree when creating a pat or flexagon
  */

  export enum TreeCode {
    LeafIdMustBeInt,
    ArrayMustHave2Items,
    TooFewPats,
  }

  export interface TreeError {
    reason: TreeCode;
    context: any;
  }

  export function isTreeError(result: any): result is TreeError {
    return (result as TreeError).reason !== undefined;
  }


  /*
    Error looking for substructure in a pat
  */

  export interface PatternError {
    expected: LeafTree;
    actual: LeafTree;
  }

  export function isPatternError(result: any): result is PatternError {
    return (result as PatternError).expected !== undefined;
  }
}
