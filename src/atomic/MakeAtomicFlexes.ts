namespace Flexagonator {

  // dictionary of atomic flexes and their definitions in terms of before & after flexagon structure
  export interface AtomicFlexes {
    [index: string]: AtomicFlex;
  }

  /**
   * create the basic atomic flexes that can be used to build all other flexes
   * @param plusSubFlexes default: just <^UrUl; 'blocks': also include flexes built up from the simplest flexes, e.g. >, Xr, Xl, K; 'all': all flexes
   */
  export function makeAtomicFlexes(plus?: 'blocks' | 'all'): AtomicFlexes {
    const flexes: AtomicFlexes = {};

    addBasicFlexes(flexes);
    if (plus) {
      addBuildingBlocks(flexes);
    }
    if (plus === 'all') {
      addFullFlexes(flexes);
    }

    // add all the inverses
    for (const flex of Object.keys(flexes)) {
      flexes[flex + "'"] = flexes[flex].createInverse();
    }

    return flexes;
  }

  // all flexes are made up of these basic flexes
  function addBasicFlexes(flexes: AtomicFlexes): void {
    flexes[">"] = makeAtomicFlex("shift right", "a # 1 b", "a 1 # b") as AtomicFlex;
    flexes["^"] = makeAtomicFlex("turn over", "a # b", "-b # -a") as AtomicFlex;
    flexes["~"] = makeAtomicFlex("change direction", "a # b", "-a # -b") as AtomicFlex;
    flexes["Ur"] = makeAtomicFlex("unfold right", "a # [-2,1] / b", "a # 1 \\ 2 / -b") as AtomicFlex;

    // special flexes that only work if 'a' & 'b' are actually empty,
    // in other words, the entire pat structure is defined by the pattern
    flexes["Awl"] = makeAtomicWrap('l');
    flexes["Awr"] = makeAtomicWrap('r');
  }

  // create some larger pieces that can more easily be combined into "full" flexes
  function addBuildingBlocks(flexes: AtomicFlexes): void {
    // < = >'
    flexes["<"] = makeAtomicFlex("shift left", "a 1 # b", "a # 1 b") as AtomicFlex;
    // Ul = ~Ur~
    flexes["Ul"] = makeAtomicFlex("unfold left", "a # [1,-2] \\ b", "a # 1 / 2 \\ -b") as AtomicFlex;

    flexes["Xr"] = makeAtomicFlex("exchange right", "a 1 / # [-3,2] / b", "a [1,-2] \\ # -3 \\ b") as AtomicFlex;
    flexes["Xl"] = makeAtomicFlex("exchange left", "a 1 \\ # [2,-3] \\ b", "a [-2,1] / # -3 / b") as AtomicFlex;
    flexes["Xr3"] = makeAtomicFlex("exchange right across 3 pats",
      "a 1 / # 2 \\ [-4,3] / b", "a [1,-2] \\ # -3 / -4 \\ b") as AtomicFlex;
    flexes["Xl3"] = makeAtomicFlex("exchange left across 3 pats",
      "a 1 \\ # 2 / [3,-4] \\ b", "a [-2,1] / # -3 \\ -4 / b") as AtomicFlex;
    flexes["Xr4"] = makeAtomicFlex("exchange right across 4 pats",
      "a 1 / 2 \\ # 3 \\ [-5,4] / b", "a [1,-2] \\ -3 / # -4 / -5 \\ b") as AtomicFlex;
    flexes["Xl4"] = makeAtomicFlex("exchange left across 4 pats",
      "a 1 \\ 2 / # 3 / [4,-5] \\ b", "a [-2,1] / -3 \\ # -4 \\ -5 / b") as AtomicFlex;
    flexes["K"] = makeAtomicFlex("pocket", "a [-2,1] / -3 / # [5,-4] / b", "a 1 \\ 2 / # [-4,3] / -5 / -b") as AtomicFlex;
    flexes["K3a"] = makeAtomicFlex("pocket3", "a [-2,1] / -3 / -4 / # [6,-5] / b", "a 1 \\ 2 / # 3 \\ [-5,4] / -6 / -b") as AtomicFlex;
    flexes["K3b"] = makeAtomicFlex("pocket3", "a [-2,1] / -3 \\ -4 / # [6,-5] / b", "a 1 \\ 2 / # 3 / [-5,4] / -6 / -b") as AtomicFlex;
    flexes["K4"] = makeAtomicFlex("pocket4", "a [-2,1] / -3 / -4 / -5 / # [7,-6] / b", "a 1 \\ 2 / # 3 \\ 4 \\ [-6,5] / -7 / -b") as AtomicFlex;

    flexes["Mkf"] = makeAtomicFlex("morph-kite: fold forward", "a [-2,1] / -3 / # [5,-4] / 6 / b", "a 1 \\ 2 / # [-4,3] / [-5,6] \\ b") as AtomicFlex;
    flexes["Mkb"] = makeAtomicFlex("morph-kite: fold back", "a 1 / [-3,2] / # -4 / [6,-5] / b", "a [1,-2] \\ [4,-3] / # 5 / 6 \\ b") as AtomicFlex;
    flexes["Mkr"] = makeAtomicFlex("morph-kite: fold right", "a [-2,1] / -3 / # -4 / [6,-5] / b", "a 1 \\ 2 / # [[-4,5],3] / 6 \\ b") as AtomicFlex;
    flexes["Mkl"] = makeAtomicFlex("morph-kite: fold left", "a [-2,1] / -3 / # -4 / [6,-5] / b", "a 1 \\ [4,[2,-3]] / # 5 / 6 \\ b") as AtomicFlex;
    flexes["Mkfs"] = makeAtomicFlex("morph-kite: front shuffle",
      "a 1 / [[-3,4],2] / # 5 / [-7,6] / b", "a [1,-2] \\ -3 / # [[5,-6],-4] / -7 \\ b") as AtomicFlex;
    flexes["Mkbs"] = makeAtomicFlex("morph-kite: back shuffle",
      "a [-2, 1] / -3 / # [-6,[-4,5]] / -7 / b", "a 1 \\ [4,[2,-3]] / # 5 / [6,-7] \\ b") as AtomicFlex;
    flexes["Sp"] = makeAtomicFlex("partial shuffle",
      "a 1 / 2 \\ [-4,3] / # -5 / [-6,7] \\ b", "a [1,-2] \\ -3 / # [5,-4] / 6 \\ 7 / b") as AtomicFlex;
    flexes["Lkk"] = makeAtomicFlex("kite-to-kite slot",
      "a 1 / 2 / 3 \\ 4 / # 5 / [[-7,6],8] \\ b", "a [1,[3,-2]] \\ 4 / # 5 / 6 \\ 7 / 8 / b") as AtomicFlex;
  }

  // create flexes that start and end with the same pat directions
  function addFullFlexes(flexes: AtomicFlexes): void {
    flexes["P222"] = makeAtomicFlex("pinch on hexa",
      "a 1 / # [-3,2] / -4 / [6,-5] / 7 / [-9,8] / b", "-a [2,-1] / # 3 / [-5,4] / -6 / [8,-7] / 9 / -b") as AtomicFlex;
    flexes["V"] = makeAtomicFlex("v-flex on hexa",
      "a 7 / [-9,8] / # 1 / [-3,2] / [5,-4] / 6 / b", "-a [8,-7] / 9 / # [2,-1] / 3 / 4 / [-6,5] / -b") as AtomicFlex;

    // from // to //
    flexes["Tf"] = makeAtomicFlex("forced tuck", "a 1 / # [[-3,4],2] / b", "a [3,[1,-2]] / # 4 / b") as AtomicFlex;

    // from /// to ///
    flexes["S"] = makeAtomicFlex("pyramid shuffle",
      "a [[[3,-2],-4],1] / -5 / # [7,-6] / b", "a [-2,1] / -3 / # [7,[-4,[-6,5]]] / b") as AtomicFlex;

    // from //// to ////
    flexes["F"] = makeAtomicFlex("flip",
      "a [[3,-4],[1,-2]] / -5 / # [7,-6] / 8 / b", "a 1 / [-3,2] / # -4 / [[-7,8],[-5,6]] / b") as AtomicFlex;
    flexes["St"] = makeAtomicFlex("silver tetra",
      "a [3,[1,-2]] / 4 / # [7,[5,-6]] / 8 / b", "a 1 / [[-3,4],2] / # 5 / [[-7,8],6] / b") as AtomicFlex;
    flexes["S3"] = makeAtomicFlex("pyramid shuffle 3",
      "a [[[3,-2],-4],1] / -5 / -6 / # [8,-7] / b", "a [-2,1] / -3 / -4 / # [8,[-5,[-7,6]]] / b") as AtomicFlex;
    flexes["Fm"] = makeAtomicFlex("mobius flip",
      "a [[3,-4],[1,-2]] / -5 / -6 / # [8,-7] / b", "a 1 / [-3,2] / -4 / # [8,[-5,[-7,6]]] / b") as AtomicFlex;
    flexes["Tfromm"] = makeAtomicFlex("tuck using morph flexes",
      "a [-2,1] / -3 / -4 / # [[6,-7],-5] / b", "a [-2,1] / -3 / [-6,[-4,5]] / # -7 / b") as AtomicFlex;
    flexes["Sfromm"] = makeAtomicFlex("pyramid shuffle using morph flexes",
      "a 1 / [[[4,-3],-5],2] / -6 / # [8,-7] / b", "a 1 / [-3,2] / -4 / # [8,[-5,[-7,6]]] / b") as AtomicFlex;

    // from ///// to /////
    flexes["F3"] = makeAtomicFlex("flip3",
      "a [[3,-4],[1,-2]] / -5 / -6 / # [8,-7] / 9 / b", "a 1 / [-3,2] / # -4 / -5 / [[-8,9],[-6,7]] / b") as AtomicFlex;

    // from \\ to \\
    flexes["Tr2"] = makeAtomicFlex("transfer2",
      "a 1 \\ # [2,[4,-3]] \\ b", "a [[-2,1],3] \\ # 4 \\ b") as AtomicFlex;

    // from \/\ to \/\
    flexes["Tr3"] = makeAtomicFlex("transfer3",
      "a 1 \\ 2 / # [3,[5,-4]] \\ b", "a [[-2,1],3] \\ # 4 / 5 \\ b") as AtomicFlex;

    // from /\\/ to /\\/
    flexes["Tr4"] = makeAtomicFlex("transfer4",
      "a 1 \\ 2 / # 3 / [4,[6,-5]] \\ b", "a [[-2,1],3] \\ 4 / # 5 / 6 \\ b") as AtomicFlex;
    flexes["Bf"] = makeAtomicFlex("backflip", // = Mkf' Mkb
      "a 1 \\ 2 / # [5,[3,-4]] / [6,[8,-7]] \\ b", "a [[-2,1],3] \\ [[-5,6],4] / # 7 / 8 \\ b") as AtomicFlex;
    flexes["Rsrf"] = makeAtomicFlex("reverse Mkfs' Mkf",
      "a [[-2,1],3] \\ 4 / # [[[7,-6],-8],5] / -9 \\ b", "a 1 \\ 2 / # [-6,[3,[5,-4]]] / [-7,[-9,8]] \\ b") as AtomicFlex;
  }

}
