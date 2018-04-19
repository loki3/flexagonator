namespace Flexagonator {
  export enum StructureCode {
    InvalidLeafTree,
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
