namespace Flexagonator {

  /** get [[top labels], [bottom labels]] */
  export function getLabels(flexagon: Flexagon, leafProps: PropertiesForLeaves) {
    const [topIds, bottomIds] = flexagon.getVisible();
    const topLabels = topIds.map(id => leafProps.getFaceLabel(id));
    const bottomLabels = bottomIds.map(id => leafProps.getFaceLabel(id));
    return [topLabels, bottomLabels];
  }

}
