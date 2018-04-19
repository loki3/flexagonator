namespace Flexagonator {
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
}
