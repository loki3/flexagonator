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
    SizeMismatch,   // input, output, & flexagon arrays should all be same size
    BadFlexInput,   // flex input pattern misformed
    BadFlexOutput,  // flex output template misformed
    UnknownFlex,    // flex isn't one the system knows about
    CantApplyFlex,  // current state of the flexagon doesn't support the flex
  }

  export interface FlexError {
    reason: FlexCode;
    patternError?: PatternError;  // set if BadFlexInput
    flexName?: string;            // set for particular flexes
  }

  export function isFlexError(result: any): result is FlexError {
    return (result as FlexError).reason !== undefined;
  }
}
