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


  /*
    Error performing a flex on a flexagon
  */

  export enum FlexCode {
    SizeMismatch,
    BadFlexInput,
    BadFlexOutput,
  }

  export interface FlexError {
    reason: FlexCode;
    patternError?: PatternError;  // set if BadFlexInput
  }

  export function isFlexError(result: any): result is FlexError {
    return (result as FlexError).reason !== undefined;
  }
}
