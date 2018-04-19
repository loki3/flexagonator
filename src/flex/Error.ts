namespace Flexagonator {
  export enum StructureCode {
    LeafIdMustBeInt,
    ArrayMustHave2Items,
    TooFewPats,
  }

  export interface StructureError {
    reason: StructureCode;
    context: any;
  }

  export function isStructureError(result: any): result is StructureError {
    return (result as StructureError).reason !== undefined;
  }
}
