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

    flexes[">"] = makeFlex("shift right", [1, 2, 3, 4, 5, 6], [2, 3, 4, 5, 6, 1]) as Flex;
    flexes["<"] = makeFlex("shift left", [1, 2, 3, 4, 5, 6], [6, 1, 2, 3, 4, 5]) as Flex;
    flexes["^"] = makeFlex("turn over", [1, 2, 3, 4, 5, 6], [-6, -5, -4, -3, -2, -1]) as Flex;

    flexes["P"] = makeFlex("pinch flex",
      [[1, 2], 3, [4, 5], 6, [7, 8], 9],
      [-1, [5, -3], -4, [8, -6], -7, [2, -9]]) as Flex;
    flexes["T"] = makeFlex("tuck flex",
      [[[1, 2], 3], 4, 5, [6, 7], 8, 9],
      [2, 4, 5, [6, 7], 8, [-1, [9, -3]]]) as Flex;
    flexes["Tf"] = makeFlex("forced tuck",
      [[[1, 2], 3], 4, 5, 6, 7, 8],
      [2, 4, 5, 6, 7, [-1, [8, -3]]]) as Flex;
    flexes["Tt"] = makeFlex("tuck top",
      [[[2, -3], -1], [5, -4], 6, [-8, 7], -9, -10],
      [[-4, 3], -5, [7, -6], 8, [[-10, 1], 9], 2]) as Flex;
    flexes["S"] = makeFlex("pyramid shuffle",
      [[1, 2], 3, 4, 5, [[[6, 7], 8], 9], 10],
      [[1, [8, [2, -10]]], 3, 4, 5, [7, 9], -6]) as Flex;
    flexes["V"] = makeFlex("v flex",
      [1, [2, 3], [4, 5], 6, 7, [8, 9]],
      [[3, -1], -2, -5, [-6, 4], [9, -7], -8]) as Flex;
    flexes["F"] = makeFlex("flip flex",
      [[1, 2], 3, 4, 5, [[6, 7], [8, 9]], 10],
      [7, [[-1, 3], [10, -2]], 4, 5, 8, [-6, -9]]) as Flex;
    flexes["St"] = makeFlex("silver tetra flex",
      [[1, [2, 3]], 4, 5, 6, [7, [8, 9]], 10],
      [2, [[-1, 4], -3], 5, 6, 8, [[-7, 10], -9]]) as Flex;
    flexes["Lt"] = makeFlex("slot tuck flex",
      [[[[1, 2], 3], 4], 5, 6, 7, [8, 9], 10],
      [10, [2, 4], -1, 3, 5, [8, [6, [9, -7]]]]) as Flex;
    flexes["Ltb"] = makeFlex("slot tuck bottom",
      [[[1, [2, 3]], 4], 5, 6, 7, [8, 9], 10],
      [-4, 1, -3, [-5, 2], [[7, -9], -6], [-10, 8]]) as Flex;
    flexes["Ltb'"] = makeFlex("inverse slot tuck bottom",
      [1, 2, 3, [4, 5], [[6, 7], 8], [9, 10]],
      [[[2, [5, -3]], -1], -4, -8, .6, [10, -7], -9]) as Flex;
    flexes["Bltt"] = makeFlex("back slot tuck top",
      [[[1, 2], 10], [4, 3], 5, 6, [8, 7], 9],
      [[-2, -1], -3, [-5, 4], [6, -7], -8, [10, -9]]) as Flex;
    flexes["Tk"] = makeFlex("ticket flex",
      [1, 2, 3, [4, 5], [[[6, 7], 8], 9], [10, 11]],
      [6, [-9, -7], [-5, -4], -3, -2, [[11, -8], [-1, 10]]]) as Flex;
    flexes["Lk"] = makeFlex("slot pocket",
      [[[[1, 2], 3], 4], 5, 6, 7, [[[8, 9], 10], 11], 12],
      [-8, [2, [10, [4, -12]]], -1, 3, 5, [9, [6, 11, -7]]]) as Flex;

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
    flexes[">"] = makeFlex("shift right", pattern, rightOut) as Flex;
    flexes["<"] = makeFlex("shift left", pattern, leftOut) as Flex;
    flexes["^"] = makeFlex("turn over", pattern, overOut) as Flex;
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
      output.push([(a + 4) % leaves, b]);
    }
    return makeFlex("pinch flex", pattern, output) as Flex;
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

    return makeFlex("pyramid shuffle", pattern, output) as Flex;
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

    return makeFlex("flip flex", pattern, output) as Flex;
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

    return makeFlex("silver tetra flex", pattern, output) as Flex;
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

    return makeFlex("slot tuck flex", pattern, output) as Flex;
  }

}
