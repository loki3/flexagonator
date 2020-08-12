namespace Flexagonator {

  /**
   * convert a name like 'octagonal dodecaflexagon' into NamePieces,
   * which represents the different pieces extracted from the name
   *
   * [overall shape] [leaf shape] [pinch faces]-[pat count prefix]flexagon [(details)]
   */
  export function namePiecesFromName(name: string): NamePieces {
    const words = name.split(' ');
    if (words.length === 0) {
      return {};
    }

    const pinchFaces = getPinchFaces(words[words.length - 1]);
    const patsPrefix = getPatsPrefix(words[words.length - 1]);

    return { pinchFaces, patsPrefix };
  }

  // in 'triangular bronze penta-hexaflexagon', extract 'penta'
  function getPinchFaces(word: string): GreekNumberType | undefined {
    const chunks = word.split('-');
    return chunks.length >= 2 ? chunks[0] as GreekNumberType : undefined;
  }

  // in 'triangular bronze penta-hexaflexagon', extract 'hexa'
  function getPatsPrefix(word: string): GreekNumberType | undefined {
    const chunks = word.split('-');
    if (chunks.length === 0) {
      return undefined;
    }
    const last = chunks[chunks.length - 1];
    if (!last.endsWith('flexagon')) {
      return undefined;
    }
    const result = last.slice(0, last.length - 8);
    return result === '' ? undefined : result as GreekNumberType;
  }

}
