namespace Flexagonator {

  /**
   * create a flex that only impacts a portion of a flexagon,
   * specify pats & directions to the left & right of the current hinge
   * @param patsNeeded number of pats that are unaffected by the flex
   * @param nextId first leaf id to use for the unaffected pats
   * @param rotation how the angles in the first pat after the current hinge get rotated
   * @param shiftDirs shift directions this many hinges to right (or left if <0)
   */
  export function createLocalFlex(name: string, patsNeeded: number, nextId: number,
    inPatLeft: LeafTree[], inPatRight: LeafTree[], outPatLeft: LeafTree[], outPatRight: LeafTree[],
    inDirLeft?: string, inDirRight?: string, outDirLeft?: string, outDirRight?: string,
    rotation?: FlexRotation, shiftDirs?: number
  ): Flex {
    const patCount = inPatLeft.length + patsNeeded + inPatRight.length;
    const input = createLeafTree(patsNeeded, nextId, inPatLeft, inPatRight);
    const output = createLeafTree(patsNeeded, nextId, outPatLeft, outPatRight);
    const inputDirs = createDirectionsOpt(patsNeeded, inDirLeft, inDirRight);
    const outputDirs = createDirectionsOpt(patsNeeded, outDirLeft, outDirRight);
    const fr = rotation === undefined ? FlexRotation.None : rotation;
    const orderOfDirs = createOrderOfDirs(patCount, shiftDirs);
    return makeFlex(name, input, output, fr, inputDirs, outputDirs, orderOfDirs) as Flex;
  }

  /** make [<right>, nextId, nextId+1..., <left>] so current hinge is between left & right */
  function createLeafTree(patsNeeded: number, nextId: number, left: LeafTree[], right: LeafTree[]): LeafTree[] {
    let pats: LeafTree[] = right;
    for (let i = nextId; i < nextId + patsNeeded; i++) {
      pats = pats.concat(i);
    }
    return pats.concat(left);
  }

  /** flex out the directions for the entire flexagon: right + ?'s + left */
  function createDirectionsOpt(
    patsNeeded: number, inDirLeft?: string, inDirRight?: string
  ): string | undefined {
    if (inDirLeft === undefined || inDirRight === undefined) {
      return undefined;
    }
    const dirs = inDirRight + '?'.repeat(patsNeeded) + inDirLeft;
    return dirs;
  }

  /** shift directions this many hinges to right (or left if <0) */
  function createOrderOfDirs(patCount: number, shiftDirs?: number): number[] | undefined {
    if (!shiftDirs) {
      return undefined;
    }
    const orderOfDirs: number[] = [];
    for (let i = 0; i < patCount; i++) {
      orderOfDirs.push((i + shiftDirs + patCount) % patCount + 1);
    }
    return orderOfDirs;
  }

}
