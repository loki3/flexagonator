namespace Flexagonator {

  /** interface for incrementally searching for cycles */
  export interface FindCycles {
    /**
     * do next incremental step of finding cycles,
     * returns false once it's completely done or there's an error
     */
    checkNext(): boolean;

    /** get info about cycles that were found */
    getCycles(): CycleInfo[];

    /** get error explanation, if any */
    getError(): FindCycleError | null;

    /** total number of cycles, or 0 if we don't know yet */
    getCycleCount(): number;

    /** how many cycles we've found */
    getFoundCount(): number;
  }

  /** flex sequence + how many times you apply it so it cycles back to original state */
  export interface CycleInfo {
    readonly sequence: string;
    readonly cycleLength: number;
  }

  /** explain why findGroupCycles failed */
  export interface FindCycleError {
    readonly findCycleError:
    | 'need definitions for > and ^'
    | 'no other states with same pat structure'
    | 'invalid start';
  }
  export function isGroupCycleError(result: any): result is FindCycleError {
    return result && (result as FindCycleError).findCycleError !== undefined;
  }

}
