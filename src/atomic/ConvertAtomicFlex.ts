namespace Flexagonator {

  /** convert a flex specified in atomic pat notation to a Flex object */
  export function convertAtomicFlex(
    name: string, patCount: number,
    inPattern: string, outPattern: string, rotation?: FlexRotation
  ): Flex | AtomicParseError {
    const atomicFlex = makeAtomicFlex(name, inPattern, outPattern);
    if (isAtomicParseError(atomicFlex)) {
      return atomicFlex;
    }

    const [inPatLeft, inDirLeft] = convertPats(atomicFlex.input, 'left');
    const [inPatRight, inDirRight] = convertPats(atomicFlex.input, 'right');
    const [outPatLeft, outDirLeft] = convertPats(atomicFlex.output, 'left');
    const [outPatRight, outDirRight] = convertPats(atomicFlex.output, 'right');

    const modifiedCount = getPatsCount(atomicFlex.input.left) + getPatsCount(atomicFlex.input.right);
    const totalLeaves = getLeafCount(atomicFlex.input.left) + getLeafCount(atomicFlex.input.right);

    const flex = createLocalFlex(name, patCount - modifiedCount, totalLeaves + 1,
      inPatLeft, inPatRight, outPatLeft, outPatRight,
      inDirLeft, inDirRight, outDirLeft, outDirRight, rotation);
    return flex;
  }

  function convertPats(pattern: AtomicPattern, side: 'left' | 'right'): [LeafTree[], string] {
    const connected = side === 'left'
      ? pattern.left?.slice().reverse()
      : pattern.right;
    if (connected === null || connected === undefined) {
      return [[], ''];
    }

    const trees: LeafTree[] = [];
    let dirs = '';
    for (const cp of connected) {
      trees.push(cp.pat.getAsLeafTree());
      dirs += cp.direction;
    }
    return [trees, dirs];
  }
}
