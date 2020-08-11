namespace Flexagonator {

  /**
   * convert NamePieces to a series of script commands, reporting any errors encountered
   */
  export function namePiecesToScript(name: NamePieces): [ScriptItem[], NamePiecesError[]] {
    const info: InfoStorer = new InfoStorer();
    if (name.leafShape) {
      const item = leafShapeToScript(name.leafShape);
      info.add(item);
    }
    return [info.script, info.errors];
  }

  /** errors/warnings encountered in namePiecesToScript */
  export interface NamePiecesError {
    readonly nameError: 'unknown leafShape';
    readonly propValue?: string;
  }
  export function isNamePiecesError(result: any): result is NamePiecesError {
    return (result as NamePiecesError).nameError !== undefined;
  }

  // convenient way to track script & errors
  class InfoStorer {
    readonly script: ScriptItem[] = [];
    readonly errors: NamePiecesError[] = [];

    add(item: ScriptItem | NamePiecesError): void {
      if (isNamePiecesError(item)) {
        this.errors.push(item);
      } else {
        this.script.push(item);
      }
    }
  }

  // convert leafShape to ScriptItem
  function leafShapeToScript(leafShape: LeafShapeType): ScriptItem | NamePiecesError {
    switch (leafShape) {
      case 'triangle':
      case 'equilateral triangle':
        return { angles: [60, 60] };
      case 'silver':
      case 'silver triangle':
        return { angles: [45, 45] };
      case 'bronze':
      case 'bronze triangle':
        return { angles: [30, 60] };
      default:
        return { nameError: 'unknown leafShape', propValue: leafShape };
    }
  }

}
