namespace Flexagonator {

  /**
   * create local flexes that transform 4 pats
   * from a position where all pats meet in the middle (\\\\)
   * to a position where there's a "kite" sticking off (/\\/).
   * NOTE: these really should include 'directions' in the flex definitions
   */
  export function makeHalfFlexes(patCount: number): Flexes {
    let flexes: Flexes = {};
    if (patCount < 6) {
      return flexes;
    }

    // flexes from main position to kite position
    flexes["Hb"] = createHalfFlex("half: fold back", patCount - 4, 7,
      [1, [-3, 2]], /**/[-4, [6, -5]],  // 1 2 1 2
      [[1, -2], [4, -3]], /**/[5, 6]);  // 2 2 1 1
    flexes["Hf"] = createHalfFlex("half: fold forward", patCount - 4, 7,
      [[-2, 1], -3], /**/[[5, -4], 6],  // 2 1 2 1
      [1, 2], [[-4, 3], /**/[-5, 6]]);  // 1 1 2 2
    flexes["Hl"] = createHalfFlex("half: fold left back", patCount - 4, 7,
      [[-2, 1], -3], /**/[-4, [6, -5]], // 2 1 1 2
      [1, [4, [2, -3]]], /**/[5, 6]);   // 1 -3 1 1
    flexes["Hr"] = createHalfFlex("half: fold right forward", patCount - 4, 7,
      [[-2, 1], -3], /**/[-4, [6, -5]], // 2 1 1 2
      [1, 2], /**/[[[-4, 5], 3], 6]);   // 1 1 3 1
    flexes["Hsr"] = createHalfFlex("half: partial S right", patCount - 4, 8,
      [1, [[-3, 4], 2]], /**/[5, [-7, 6]],      // 1 3 1 2
      [[1, -2], -3], /**/[[[5, -6], -4], -7]);  // 2 1 3 1
    flexes["Hsl"] = createHalfFlex("half: partial S left", patCount - 4, 8,
      [[-2, 1], -3], /**/[[-6, [-4, 5]], -7],   // 2 1 -3 1
      [1, [4, [2, -3]]], /**/[5, [6, -7]]);     // 1 -3 1 2

    // only works on a hexa
    if (patCount === 6) {
      flexes["Hh"] = makeFlex("half: fold in half",
        [[-2, 1], -3, -4, [6, -5], 7, 8],
        [2, 3, [-5, 4], -6, -7, [1, -8]],
        FlexRotation.None) as Flex;
      flexes["Ht"] = makeFlex("half: partial tuck",
        [2, 3, 4, [-6, 5], -7, [1, -8]],
        [[-2, 1], -3, [5, -4], 6, 7, 8],
        FlexRotation.None) as Flex;
    }

    // flexes that go between kite positions
    flexes["Sp"] = createHalfFlex("partial shuffle", patCount - 5, 8,
      [1, 2, [-4, 3]], /**/[-5, [-6, 7]],
      [[1, -2], -3], /**/[[5, -4], 6, 7]);
    flexes["Lkk"] = createHalfFlex("kite-to-kite slot", patCount - 6, 9,
      [1, 2, 3, 4], /**/[5, [[-7, 6], 8]],
      [[1, [3, -2]], 4], /**/[5, 6, 7, 8]);

    // add all the inverses
    for (const flex of Object.keys(flexes)) {
      flexes[flex + "'"] = flexes[flex].createInverse();
    }

    return flexes;
  }

  function createHalfFlex(name: string, patsNeeded: number, nextId: number,
    inLeft: LeafTree[], inRight: LeafTree[], outLeft: LeafTree[], outRight: LeafTree[]
  ): Flex {
    const input = createLeafTree(patsNeeded, nextId, inLeft, inRight);
    const output = createLeafTree(patsNeeded, nextId, outLeft, outRight);
    return makeFlex(name, input, output, FlexRotation.None) as Flex;
  }

  // make [<right>, nextId, nextId+1..., <left>] so current hinge is between left & right
  function createLeafTree(patsNeeded: number, nextId: number, left: LeafTree[], right: LeafTree[]): LeafTree[] {
    let pats: LeafTree[] = right;
    for (let i = nextId; i < nextId + patsNeeded; i++) {
      pats = pats.concat(i);
    }
    return pats.concat(left);
  }

}
