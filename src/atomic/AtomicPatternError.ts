namespace Flexagonator {

  /** explanation of a problem detected by matchAtomicPattern */
  export interface AtomicPatternError {
    readonly atomicPatternError: AtomicPatternCode;

    readonly expectedConnected?: ConnectedPat;
    readonly actualConnected?: ConnectedPat;

    readonly expectedPats?: LeafTree;
    readonly actualPats?: LeafTree;
  }
  export type AtomicPatternCode =
    | "NotEnoughPats"
    | "PatMismatch"
    | "DirectionMismatch"
    ;
  export function isAtomicPatternError(result: any): result is AtomicPatternError {
    return (result !== null) && (result as AtomicPatternError).atomicPatternError !== undefined;
  }

  export function atomicPatternErrorToString(error: AtomicPatternError): string {
    let output = error.atomicPatternError;
    if (error.expectedConnected) {
      output += ', expected connected: "' + connectedPatToString(error.expectedConnected) + '"';
    }
    if (error.actualConnected) {
      output += ', actual connected: "' + connectedPatToString(error.actualConnected) + '"';
    }
    if (error.expectedPats) {
      output += ', expected pats: ' + JSON.stringify(error.expectedPats);
    }
    if (error.actualPats) {
      output += ', actual pats: ' + JSON.stringify(error.actualPats);
    }
    return output;
  }
}
