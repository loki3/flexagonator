namespace Flexagonator {

  /** lookup table of flexes, typically by shorthand like P or Tf */
  export interface Flexes {
    [index: string]: Flex;
  }

  export function combineFlexes(f1: Flexes, f2: Flexes): Flexes {
    let flexes: Flexes = {};
    const keys1 = Object.getOwnPropertyNames(f1);
    for (let key of keys1) {
      flexes[key] = f1[key];
    }
    const keys2 = Object.getOwnPropertyNames(f2);
    for (let key of keys2) {
      flexes[key] = f2[key];
    }
    return flexes;
  }

  /** make all the built-in flexes for flexagon with the given number of pats */
  export function makeAllFlexes(patCount: number, includeDirs?: boolean): Flexes {
    let flexes: Flexes = {};
    const dirs = includeDirs ? getIsoDirs(patCount) : undefined;
    if (patCount === 6) {
      flexes = makeHexaFlexes();
    }
    else {
      addRotates(patCount, flexes);
      addLocalFlexes(patCount, flexes);

      if (patCount % 2 == 0)
        flexes["P"] = createPinch(patCount, dirs);
      if (patCount >= 6 && patCount % 2 === 0)
        flexes["V"] = createV(patCount, dirs);
      if (patCount == 8 || patCount == 10 || patCount == 12)
        flexes["Tw"] = createTwist(patCount, dirs);
      if (patCount >= 5)
        flexes["Ltf"] = createLtf(patCount, dirs);
      if (patCount >= 5)
        flexes["Lk"] = createSlotPocket(patCount, dirs);
      if (patCount == 5)
        flexes["L3"] = createSlotTriplePocket(dirs);

      for (let i = 0; i < patCount - 5; i++) {
        const s = "T" + (i + 1).toString();
        flexes[s] = createTuck(patCount, i, dirs);
      }

      addSinglePinches(patCount, flexes);
      addDoublePinches(patCount, flexes);
    }

    // add all the inverses
    for (const flex of Object.keys(flexes)) {
      flexes[flex + "'"] = flexes[flex].createInverse();
    }

    return flexes;
  }

  /** make all the built-in flexes for a hexaflexagon */
  function makeHexaFlexes(): Flexes {
    const flexes: Flexes = {};

    addRotates(6, flexes);
    addLocalFlexes(6, flexes);

    flexes["P"] = makeFlex("pinch flex",
      [[-2, 1], -3, [5, -4], 6, [-8, 7], -9],
      [2, [-4, 3], -5, [7, -6], 8, [1, 9]], FlexRotation.BAC) as Flex;
    flexes["T"] = makeFlex("tuck flex",
      [[[-2, 3], 1], 4, 5, [-7, 6], -8, -9],
      [3, 4, 5, [-7, 6], -8, [2, [-9, -1]]], FlexRotation.None) as Flex;
    flexes["Ttf"] = makeFlex("tuck top front",
      [[[-2, 3], 1], [-5, 4], -6, [8, -7], 9, 10],
      [[4, -3], 5, [-7, 6], -8, [[10, -1], -9], -2], FlexRotation.None) as Flex;
    flexes["V"] = makeFlex("v flex",
      [1, [-3, 2], [5, -4], 6, 7, [-9, 8]],
      [[2, -1], 3, 4, [-6, 5], [8, -7], 9], FlexRotation.CBA) as Flex;
    flexes["Ltf"] = makeFlex("slot tuck top front",
      [[[[3, -2], -4], 1], -5, -6, -7, [9, -8], 10],
      [10, [-2, 1], -3, -4, -5, [9, [-6, [-8, 7]]]], FlexRotation.ACB) as Flex;
    flexes["Ltb"] = makeFlex("slot tuck top back",
      [[[-2, [-4, 3]], 1], -5, -6, -7, [9, -8], 10],
      [-1, -2, -3, [5, -4], [[-7, 8], 6], [-10, 9]], FlexRotation.BAC) as Flex;
    flexes["Lbf"] = makeFlex("slot tuck bottom front",
      [[[-2, 3], 1], [-5, 4], -6, -7, [9, -8], 10],
      [[-3, 2], -4, [6, -5], [-8, 7], -9, [1, -10]], FlexRotation.CBA) as Flex;
    flexes["Lbb"] = makeFlex("slot tuck bottom back",
      [[[-2, 3], 1], [-5, 4], -6, -7, [[9, -10], -8], -11],
      [-2, [4, -3], 5, [[-7, 8], 6], 9, [[-11, -1], 10]], FlexRotation.BCA) as Flex;
    flexes["Lh"] = makeFlex("slot half",
      [[[-2, [-4, 3]], 1], -5, -6, -7, [[9, -10], -8], -11],
      [[[-11, -1], 10], -2, -3, [5, -4], [[-7, 8], 6], 9], FlexRotation.BAC) as Flex;
    flexes["Lk"] = makeFlex("slot pocket",
      [[[[3, -2], -4], 1], -5, -6, -7, [[[-10, 9], 11], -8], 12],
      [10, [-2, [11, [1, -12]]], -3, -4, -5, [9, [-6, [-8, 7]]]], FlexRotation.ACB) as Flex;
    flexes["Tk"] = makeFlex("ticket flex",
      [1, 2, 3, [-5, 4], [[[-8, 7], 9], -6], [-11, 10]],
      [-8, [6, -7], [-4, 5], -3, -2, [[10, -9], [-1, -11]]], FlexRotation.None) as Flex;

    return flexes;
  }

  /** return just the flexes that can't be done using other flexes */
  export function getPrimeFlexes(all: Flexes, patCount?: number): Flexes {
    const flexes: Flexes = {};

    for (const prime of primes) {
      if (all[prime] !== undefined) {
        flexes[prime] = all[prime];
      }
    }
    // S3 is special in that it's not prime for n=6|7, but is for n>=8
    if (patCount && patCount >= 8 && all['S3'] !== undefined) {
      flexes['S3'] = all['S3'];
    }

    return flexes;
  }

  export function filterToPrime(flexes: string[], patCount: number): string[] {
    const filtered = flexes.filter(f => primes.indexOf(f) !== -1);
    if (patCount >= 8 && flexes.indexOf('S3') !== -1) {
      filtered.push('S3');
    }
    return filtered;
  }

  /** filter 'flexes' to eliminate redundancies (e.g., P not P', but both T & T') */
  export function filterToInteresting(flexes: string[]): string[] {
    const filtered = flexes.filter(f => primes.indexOf(f) !== -1 || unique.indexOf(f) !== -1);
    return filtered;
  }

  const primes = [
    "P", "S", "V", "F", "Tw", "Ltf", "Ltb", "Ltb'",
    "T", "T'", "Tf", "T1", "T1'", "T2", "T2'",  // limit the tuck variants
    "Bf", "Tr2", "Tr3", "Tr4",            // local: directions other than ////
    "Ds", "Tu", "Tao", "Hat", "Fet",      // global: directions other than ////
  ];
  const unique = [  // interesting non-primes
    "S3", "St", "Fm", "F3", "F4",
    "Lbf", "Lbb", "Lh", "Lk", "L3",
    "P44d", "P333d", "P334d", "P55d", "P3333d", "P444d", "P66d", "P3434d",
  ];

  /** add ><^~ */
  function addRotates(patCount: number, flexes: Flexes) {
    const input = [], rightOut = [], leftOut = [], overOut = [], changeOut = [];
    const rightDirs = [], leftDirs = [], overDirs = [], changeDirs = [];
    for (let i = 0; i < patCount; i++) {
      input[i] = i + 1;
      rightOut[i] = i + 2 > patCount ? 1 : i + 2;
      leftOut[i] = i < 1 ? patCount : i;
      overOut[i] = i - patCount;
      changeOut[i] = -i - 1;
      // directions start at 1
      rightDirs[i] = i == patCount - 1 ? 1 : i + 2;
      leftDirs[i] = i == 0 ? patCount : i;
      overDirs[i] = patCount - i;
      changeDirs[i] = -(i + 1); // means that direction should be reversed
    }
    flexes[">"] = makeFlex("shift right", input, rightOut, FlexRotation.Right, undefined, undefined, rightDirs) as Flex;
    flexes["<"] = makeFlex("shift left", input, leftOut, FlexRotation.Left, undefined, undefined, leftDirs) as Flex;
    flexes["^"] = makeFlex("turn over", input, overOut, FlexRotation.None, undefined, undefined, overDirs) as Flex;
    flexes["~"] = makeFlex("change directions", input, changeOut, FlexRotation.CBA, undefined, undefined, changeDirs) as Flex;
  }

  /** add flexes that only impact a subset of pats */
  function addLocalFlexes(patCount: number, flexes: Flexes) {
    flexes["Tf"] = createLocalFlex("forced tuck", patCount - 2, 5,
      [1], /**/[[[-3, 4], 2]],
      [[3, [1, -2]]], /**/[4],
      "/", "/", "/", "/");  // /#/

    if (patCount === 4 || patCount >= 6) {
      flexes["St"] = createLocalFlex("silver tetra", patCount - 4, 9,
        [[3, [1, -2]], 4], /**/[[7, [5, -6]], 8],
        [1, [[-3, 4], 2]], /**/[5, [[-7, 8], 6]],
        "//", "//", "//", "//");  // //#//
    }

    if (patCount >= 5) {
      flexes["S"] = createLocalFlex("pyramid shuffle", patCount - 3, 8,
        [[[[3, -2], -4], 1], -5], /**/[[7, -6]],
        [[-2, 1], -3], /**/[[7, [-4, [-6, 5]]]],
        "//", "/", "//", "/");  // //#/
    }

    if (patCount >= 6) {
      flexes["F"] = createLocalFlex("flip", patCount - 4, 9,
        [[[3, -4], [1, -2]], -5], /**/[[7, -6], 8],
        [1, [-3, 2]], /**/[-4, [[-7, 8], [-5, 6]]],
        "//", "//", "//", "//");  // //#//
      flexes["Fm"] = createLocalFlex("mobius flip", patCount - 4, 9,
        [[[3, -4], [1, -2]], -5, -6], /**/[[8, -7]],
        [1, [-3, 2], -4], /**/[[8, [-5, [-7, 6]]]],
        "///", "/", "///", "/");  // ///#/
      flexes["S3"] = createLocalFlex("pyramid shuffle 3", patCount - 4, 9,
        [[[[3, -2], -4], 1], -5, -6], /**/[[8, -7]],
        [[-2, 1], -3, -4], /**/[[8, [-5, [-7, 6]]]],
        "///", "/", "///", "/");  // ///#/
    }

    if (patCount >= 10) {
      flexes["F3"] = createLocalFlex("flip 3", patCount - 5, 10,
        [[[3, -4], [1, -2]], -5, -6], /**/[[8, -7], 9],
        [1, [-3, 2]], /**/[-4, -5, [[-8, 9], [-6, 7]]],
        "///", "//", "///", "//", FlexRotation.Left, -1);  // ///#// => //#///
    }
    if (patCount >= 12) {
      flexes["F4"] = createLocalFlex("flip 4", patCount - 6, 11,
        [[[3, -4], [1, -2]], -5, -6, -7], /**/[[9, -8], 10],
        [1, [-3, 2]], /**/[-4, -5, -6, [[-9, 10], [-7, 8]]],
        "////", "//", "////", "//", FlexRotation.None, -2);  // ////#// => //#////
    }
  }

  function createPinch(patCount: number, dirs?: string): Flex {
    // (1,2) (3) ... (i,i+1) (i+2) ... (n-2,n-1) (n)
    // (^1) (5,^3) ... (^i) (i+4,^i+2) ... (^n-2) (2,^n)
    const input: LeafTree = [];
    const output: LeafTree = [];
    const leaves = patCount * 3 / 2;
    for (let i = 0; i < patCount; i += 2) {
      const a = (i / 2) * 3 + 1;

      // e.g. (1,2) (3)
      input.push([a, a + 1]);
      input.push(a + 2);

      // e.g. (^1) (5,^3)
      output.push(-a);
      let b = (a + 2) % leaves;
      b = (b == 0 ? leaves : b);
      output.push([(a + 4) % leaves, -b]);
    }
    return makeFlex("pinch flex", input, output, FlexRotation.BAC, dirs, dirs) as Flex;
  }

  /** adds some single pinch flexes for the given number of pats */
  function addSinglePinches(patCount: number, flexes: Flexes) {
    if (patCount === 8) {
      flexes["P44"] = createSinglePinch(patCount, [4]);
    }
    if (patCount === 9) {
      flexes["P333"] = createSinglePinch(patCount, [3, 6]);
    }
    if (patCount === 10) {
      flexes["P334"] = createSinglePinch(patCount, [3, 6]);
      flexes["P55"] = createSinglePinch(patCount, [5]);
    }
    if (patCount === 12) {
      flexes["P3333"] = createSinglePinch(patCount, [3, 6, 9]);
      flexes["P444"] = createSinglePinch(patCount, [4, 8]);
      flexes["P66"] = createSinglePinch(patCount, [6]);
    }
    if (patCount === 14) {
      flexes["P3434"] = createSinglePinch(patCount, [3, 7, 10]);
    }
  }

  /** creates a single pinch where 'which' lists the hinges you pinch at */
  function createSinglePinch(patCount: number, which: number[]): Flex {
    // 'which' lists the vertices where the basic unit will be applied after 0, e.g. [3,6] for P333
    // e.g. [ [-2,1], -3, -4, [6,-5], 7, 8, [-10,9], -11, -12 ]
    //      [ 2, 3, [-5,4], -6, -7, [9,-8], 10, 11, [1,12] ]
    // dirs /? //? //? /
    //      /?'//?'//?'/
    /*
    # [-2,1] / -3 ? -4 / [6,-5] / 7 ? 8 / [-10,9] / -11 ? -12 /
    # 2 / 3 ?' [-5,4] / -6 / -7 ?' [9,-8] / 10 / 11 ?' [1,12] /

    # [-2,1] / -3 ? -4 ? -5 / [7,-6] / 8 ? 9 ? 10 / [-12,11] / -13 ? -14 ? -15 /
    # 2 / 3 ?' 4 ?' [-6,5] / -7 / -8 ?' -9 ?' [11,-10] / 12 / 13 ?' 14 ?' [1,15] /
    */
    const input: LeafTree = [];
    const output: LeafTree = [];

    // input
    let iWhich = -1;
    let iLeaf = 1;
    for (let iPat = 0; iPat < patCount; iPat++) {
      const even = iWhich % 2 === 0;
      if ((iWhich == -1) || (iWhich < which.length && which[iWhich] === iPat)) {
        input.push(even ? [iLeaf + 1, -iLeaf] : [-(iLeaf + 1), iLeaf]);
        iWhich++;
        iLeaf += 2;
      } else {
        input.push(even ? -iLeaf : iLeaf);
        iLeaf++
      }
    }

    // output
    iWhich = 0;
    iLeaf = 2;
    for (let iPat = 0; iPat < patCount; iPat++) {
      const even = iWhich % 2 === 0;
      if (iWhich < which.length && which[iWhich] - 1 === iPat) {
        output.push(even ? [-(iLeaf + 1), iLeaf] : [iLeaf + 1, -iLeaf]);
        iWhich++;
        iLeaf += 2;
      } else if (iPat === patCount - 1) {
        output.push([1, iLeaf]);
      } else {
        output.push(even ? iLeaf : -iLeaf);
        iLeaf++;
      }
    }

    // directions, e.g., (12,[4,4]) -> in: /??//??//??/, out: /?'?'//?'?'//?'?'/
    let directions = "";
    for (iWhich = 0; iWhich < which.length + 1; iWhich++) {
      const mid = iWhich === 0 ? which[0] :
        iWhich === which.length ? patCount - which[which.length - 1] :
          which[iWhich] - which[iWhich - 1];
      directions += "/" + "?".repeat(mid - 2) + "/";
    }
    // all the ?'s need to flip
    const orderOfDirs: number[] = [];
    for (let i = 0; i < directions.length; i++) {
      orderOfDirs.push(directions[i] === '?' ? -(i + 1) : i + 1);
    }

    // e.g. patCount=9 & which=[3,6] turns into "333"
    let nums = which[0].toString();
    for (let i = 1; i < which.length; i++) {
      nums += (which[i] - which[i - 1]).toString();
    }
    nums += (patCount - which[which.length - 1]).toString();
    return makeFlex("pinch " + nums, input, output, FlexRotation.BAC, directions, directions, orderOfDirs) as Flex;
  }

  /** adds some double pinch flexes for the given number of pats */
  function addDoublePinches(patCount: number, flexes: Flexes) {
    if (patCount === 8) {
      flexes["P44d"] = createDoublePinch(patCount, [4]);
    }
    if (patCount === 9) {
      flexes["P333d"] = createDoublePinch(patCount, [3, 6]);
    }
    if (patCount === 10) {
      flexes["P334d"] = createDoublePinch(patCount, [3, 6]);
      flexes["P55d"] = createDoublePinch(patCount, [5]);
    }
    if (patCount === 12) {
      flexes["P3333d"] = createDoublePinch(patCount, [3, 6, 9]);
      flexes["P444d"] = createDoublePinch(patCount, [4, 8]);
      flexes["P66d"] = createDoublePinch(patCount, [6]);
    }
    if (patCount === 14) {
      flexes["P3434d"] = createDoublePinch(patCount, [3, 7, 10]);
    }
  }

  /** creates a double pinch where 'which' lists the hinges you pinch at */
  function createDoublePinch(patCount: number, which: number[]): Flex {
    // basic 2-pat unit: [1, [[2, 3], 4]]  ->  [[2, [1, -4]], 3]
    // 'which' lists the vertices where the basic unit will be applied after 0, e.g. [3,6] for P333d
    // e.g. [[1,3], 2], 4, 5, [[6,8], 7], 9, 10, [[11,13], 12], 14, 15
    //      3, 4, [-6, [5,-7]], 8, 9, [-11, [10,-12]], 13, 14, [-1, [15,-2]]
    const input: LeafTree = [];
    const output: LeafTree = [];

    // input
    let iWhich = -1;
    let iLeaf = 1;
    for (let iPat = 0; iPat < patCount; iPat++) {
      if ((iWhich == -1) || (iWhich < which.length && which[iWhich] === iPat)) {
        input.push([[iLeaf, iLeaf + 2], iLeaf + 1]);
        iWhich++;
        iLeaf += 3;
      } else {
        input.push(iLeaf++);
      }
    }

    // output
    iWhich = 0;
    iLeaf = 3;
    for (let iPat = 0; iPat < patCount; iPat++) {
      if (iWhich < which.length && which[iWhich] - 1 === iPat) {
        output.push([-(iLeaf + 1), [iLeaf, -(iLeaf + 2)]]);
        iWhich++;
        iLeaf += 3;
      } else if (iPat === patCount - 1) {
        output.push([-1, [iLeaf, -2]]);
      } else {
        output.push(iLeaf);
        iLeaf++;
      }
    }

    // directions, e.g., (12,[4,4]) -> /??//??//??/
    let directions = "";
    for (iWhich = 0; iWhich < which.length + 1; iWhich++) {
      const mid = iWhich === 0 ? which[0] :
        iWhich === which.length ? patCount - which[which.length - 1] :
          which[iWhich] - which[iWhich - 1];
      directions += "/" + "?".repeat(mid - 2) + "/";
    }

    // e.g. patCount=9 & which=[3,6] turns into "333d"
    let nums = which[0].toString();
    for (let i = 1; i < which.length; i++) {
      nums += (which[i] - which[i - 1]).toString();
    }
    nums += (patCount - which[which.length - 1]).toString();
    return makeFlex("pinch " + nums + "d", input, output, FlexRotation.None, directions, directions) as Flex;
  }

  function createV(patCount: number, dirs?: string): Flex {
    // (1) (^3,2) ... (i) (^i+2,i+1) ... (n-4,^n-5) (n-3)  (n-2) (^n,n-1)
    // (2,^1) (3) ... (i+1,^i) (i+2) ... (n-5) (^n-3,n-4)  (n-1,^n-2) (n)
    const input: LeafTree = [];
    let output: LeafTree = [];
    const leaves = patCount * 3 / 2;

    // like pinch flex
    for (let i = 1; i < leaves - 6; i += 3) {
      input.push(i);
      input.push([-(i + 2), i + 1]);
      output.push([i + 1, -i]);
      output.push(i + 2);
    }

    // v-flex treats these pats differently
    input.push([leaves - 4, -(leaves - 5)]);
    input.push(leaves - 3);
    output.push(leaves - 5);
    output.push([-(leaves - 3), leaves - 4]);

    // like pinch flex
    input.push(leaves - 2);
    input.push([-leaves, leaves - 1]);
    output.push([leaves - 1, -(leaves - 2)]);
    output.push(leaves);

    // shift output so that V' = ^V^
    if (patCount > 6) {
      const shift = patCount - 6;
      const one = output.slice(shift);
      const two = output.slice(0, shift);
      output = one.concat(two);
    }

    return makeFlex("v flex", input, output, FlexRotation.CBA, dirs, dirs) as Flex;
  }

  function createTwist(patCount: number, dirs?: string): Flex {
    var input: LeafTree = [];
    var output: LeafTree = [];
    if (patCount == 8) {
      input = [[2, -1], [-4, 3], -5, -6, [8, -7], [-10, 9], -11, -12];
      output = [-2, -3, [5, -4], [-7, 6], -8, -9, [11, -10], [-1, 12]];
    } else if (patCount == 10) {
      input = [[1, 2], [3, 4], 5, [6, 7], 8, [9, 10], 11, [12, 13], 14, 15];
      output = [-1, -4, [-5, 3], -7, [-8, 6], -10, [-11, 9], -13, [-14, 12], [2, -15]];
    } else if (patCount == 12) {
      input = [[1, 2], [3, 4], 5, [6, 7], 8, 9, [10, 11], [12, 13], 14, [15, 16], 17, 18];
      output = [-1, -4, [-5, 3], -7, [-8, 6], [11, -9], -10, -13, [-14, 12], -16, [-17, 15], [2, -18]];
    }
    return makeFlex("twist flex", input, output, FlexRotation.CBA, dirs, dirs) as Flex;
  }

  function createLtf(patCount: number, dirs?: string): Flex {
    // (((1,2)3)4) ... (i) ... (n-4) (n-3) (n-2,n-1) (n)
    // (n) (2,4) (^1) (3) ... (i) ... (n-2(n-4(n-1,^n-3)))
    const input: LeafTree = [];
    const output: LeafTree = [];
    const leaves = patCount + 4;

    input.push([[[1, 2], 3], 4]);
    for (let i = 5; i < patCount + 2; i++) {
      input.push(i);
    }
    input.push([leaves - 2, leaves - 1]);
    input.push(leaves);

    // post
    output.push(leaves);
    output.push([2, 4]);
    output.push(-1);
    output.push(3);
    for (let i = 5; i < patCount; i++) {
      output.push(i);
    }
    output.push([leaves - 2, [leaves - 4, [leaves - 1, -(leaves - 3)]]]);

    return makeFlex("slot tuck top front", input, output, FlexRotation.ACB, dirs, dirs) as Flex;
  }

  function createSlotPocket(patCount: number, dirs?: string): Flex {
    // (((1,2)3)4) ... (i) ... (n-5) (((n-4,n-3)n-2)n-1) (n)
    // (^n-4) (2(n-2(4,^n))) (^1) (3) ... (i) ... (n-3(n-6(n-1,^n-5)))
    const input: LeafTree = [];
    const output: LeafTree = [];
    const leaves = patCount + 6;

    input.push([[[1, 2], 3], 4]);
    for (let i = 5; i < patCount + 2; i++) {
      input.push(i);
    }
    input.push([[[leaves - 4, leaves - 3], leaves - 2], leaves - 1]);
    input.push(leaves);

    // post
    output.push(-(leaves - 4));
    output.push([2, [leaves - 2, [4, -leaves]]]);
    output.push(-1);
    output.push(3);
    for (let i = 5; i < patCount; i++) {
      output.push(i);
    }
    output.push([leaves - 3, [leaves - 6, [leaves - 1, -(leaves - 5)]]]);

    return makeFlex("slot pocket", input, output, FlexRotation.ACB, dirs, dirs) as Flex;
  }


  function createSlotTriplePocket(dirs?: string): Flex {
    const input: LeafTree = [[[[12, -11], -13], 10], [[[2, -1], -3], -14], -4, [[[-7, 6], 8], -5], 9];
    const output: LeafTree = [-2, [6, [-3, [-5, 4]]], 7, [-11, [8, [10, -9]]], [-1, [-12, [-14, 13]]]];
    return makeFlex("slot triple pocket", input, output, FlexRotation.None, dirs, dirs) as Flex;
  }

  // where: which opposite hinge is open starting from 0
  function createTuck(patCount: number, where: number, dirs?: string): Flex {
    // ((1,2)3) (4) ... (i,i+1) ... (n-1) (n)
    // (2) (4) ... (i,i+1) ... (n-1) (^1(n,^3))
    const input: LeafTree = [];
    const output: LeafTree = [];
    const leaves = patCount + 3;

    input.push([[1, 2], 3]);
    for (let i = 4; i <= leaves; i++) {
      if (i == where + 6) {
        input.push([i, i + 1]);
      }
      else if (i != where + 7) {
        input.push(i);
      }
    }

    output.push(2);
    for (let i = 4; i < leaves; i++) {
      if (i == where + 6) {
        output.push([i, i + 1]);
      }
      else if (i != where + 7) {
        output.push(i);
      }
    }
    output.push([-1, [leaves, -3]]);

    const name = "tuck" + (where == 0 ? "" : (where + 1).toString());
    return makeFlex(name, input, output, FlexRotation.None, dirs, dirs) as Flex;
  }

  /** get the pat directions for an isoflexagon with all pats meeting in the center */
  function getIsoDirs(patCount: number): string {
    let s = '';
    for (let i = 0; i < patCount; i++) s += '/';
    return s;
  }

}
