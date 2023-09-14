namespace Flexagonator {

  /**
   * Check if a flex can be expressed as a sequence of other flexes.
   * If so, return the shortest sequence, otherwise return false.
   */
  export function findEqualFlexes(check: Flex, flexes: Flexes): string | false {
    flexes = removeFlex(flexes, 'change directions'); // for perf, don't use ~
    flexes = removeFlex(flexes, check.name);
    const input = Flexagon.makeFromTree(check.input) as Flexagon;
    const output = Flexagon.makeFromTree(check.output) as Flexagon;

    const explore = new Explore(input, flexes, flexes[">"], flexes["^"]);
    while (explore.checkNext()) { }

    const findShortest = new FindShortest(input, output, flexes, flexes[">"], flexes["^"]);
    while (findShortest.checkLevel()) { }

    return findShortest.wasFound() ? findShortest.getFlexes() : false;
  }

  function removeFlex(flexes: Flexes, toRemove: string): Flexes {
    const allNames = Object.getOwnPropertyNames(flexes);
    const inverse = 'inverse ' + toRemove;
    const someNames = allNames.filter(name => flexes[name].name !== toRemove && flexes[name].name !== inverse);

    const result: Flexes = {};
    someNames.forEach(name => result[name] = flexes[name]);
    return result;
  }

}
