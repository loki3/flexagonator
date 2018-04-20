namespace Flexagonator {

  export interface Flexes {
    [index: string]: Flex;
  }

  export function makeAllFlexes(patCount: number): Flexes {
    var flexes: Flexes = {};
    if (patCount === 6) {
      flexes[">"] = makeFlex("shift right", [1, 2, 3, 4, 5, 6], [2, 3, 4, 5, 6, 1]) as Flex;
      flexes["<"] = makeFlex("shift left", [1, 2, 3, 4, 5, 6], [6, 1, 2, 3, 4, 5]) as Flex;
      flexes["^"] = makeFlex("turn over", [1, 2, 3, 4, 5, 6], [2, 3, 4, 5, 6, 1]) as Flex;

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
    }
    return flexes;
  }

}
