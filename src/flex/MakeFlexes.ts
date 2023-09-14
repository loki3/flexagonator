namespace Flexagonator {

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

  export function makeAllFlexes(patCount: number): Flexes {
    let flexes: Flexes = {};
    if (patCount === 6) {
      flexes = makeHexaFlexes();
    }
    else {
      addRotates(patCount, flexes);

      if (patCount % 2 == 0)
        flexes["P"] = createPinch(patCount);
      if (patCount >= 5)
        flexes["S"] = createPyramidShuffle(patCount);
      if (patCount >= 6)
        flexes["S3"] = createPyramidShuffle3(patCount);
      if (patCount >= 6 && patCount % 2 === 0)
        flexes["V"] = createV(patCount);
      if (patCount >= 6)
        flexes["F"] = createFlip(patCount);
      if (patCount >= 6)
        flexes["Fm"] = createMobiusFlip(patCount);
      if (patCount === 4 || patCount >= 6)
        flexes["St"] = createSilverTetra(patCount);
      if (patCount == 8 || patCount == 10 || patCount == 12)
        flexes["Tw"] = createTwist(patCount);
      if (patCount >= 5)
        flexes["Ltf"] = createLtf(patCount);
      if (patCount >= 5)
        flexes["Lk"] = createSlotPocket(patCount);
      if (patCount == 5)
        flexes["L3"] = createSlotTriplePocket();

      flexes["Tf"] = createForcedTuck(patCount);
      for (let i = 0; i < patCount - 5; i++) {
        const s = "T" + (i + 1).toString();
        flexes[s] = createTuck(patCount, i);
      }

      addDoublePinches(patCount, flexes);
    }

    // add all the inverses
    for (const flex of Object.keys(flexes)) {
      flexes[flex + "'"] = flexes[flex].createInverse();
    }

    return flexes;
  }

  // return just the flexes that can't be done using other flexes
  export function getPrimeFlexes(all: Flexes, patCount?: number): Flexes {
    const flexes: Flexes = {};
    const primes = ["P", "S", "T", "T'", "V", "F", "Tw", "Ltf", "Ltb", "Ltb'", "T1", "T1'", "T2", "T2'", "T3", "T3'", "Tf"];

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

  function makeHexaFlexes(): Flexes {
    const flexes: Flexes = {};

    addRotates(6, flexes);

    flexes["P"] = makeFlex("pinch flex",
      [[-2, 1], -3, [5, -4], 6, [-8, 7], -9],
      [2, [-4, 3], -5, [7, -6], 8, [1, 9]], FlexRotation.BAC) as Flex;
    flexes["T"] = makeFlex("tuck flex",
      [[[-2, 3], 1], 4, 5, [-7, 6], -8, -9],
      [3, 4, 5, [-7, 6], -8, [2, [-9, -1]]], FlexRotation.None) as Flex;
    flexes["Tf"] = makeFlex("forced tuck",
      [[[-2, 3], 1], 4, 5, 6, 7, 8],
      [3, 4, 5, 6, 7, [2, [8, -1]]], FlexRotation.None) as Flex;
    flexes["Ttf"] = makeFlex("tuck top front",
      [[[-2, 3], 1], [-5, 4], -6, [8, -7], 9, 10],
      [[4, -3], 5, [-7, 6], -8, [[10, -1], -9], -2], FlexRotation.None) as Flex;
    flexes["S"] = makeFlex("pyramid shuffle",
      [[-2, 1], -3, -4, -5, [[[-8, 7], 9], -6], 10],
      [[-2, [9, [1, -10]]], -3, -4, -5, [7, -6], 8], FlexRotation.None) as Flex;
    flexes["S3"] = makeFlex("pyramid shuffle 3",
      [[-2, 1], -3, -4, [[[-7, 6], 8], -5], 9, 10],
      [[-2, [9, [1, -10]]], -3, -4, [6, -5], 7, 8], FlexRotation.None) as Flex;
    flexes["V"] = makeFlex("v flex",
      [1, [-3, 2], [5, -4], 6, 7, [-9, 8]],
      [[2, -1], 3, 4, [-6, 5], [8, -7], 9], FlexRotation.CBA) as Flex;
    flexes["F"] = makeFlex("flip flex",
      [[-2, 1], -3, -4, -5, [[-8, 9], [-6, 7]], 10],
      [9, [[2, -3], [10, -1]], -4, -5, -6, [8, -7]], FlexRotation.None) as Flex;
    flexes["Fm"] = makeFlex("mobius flip",
      [[-2, 1], -3, -4, [[-7, 8], [-5, 6]], 9, 10],
      [[-2, [9, [1, -10]]], -3, -4, -5, [7, -6], 8], FlexRotation.None) as Flex;
    flexes["St"] = makeFlex("silver tetra flex",
      [[3, [1, -2]], 4, 5, 6, [9, [7, -8]], 10],
      [1, [[-3, 4], 2], 5, 6, 7, [[-9, 10], 8]], FlexRotation.None) as Flex;
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
    flexes[">"] = makeFlex("shift right", input, rightOut, FlexRotation.Right, rightDirs) as Flex;
    flexes["<"] = makeFlex("shift left", input, leftOut, FlexRotation.Left, leftDirs) as Flex;
    flexes["^"] = makeFlex("turn over", input, overOut, FlexRotation.None, overDirs) as Flex;
    // disable ~ for now since it causes a test slowdown, seems to specifically be 'changeOut'
    //flexes["~"] = makeFlex("change directions", input, changeOut, FlexRotation.CBA, changeDirs) as Flex;
  }

  function addDoublePinches(patCount: number, flexes: Flexes) {
    if (patCount === 8) {
      flexes["P44"] = createDoublePinch(patCount, [4]);
    }
    if (patCount === 9) {
      flexes["P333"] = createDoublePinch(patCount, [3, 6]);
    }
    if (patCount === 10) {
      flexes["P334"] = createDoublePinch(patCount, [3, 6]);
      flexes["P55"] = createDoublePinch(patCount, [5]);
    }
    if (patCount === 12) {
      flexes["P3333"] = createDoublePinch(patCount, [3, 6, 9]);
      flexes["P444"] = createDoublePinch(patCount, [4, 8]);
      flexes["P66"] = createDoublePinch(patCount, [6]);
    }
  }

  function createPinch(patCount: number): Flex {
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
    return makeFlex("pinch flex", input, output, FlexRotation.BAC) as Flex;
  }

  function createDoublePinch(patCount: number, which: number[]): Flex {
    // basic unit: [1, [[2, 3], 4]]  ->  [[2, [1, -4]], 3]
    // 'which' lists the vertices where the basic unit will be applied after 0, e.g. [3,6] for P333
    // e.g. [[1,3], 2], 4, 5, [[6,8], 7], 9, 10, [[11,13], 12], 14, 15
    //      3, 4, [-6, [5,-7]], 8, 9, [-11, [10,-12]], 13, 14, [-1, [15,-2]]
    const input: LeafTree = [];
    const output: LeafTree = [];

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

    // e.g. patCount=9 & which=[3,6] turns into "333"
    let nums = which[0].toString();
    for (let i = 1; i < which.length; i++) {
      nums += (which[i] - which[i - 1]).toString();
    }
    nums += (patCount - which[which.length - 1]).toString();
    return makeFlex("pinch " + nums, input, output, FlexRotation.None) as Flex;
  }

  function createPyramidShuffle(patCount: number): Flex {
    // (1,2) (3) ... (i) ... (((n-4,n-3)n-2)n-1) (n)
    // (1(n-2(2,^n))) (3) ... (i) ... (n-3,n-1) (^n-4)
    const input: LeafTree = [];
    const output: LeafTree = [];
    const leaves = patCount + 4;

    input.push([1, 2]);
    for (let i = 3; i < patCount; i++) {
      input.push(i);
    }
    input.push([[[leaves - 4, leaves - 3], leaves - 2], leaves - 1]);
    input.push(leaves);

    // post
    output.push([1, [leaves - 2, [2, -leaves]]]);
    for (let i = 3; i < patCount; i++) {
      output.push(i);
    }
    output.push([leaves - 3, leaves - 1]);
    output.push(-(leaves - 4));

    return makeFlex("pyramid shuffle", input, output, FlexRotation.None) as Flex;
  }

  // same as the pyramid shuffle, except that you open up 3 pats instead of 2
  function createPyramidShuffle3(patCount: number): Flex {
    // (2,-1) (3) ... (i) ... (((n-3,^n-4)^n-2)n-5) (^n-1) (^n)
    // (2(^n-1,(^1,n))) (3) ... (i) ... (^n-4,n-5) (^n-3) (^n-2)
    const input: LeafTree = [];
    const output: LeafTree = [];
    const leaves = patCount + 4;

    input.push([2, -1]);
    for (let i = 3; i < patCount - 1; i++) {
      input.push(i);
    }
    input.push([[[leaves - 3, 4 - leaves], 2 - leaves], leaves - 5]);
    input.push(1 - leaves);
    input.push(-leaves);

    // post
    output.push([2, [1 - leaves, [-1, leaves]]]);
    for (let i = 3; i < patCount - 1; i++) {
      output.push(i);
    }
    output.push([4 - leaves, leaves - 5]);
    output.push(3 - leaves);
    output.push(2 - leaves);

    return makeFlex("pyramid shuffle 3", input, output, FlexRotation.None) as Flex;
  }

  function createV(patCount: number): Flex {
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

    return makeFlex("v flex", input, output, FlexRotation.CBA) as Flex;
  }

  function createFlip(patCount: number): Flex {
    // (1,2) (3) ... (i) ... ((n-4,n-3)(n-2,n-1)) (n)
    // (n-3) ((^1,3)(n,^2)) ... (i) ... (n-2) (^n-4,^n-1)
    const input: LeafTree = [];
    const output: LeafTree = [];
    const leaves = patCount + 4;

    input.push([1, 2]);
    for (let i = 3; i < patCount; i++) {
      input.push(i);
    }
    input.push([[leaves - 4, leaves - 3], [leaves - 2, leaves - 1]]);
    input.push(leaves);

    output.push(leaves - 3);
    output.push([[-1, 3], [leaves, -2]]);
    for (let i = 4; i < patCount; i++) {
      output.push(i);
    }
    output.push(leaves - 2);
    output.push([-(leaves - 4), -(leaves - 1)]);

    return makeFlex("flip flex", input, output, FlexRotation.None) as Flex;
  }

  // you first open it up to make a mobius strip before completing a flip flex
  function createMobiusFlip(patCount: number): Flex {
    // (2,-1) ... (i) ... ((n-3,^n-2)(n-5,^n-4)) (^n-1) (^n)
    // (2(^n-1(-1,n))) ... (i) ... (^n-3,n-4) (^n-2)
    const input: LeafTree = [];
    const output: LeafTree = [];
    const leaves = patCount + 4;

    input.push([2, -1]);
    for (let i = 3; i <= leaves - 6; i++) {
      input.push(i);
    }
    input.push([[leaves - 3, 2 - leaves], [leaves - 5, 4 - leaves]]);
    input.push(1 - leaves);
    input.push(-leaves);

    // post
    output.push([2, [1 - leaves, [-1, leaves]]]);
    for (let i = 3; i <= leaves - 5; i++) {
      output.push(i);
    }
    output.push([3 - leaves, leaves - 4]);
    output.push(2 - leaves);

    return makeFlex("mobius flip", input, output, FlexRotation.None) as Flex;
  }

  function createSilverTetra(patCount: number): Flex {
    // (1(2,3)) (4) ... (i) ... (n-3(n-2,n-1)) (n)
    // (2) ((^1,4)^3) ... (i) ... (n-2) ((^n-3,n)^n-1)
    const input: LeafTree = [];
    const output: LeafTree = [];
    const leaves = patCount + 4;

    input.push([1, [2, 3]]);
    for (let i = 4; i <= patCount; i++) {
      input.push(i);
    }
    input.push([leaves - 3, [leaves - 2, leaves - 1]]);
    input.push(leaves);

    output.push(2);
    output.push([[-1, 4], -3]);
    for (let i = 5; i <= patCount; i++) {
      output.push(i);
    }
    output.push(leaves - 2);
    output.push([[-(leaves - 3), leaves], -(leaves - 1)]);

    return makeFlex("silver tetra flex", input, output, FlexRotation.None) as Flex;
  }

  function createTwist(patCount: number): Flex {
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
    return makeFlex("twist flex", input, output, FlexRotation.CBA) as Flex;
  }

  function createLtf(patCount: number): Flex {
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

    return makeFlex("slot tuck top front", input, output, FlexRotation.ACB) as Flex;
  }

  function createSlotPocket(patCount: number): Flex {
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

    return makeFlex("slot pocket", input, output, FlexRotation.ACB) as Flex;
  }


  function createSlotTriplePocket(): Flex {
    const input: LeafTree = [[[[12, -11], -13], 10], [[[2, -1], -3], -14], -4, [[[-7, 6], 8], -5], 9];
    const output: LeafTree = [-2, [6, [-3, [-5, 4]]], 7, [-11, [8, [10, -9]]], [-1, [-12, [-14, 13]]]];
    return makeFlex("slot triple pocket", input, output, FlexRotation.None) as Flex;
  }

  // where: which opposite hinge is open starting from 0
  function createTuck(patCount: number, where: number): Flex {
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
    return makeFlex(name, input, output, FlexRotation.None) as Flex;
  }

  function createForcedTuck(patCount: number): Flex {
    // ((1,2)3) (4) ... (n-1) (n)
    // (2) (4) ... (n-1) (^1(n,^3))
    const input: LeafTree = [];
    const output: LeafTree = [];
    const leaves = patCount + 2;

    input.push([[1, 2], 3]);
    for (let i = 4; i <= leaves; i++) {
      input.push(i);
    }

    output.push(2);
    for (let i = 4; i < leaves; i++) {
      output.push(i);
    }
    output.push([-1, [leaves, -3]]);

    return makeFlex("forced tuck", input, output, FlexRotation.None) as Flex;
  }

}
