namespace Flexagonator {

  /** lists of possible pieces of flexagon names */
  export interface NamePieceLists {
    readonly overallShapes: string[];
    readonly leafShapes: string[];
    readonly patCounts: number[];
  }

  /**
   * return lists of valid name pieces.
   * optionally filtered to a selected overall shape, leaf shape, and/or pat count
   */
  export function getNamePieces(filter: NamePieces): NamePieceLists {
    // filter to just the flexagon names matching the selected pieces, if any
    const patCount = filter.patsPrefix ? getPatsPrefixAsNumber(filter.patsPrefix) : null;
    const names1 = !filter.overallShape ? flexagonNames : flexagonNames.filter(f => f[0] === filter.overallShape);
    const names2 = !filter.leafShape ? names1 : names1.filter(f => f[1] === filter.leafShape);
    const names3 = !filter.patsPrefix ? names2 : names2.filter(f => f[2] === patCount);

    // make lists of the unique names for each piece
    const overallShapes = getUnique(names3.map(n => n[0]));
    const leafShapes = getUnique(names3.map(n => n[1]).filter(n => n !== ''));
    const patCounts = getUnique(names3.map(n => n[2])).sort((a, b) => a > b ? 1 : -1);

    return { overallShapes, leafShapes, patCounts };
  }

  type NameList = [OverallShapeType, LeafShapeType | '', number];
  /** a collection of supported flexagons by name pieces (not exhaustive) */
  const flexagonNames: NameList[] = [
    ['triangular', 'bronze', 6],
    ['triangular', 'bronze', 18],
    ['triangular ring', 'right', 12],
    ['pyramid', 'regular', 4],
    ['square', 'silver', 4],
    ['square', 'silver', 8],
    ['square', 'silver', 16],
    ['square', 'silver', 32],
    ['square ring', 'right', 16],
    ['rhombic', 'bronze', 4],
    ['rhombic', 'bronze', 12],
    ['rhombic', 'bronze', 16],
    ['kite', 'bronze', 8],
    ['rectangular', 'silver', 16],
    ['pentagonal', 'isosceles', 5],
    ['pentagonal', 'right', 10],
    ['pentagonal', 'silver', 10],
    ['pentagonal ring', 'right', 20],
    ['hexagonal', 'regular', 6],
    ['hexagonal', 'regular', 10],
    ['hexagonal', 'silver', 12],
    ['hexagonal', 'bronze', 12],
    ['hexagonal', 'bronze', 20],
    ['hexagonal ring', 'isosceles', 9],
    ['hexagonal ring', 'regular', 12],
    ['hexagonal ring', 'isosceles', 12],
    ['hexagonal ring', 'regular', 14],
    ['hexagonal ring', 'silver', 14],
    ['hexagonal ring', 'regular', 18],
    ['hexagonal ring', 'regular', 24],
    ['hexagonal ring', 'bronze', 24],
    ['heptagonal', 'isosceles', 7],
    ['octagonal', 'isosceles', 8],
    ['octagonal ring', 'isosceles', 12],
    ['octagonal ring', 'isosceles', 14],
    ['octagonal ring', 'isosceles', 16],
    ['enneagonal', 'isosceles', 9],
    ['decagonal', 'isosceles', 10],
    ['decagonal ring', 'isosceles', 15],
    ['decagonal ring', 'isosceles', 20],
    ['dodecagonal', 'isosceles', 12],
    ['dodecagonal ring', 'isosceles', 24],
    ['star', '', 6],
    ['star', '', 8],
    ['star', 'isosceles', 10],
    ['star', 'isosceles', 12],
    ['star', 'isosceles', 14],
    ['star', 'isosceles', 16],
    ['bracelet', 'regular', 8],
    ['bracelet', 'regular', 10],
    ['bracelet', 'regular', 12],
    ['bracelet', 'regular', 16],
    ['bracelet', 'regular', 20],
    ['bracelet', 'regular', 24],
    ['bracelet', 'silver', 8],
    ['bracelet', 'silver', 12],
    ['bracelet', 'silver', 16],
    ['bracelet', 'silver', 20],
    ['bracelet', 'silver', 24],
  ];

  /** return a list of all the unique items from the list */
  function getUnique<T>(list: T[]): T[] {
    const newList: T[] = [];
    list.forEach(s => { if (newList.indexOf(s) === -1) newList.push(s) });
    return newList;
  }
}
