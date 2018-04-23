namespace Flexagonator {

  export interface Flexes {
    [index: string]: Flex;
  }

  export function makeAllFlexes(patCount: number): Flexes {
    var flexes: Flexes = {};
    if (patCount === 6) {
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

}