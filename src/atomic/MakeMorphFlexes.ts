namespace Flexagonator {

  /**
   * create local flexes that transform 4 pats
   * from an arrangement where all pats meet in the middle (////)
   * to an arrangement where there's a "kite" sticking off (\//\).
   */
  export function makeMorphFlexes(patCount: number): Flexes {
    let flexes: Flexes = {};
    if (patCount < 6) {
      return flexes;
    }

    // flexes from main position to kite position: //// -> \//\
    flexes["Mkb"] = createLocalFlex("morph-kite: fold back", patCount - 4, 7,
      [1, [-3, 2]], /**/[-4, [6, -5]],  // 1 2 1 2
      [[1, -2], [4, -3]], /**/[5, 6],   // 2 2 1 1
      "//", "//", "|/", "/|", FlexRotation.BCA);
    flexes["Mkf"] = createLocalFlex("morph-kite: fold forward", patCount - 4, 7,
      [[-2, 1], -3], /**/[[5, -4], 6],  // 2 1 2 1
      [1, 2], /**/[[-4, 3], [-5, 6]],   // 1 1 2 2
      "//", "//", "|/", "/|", FlexRotation.BCA);
    flexes["Mkl"] = createLocalFlex("morph-kite: fold left back", patCount - 4, 7,
      [[-2, 1], -3], /**/[-4, [6, -5]], // 2 1 1 2
      [1, [4, [2, -3]]], /**/[5, 6],    // 1 -3 1 1
      "//", "//", "|/", "/|", FlexRotation.BCA);
    flexes["Mkr"] = createLocalFlex("morph-kite: fold right forward", patCount - 4, 7,
      [[-2, 1], -3], /**/[-4, [6, -5]], // 2 1 1 2
      [1, 2], /**/[[[-4, 5], 3], 6],     // 1 1 3 1
      "//", "//", "|/", "/|", FlexRotation.BCA);
    flexes["Mkfs"] = createLocalFlex("morph-kite: front shuffle", patCount - 4, 8,
      [1, [[-3, 4], 2]], /**/[5, [-7, 6]],      // 1 3 1 2
      [[1, -2], -3], /**/[[[5, -6], -4], -7],   // 2 1 3 1
      "//", "//", "|/", "/|", FlexRotation.BCA);
    flexes["Mkbs"] = createLocalFlex("morph-kite: back shuffle", patCount - 4, 8,
      [[-2, 1], -3], /**/[[-6, [-4, 5]], -7],   // 2 1 -3 1
      [1, [4, [2, -3]]], /**/[5, [6, -7]],      // 1 -3 1 2
      "//", "//", "|/", "/|", FlexRotation.BCA);

    // only works on a hexa
    if (patCount === 6) {
      flexes["Mkh"] = makeFlex("morph-kite: fold in half",
        [[-2, 1], -3, -4, [6, -5], 7, 8],
        [2, 3, [-5, 4], -6, -7, [1, -8]],
        FlexRotation.None) as Flex;
      flexes["Mkt"] = makeFlex("morph-kite: partial tuck",
        [2, 3, 4, [-6, 5], -7, [1, -8]],
        [[-2, 1], -3, [5, -4], 6, 7, 8],
        FlexRotation.None) as Flex;
    }

    // flexes that go between kite positions
    flexes["Sp"] = createLocalFlex("partial shuffle", patCount - 5, 8,
      [1, 2, [-4, 3]], /**/[-5, [-6, 7]],
      [[1, -2], -3], /**/[[5, -4], 6, 7]);
    flexes["Lkk"] = createLocalFlex("kite-to-kite slot", patCount - 6, 9,
      [1, 2, 3, 4], /**/[5, [[-7, 6], 8]],
      [[1, [3, -2]], 4], /**/[5, 6, 7, 8]);

    // transfer flexes
    flexes["Tr3"] = createLocalFlex("transfer 3", patCount - 3, 6,
      [1, 2], /**/[[[-4, 5], 3]],
      [[3, [1, -2]], 4], /**/[5],
      "/|", "/", "/|", "/");  // /\#/ -> /\#/
    flexes["Tr4"] = createLocalFlex("transfer 4", patCount - 4, 7,
      [1, 2], /**/[3, [4, [6, -5]]],
      [[[-2, 1], 3], 4], /**/[5, 6],
      "|/", "/|", "|/", "/|"); // \/#/\ -> \/#/\

    // add all the inverses
    for (const flex of Object.keys(flexes)) {
      flexes[flex + "'"] = flexes[flex].createInverse();
    }

    return flexes;
  }

}
