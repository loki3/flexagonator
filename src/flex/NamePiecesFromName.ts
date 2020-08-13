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

    const [overallShape, leafShape] = getShapes(words.slice(0, words.length - 1));
    const pinchFaces = getPinchFaces(words[words.length - 1]);
    const patsPrefix = getPatsPrefix(words[words.length - 1]);

    return { overallShape, leafShape, pinchFaces, patsPrefix };
  }

  // in 'triangular bronze penta-hexaflexagon', extract 'triangular' & 'bronze'
  function getShapes(words: string[]): [string | undefined, LeafShapeType | undefined] {
    if (words.length === 0) {
      return [undefined, undefined];
    }
    const lastWord = words[words.length - 1];
    const secondToLastWord = words.length > 1 ? words[words.length - 2] : '';
    if (lastWord === 'silver' || lastWord === 'bronze'
      || (lastWord === 'triangle' && (secondToLastWord !== 'equilateral' && secondToLastWord !== 'silver' && secondToLastWord !== 'bronze'))) {
      // single word for leafShape
      const overallShape = words.length === 1 ? undefined : words.slice(0, words.length - 1).join(' ');
      return [overallShape, lastWord]
    }
    if (lastWord === 'triangle' && (secondToLastWord == 'equilateral' || secondToLastWord == 'silver' || 'bronze')) {
      // two words for leafShape
      const overallShape = words.length === 2 ? undefined : words.slice(0, words.length - 2).join(' ');
      const leafShape = (secondToLastWord + ' ' + lastWord) as LeafShapeType;
      return [overallShape, leafShape];
    }
    // only overall shape
    return [words.join(' '), undefined];
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
