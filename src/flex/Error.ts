namespace Flexagonator {

  // check if this is one of the errors Flexagonator can signal
  export function isError(result: any): result is TreeError | PatternError | FlexError {
    return isTreeError(result) || isPatternError(result) || isFlexError(result);
  }

  // get details about an error
  export function errorToString(error: TreeError | PatternError | FlexError): string {
    if (isTreeError(error)) {
      let str = "Tree Error: " + TreeCode[error.reason];
      if (error.context) {
        str += " with context " + error.context.toString();
      }
      return str;
    } else if (isPatternError(error)) {
      let str = "Error in flex pattern definition; ";
      if (error.expected && error.actual) {
        str += "expected '" + error.expected.toString()
          + "' but found '" + error.actual.toString() + "'";
      }
      if (error.expectedDirs && error.actualDirs) {
        str += "expected '" + error.expectedDirs.asString(false)
          + "' but found '" + error.actualDirs.asString(false) + "'";
      }
      return str;
    } else if (isFlexError(error)) {
      let str = "Flex Error: " + FlexCode[error.reason];
      if (error.flexName) {
        str += " for flex " + error.flexName;
      }
      if (error.patternError) {
        str += " because of " + errorToString(error.patternError);
      }
      return str;
    }
    return "no error";
  }

  /*
    Error parsing a leaf tree when creating a pat or flexagon
  */

  export enum TreeCode {
    LeafIdMustBeInt,
    ArrayMustHave2Items,
    TooFewPats,
    ExpectedArray,
    ErrorInSubArray,
    ParseError,
  }

  export interface TreeError {
    readonly reason: TreeCode;
    readonly context: any;
  }

  export function isTreeError(result: any): result is TreeError {
    return (result as TreeError).context !== undefined;
  }



  /** Error looking for substructure in a pat */
  export interface PatternError {
    readonly expected?: LeafTree;
    readonly actual?: LeafTree;
    readonly expectedDirs?: DirectionsOpt;
    readonly actualDirs?: Directions;
  }

  export function isPatternError(result: any): result is PatternError {
    return (result as PatternError).expected !== undefined
      || (result as PatternError).expectedDirs !== undefined;
  }


  /** Error performing a flex on a flexagon */
  export enum FlexCode {
    SizeMismatch,   // input, output, & flexagon arrays should all be same size
    BadFlexInput,   // flex input pattern misformed
    BadFlexOutput,  // flex output template misformed
    UnknownFlex,    // flex isn't one the system knows about
    CantApplyFlex,  // current state of the flexagon doesn't support the flex
    BadDirections,  // the flex's directions between pats are invalid
  }

  export interface FlexError {
    readonly reason: FlexCode;
    readonly patternError?: PatternError;  // set if BadFlexInput
    readonly flexName?: string;            // set for particular flexes
  }

  export function isFlexError(result: any): result is FlexError {
    return result !== null && (result as FlexError).reason !== undefined;
  }
}
