namespace Flexagonator {

  // check if this is one of the errors Flexagonator can signal
  export function isError(result: any): result is TreeError | PatternError | FlexError {
    return isTreeError(result) || isPatternError(result) || isFlexError(result);
  }

  // get details about an error
  export function errorToString(error: TreeError | PatternError | FlexError): string {
    if (isTreeError(error)) {
      let str = "Tree Error: " + error.reason;
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
      let str = "Flex Error: " + error.reason;
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
    LeafIdMustBeInt = 'leaf id must be an integer',
    ArrayMustHave2Items = 'array must have 2 items',
    TooFewPats = 'too few pats',
    InvalidPats = 'invalid pat specification',
    ExpectedArray = 'expected array',
    ErrorInSubArray = 'error in subarray',
    ParseError = 'parse error',
  }

  export interface TreeError {
    readonly reason: TreeCode;
    readonly context: any;
  }

  export function isTreeError(result: any): result is TreeError {
    return result && (result as TreeError).context !== undefined;
  }



  /** Error looking for substructure in a pat */
  export interface PatternError {
    readonly expected?: LeafTree;
    readonly actual?: LeafTree;
    readonly expectedDirs?: DirectionsOpt;
    readonly actualDirs?: Directions;
  }

  export function isPatternError(result: any): result is PatternError {
    return result && ((result as PatternError).expected !== undefined
      || (result as PatternError).expectedDirs !== undefined);
  }


  /** Error performing a flex on a flexagon */
  export enum FlexCode {
    SizeMismatch = 'size mismatch',       // input, output, & flexagon arrays should all be same size
    BadFlexInput = 'bad flex input',      // flex input pattern misformed
    BadFlexOutput = 'bad flex output',    // flex output template misformed
    UnknownFlex = 'unknown flex',         // flex isn't one the system knows about
    CantApplyFlex = 'cant apply flex',    // current state of the flexagon doesn't support the flex
    BadDirections = 'bad pat directions', // the flex's directions between pats are invalid
  }

  export interface FlexError {
    readonly reason: FlexCode;
    readonly patternError?: PatternError;  // set if BadFlexInput
    readonly flexName?: string;            // set for particular flexes
  }

  export function isFlexError(result: any): result is FlexError {
    return result && (result as FlexError).reason !== undefined;
  }
}
