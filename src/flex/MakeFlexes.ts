namespace Flexagonator {

  export interface Flexes {
    [index: string]: Flex;
  }

  export function makeAllFlexes(patCount: number): Flexes {
    var flexes: Flexes = {};
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
        flexes["F"] = createFlip(patCount);
      if (patCount >= 6)
        flexes["St"] = createSilverTetra(patCount);
      if (patCount >= 5)
        flexes["Lt"] = createSlotTuck(patCount);

      flexes["Tf"] = createForcedTuck(patCount);
      for (var i = 0; i < patCount - 5; i++) {
        const s = "T" + (i + 1).toString();
        flexes[s] = createTuck(patCount, i);
      }

      if (patCount === 9) {
        flexes["P333"] = createDoublePinch(patCount, [3, 6]);
      }
    }

    // add all the inverses
    for (var flex of Object.keys(flexes)) {
      flexes[flex + "'"] = flexes[flex].createInverse();
    }

    return flexes;
  }

  // return just the flexes that can't be done using other flexes
  export function getPrimeFlexes(all: Flexes): Flexes {
    var flexes: Flexes = {};
    const primes = ["P", "S", "T", "T'", "Tf", "V", "F", "Lt", "Ltb", "Ltb'"];

    for (var prime of primes) {
      if (all[prime] !== undefined) {
        flexes[prime] = all[prime];
      }
    }

    return flexes;
  }

  function makeHexaFlexes(): Flexes {
    var flexes: Flexes = {};

    flexes[">"] = makeFlex("shift right", [1, 2, 3, 4, 5, 6], [2, 3, 4, 5, 6, 1], FlexRotation.Mirror) as Flex;
    flexes["<"] = makeFlex("shift left", [1, 2, 3, 4, 5, 6], [6, 1, 2, 3, 4, 5], FlexRotation.Mirror) as Flex;
    flexes["^"] = makeFlex("turn over", [1, 2, 3, 4, 5, 6], [-6, -5, -4, -3, -2, -1], FlexRotation.None) as Flex;

    flexes["P"] = makeFlex("pinch flex",
      [[1, 2], 3, [4, 5], 6, [7, 8], 9],
      [-1, [5, -3], -4, [8, -6], -7, [2, -9]], FlexRotation.CounterMirror) as Flex;
    flexes["T"] = makeFlex("tuck flex",
      [[[1, 2], 3], 4, 5, [6, 7], 8, 9],
      [2, 4, 5, [6, 7], 8, [-1, [9, -3]]], FlexRotation.None) as Flex;
    flexes["Tf"] = makeFlex("forced tuck",
      [[[1, 2], 3], 4, 5, 6, 7, 8],
      [2, 4, 5, 6, 7, [-1, [8, -3]]], FlexRotation.None) as Flex;
    flexes["Tt"] = makeFlex("tuck top",
      [[[2, -3], -1], [5, -4], 6, [-8, 7], -9, -10],
      [[-4, 3], -5, [7, -6], 8, [[-10, 1], 9], 2], FlexRotation.None) as Flex;
    flexes["S"] = makeFlex("pyramid shuffle",
      [[1, 2], 3, 4, 5, [[[6, 7], 8], 9], 10],
      [[1, [8, [2, -10]]], 3, 4, 5, [7, 9], -6], FlexRotation.None) as Flex;
    flexes["V"] = makeFlex("v flex",
      [1, [2, 3], [4, 5], 6, 7, [8, 9]],
      [[3, -1], -2, -5, [-6, 4], [9, -7], -8], FlexRotation.ClockMirror) as Flex;
    flexes["F"] = makeFlex("flip flex",
      [[1, 2], 3, 4, 5, [[6, 7], [8, 9]], 10],
      [7, [[-1, 3], [10, -2]], 4, 5, 8, [-6, -9]], FlexRotation.None) as Flex;
    flexes["St"] = makeFlex("silver tetra flex",
      [[1, [2, 3]], 4, 5, 6, [7, [8, 9]], 10],
      [2, [[-1, 4], -3], 5, 6, 8, [[-7, 10], -9]], FlexRotation.None) as Flex;
    flexes["Lt"] = makeFlex("slot tuck flex",
      [[[[1, 2], 3], 4], 5, 6, 7, [8, 9], 10],
      [10, [2, 4], -1, 3, 5, [8, [6, [9, -7]]]], FlexRotation.None) as Flex;
    flexes["Ltb"] = makeFlex("slot tuck bottom",
      [[[1, [2, 3]], 4], 5, 6, 7, [8, 9], 10],
      [-4, 1, -3, [-5, 2], [[7, -9], -6], [-10, 8]], FlexRotation.ClockMirror) as Flex;
    flexes["Bltt"] = makeFlex("back slot tuck top",
      [[[1, 2], 10], [4, 3], 5, 6, [8, 7], 9],
      [[-2, -1], -3, [-5, 4], [7, -6], -8, [10, -9]], FlexRotation.CounterMirror) as Flex;
    flexes["Bltb"] = makeFlex("back slot tuck bottom",
      [[[2, -3], -1], [5, -4], 6, 7, [[-9, 10], 8], 11],
      [2, [-4, 3], -5, [[7, -8], -6], -9, [[11, 1], -10]], FlexRotation.CounterMirror) as Flex;
    flexes["Tk"] = makeFlex("ticket flex",
      [1, 2, 3, [4, 5], [[[6, 7], 8], 9], [10, 11]],
      [6, [-9, -7], [-5, -4], -3, -2, [[11, -8], [-1, 10]]], FlexRotation.None) as Flex;
    flexes["Lk"] = makeFlex("slot pocket",
      [[[[1, 2], 3], 4], 5, 6, 7, [[[8, 9], 10], 11], 12],
      [-8, [2, [10, [4, -12]]], -1, 3, 5, [9, [6, [11, -7]]]], FlexRotation.None) as Flex;

    return flexes;
  }

  function addRotates(patCount: number, flexes: Flexes) {
    var pattern = [], rightOut = [], leftOut = [], overOut = [];
    for (var i = 0; i < patCount; i++) {
      pattern[i] = i + 1;
      rightOut[i] = i + 2 > patCount ? 1 : i + 2;
      leftOut[i] = i < 1 ? patCount : i;
      overOut[i] = i - patCount;
    }
    flexes[">"] = makeFlex("shift right", pattern, rightOut, FlexRotation.Mirror) as Flex;
    flexes["<"] = makeFlex("shift left", pattern, leftOut, FlexRotation.Mirror) as Flex;
    flexes["^"] = makeFlex("turn over", pattern, overOut, FlexRotation.None) as Flex;
  }

  function createPinch(patCount: number): Flex {
    // (1,2) (3) ... (i,i+1) (i+2) ... (n-2,n-1) (n)
    // (^1) (5,^3) ... (^i) (i+4,^i+2) ... (^n-2) (2,^n)
    var pattern: LeafTree = [];
    var output: LeafTree = [];
    const leaves = patCount * 3 / 2;
    for (var i = 0; i < patCount; i += 2) {
      var a = (i / 2) * 3 + 1;

      // e.g. (1,2) (3)
      pattern.push([a, a + 1]);
      pattern.push(a + 2);

      // e.g. (^1) (5,^3)
      output.push(-a);
      var b = (a + 2) % leaves;
      b = (b == 0 ? leaves : b);
      output.push([(a + 4) % leaves, -b]);
    }
    return makeFlex("pinch flex", pattern, output, FlexRotation.CounterMirror) as Flex;
  }

  function createDoublePinch(patCount: number, which: number[]): Flex {
    // basic unit: [1, [[2, 3], 4]]  ->  [[2, [1, -4]], 3]
    // 'which' lists the vertices where the basic unit will be applied after 0, e.g. [3,6] for P333
    // e.g. [[1,3], 2], 4, 5, [[6,8], 7], 9, 10, [[11,13], 12], 14, 15
    //      3, 4, [-6, [5,-7]], 8, 9, [-11, [10,-12]], 13, 14, [-1, [15,-2]]
    var pattern: LeafTree = [];
    var output: LeafTree = [];

    var iWhich = -1;
    var iLeaf = 1;
    for (var iPat = 0; iPat < patCount; iPat++) {
      if ((iWhich == -1) || (iWhich < which.length && which[iWhich] === iPat)) {
        pattern.push([[iLeaf, iLeaf + 2], iLeaf + 1]);
        iWhich++;
        iLeaf += 3;
      } else {
        pattern.push(iLeaf++);
      }
    }

    iWhich = 0;
    iLeaf = 3;
    for (var iPat = 0; iPat < patCount; iPat++) {
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
    var nums = which[0].toString();
    for (var i = 1; i < which.length; i++) {
      nums += (which[i] - which[i - 1]).toString();
    }
    nums += (patCount - which[which.length - 1]).toString();
    return makeFlex("pinch " + nums, pattern, output, FlexRotation.None) as Flex;
  }

  function createPyramidShuffle(patCount: number): Flex {
    // (1,2) (3) ... (i) ... (((n-4,n-3)n-2)n-1) (n)
    // (1(n-2(2,^n))) (3) ... (i) ... (n-3,n-1) (^n-4)
    var pattern: LeafTree = [];
    var output: LeafTree = [];
    const leaves = patCount + 4;

    pattern.push([1, 2]);
    for (var i = 3; i < patCount; i++) {
      pattern.push(i);
    }
    pattern.push([[[leaves - 4, leaves - 3], leaves - 2], leaves - 1]);
    pattern.push(leaves);

    // post
    output.push([1, [leaves - 2, [2, -leaves]]]);
    for (var i = 3; i < patCount; i++) {
      output.push(i);
    }
    output.push([leaves - 3, leaves - 1]);
    output.push(-(leaves - 4));

    return makeFlex("pyramid shuffle", pattern, output, FlexRotation.None) as Flex;
  }

  function createFlip(patCount: number): Flex {
    // (1,2) (3) ... (i) ... ((n-4,n-3)(n-2,n-1)) (n)
    // (n-3) ((^1,3)(n,^2)) ... (i) ... (n-2) (^n-4,^n-1)
    var pattern: LeafTree = [];
    var output: LeafTree = [];
    const leaves = patCount + 4;

    pattern.push([1, 2]);
    for (var i = 3; i < patCount; i++) {
      pattern.push(i);
    }
    pattern.push([[leaves - 4, leaves - 3], [leaves - 2, leaves - 1]]);
    pattern.push(leaves);

    output.push(leaves - 3);
    output.push([[-1, 3], [leaves, -2]]);
    for (var i = 4; i < patCount; i++) {
      output.push(i);
    }
    output.push(leaves - 2);
    output.push([-(leaves - 4), -(leaves - 1)]);

    return makeFlex("flip flex", pattern, output, FlexRotation.None) as Flex;
  }

  function createSilverTetra(patCount: number): Flex {
    // (1(2,3)) (4) ... (i) ... (n-3(n-2,n-1)) (n)
    // (2) ((^1,4)^3) ... (i) ... (n-2) ((^n-3,n)^n-1)
    var pattern: LeafTree = [];
    var output: LeafTree = [];
    const leaves = patCount + 4;

    pattern.push([1, [2, 3]]);
    for (var i = 4; i <= patCount; i++) {
      pattern.push(i);
    }
    pattern.push([leaves - 3, [leaves - 2, leaves - 1]]);
    pattern.push(leaves);

    output.push(2);
    output.push([[-1, 4], -3]);
    for (var i = 5; i <= patCount; i++) {
      output.push(i);
    }
    output.push(leaves - 2);
    output.push([[-(leaves - 3), leaves], -(leaves - 1)]);

    return makeFlex("silver tetra flex", pattern, output, FlexRotation.None) as Flex;
  }

  function createSlotTuck(patCount: number): Flex {
    // (((1,2)3)4) ... (i) ... (n-4) (n-3) (n-2,n-1) (n)
    // (n) (2,4) (^1) (3) ... (i) ... (n-2(n-4(n-1,^n-3)))
    var pattern: LeafTree = [];
    var output: LeafTree = [];
    const leaves = patCount + 4;

    pattern.push([[[1, 2], 3], 4]);
    for (var i = 5; i < patCount + 2; i++) {
      pattern.push(i);
    }
    pattern.push([leaves - 2, leaves - 1]);
    pattern.push(leaves);

    // post
    output.push(leaves);
    output.push([2, 4]);
    output.push(-1);
    output.push(3);
    for (var i = 5; i < patCount; i++) {
      output.push(i);
    }
    output.push([leaves - 2, [leaves - 4, [leaves - 1, -(leaves - 3)]]]);

    return makeFlex("slot tuck flex", pattern, output, FlexRotation.None) as Flex;
  }

  // where: which opposite hinge is open starting from 0
  function createTuck(patCount: number, where: number): Flex {
    // ((1,2)3) (4) ... (i,i+1) ... (n-1) (n)
    // (2) (4) ... (i,i+1) ... (n-1) (^1(n,^3))
    var pattern: LeafTree = [];
    var output: LeafTree = [];
    const leaves = patCount + 3;

    pattern.push([[1, 2], 3]);
    for (var i = 4; i <= leaves; i++) {
      if (i == where + 6) {
        pattern.push([i, i + 1]);
      }
      else if (i != where + 7) {
        pattern.push(i);
      }
    }

    output.push(2);
    for (var i = 4; i < leaves; i++) {
      if (i == where + 6) {
        output.push([i, i + 1]);
      }
      else if (i != where + 7) {
        output.push(i);
      }
    }
    output.push([-1, [leaves, -3]]);

    const name = "tuck" + (where == 0 ? "" : (where + 1).toString());
    return makeFlex(name, pattern, output, FlexRotation.None) as Flex;
  }

  function createForcedTuck(patCount: number): Flex {
    // ((1,2)3) (4) ... (n-1) (n)
    // (2) (4) ... (n-1) (^1(n,^3))
    var pattern: LeafTree = [];
    var output: LeafTree = [];
    const leaves = patCount + 2;

    pattern.push([[1, 2], 3]);
    for (var i = 4; i <= leaves; i++) {
      pattern.push(i);
    }

    output.push(2);
    for (var i = 4; i < leaves; i++) {
      output.push(i);
    }
    output.push([-1, [leaves, -3]]);

    return makeFlex("forced tuck", pattern, output, FlexRotation.None) as Flex;
  }

}
