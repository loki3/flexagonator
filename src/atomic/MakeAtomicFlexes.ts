namespace Flexagonator {

  export interface AtomicFlexes {
    [index: string]: AtomicFlex;
  }

  /**
   * create the basic atomic flexes that can be used to build all other flexes
   * @param plusSubFlexes default: just <^UrUl; true: also include flexes built up from the simplest flexes, e.g. >, Xr, Xl, K
   */
  export function makeAtomicFlexes(plusSubFlexes?: boolean): AtomicFlexes {
    const flexes: AtomicFlexes = {};

    addBasicFlexes(flexes);
    if (plusSubFlexes) {
      addSubflexes(flexes);
    }

    // add all the inverses
    for (const flex of Object.keys(flexes)) {
      flexes[flex + "'"] = flexes[flex].createInverse();
    }

    return flexes;
  }

  // all flexes are made up of these basic flexes
  function addBasicFlexes(flexes: AtomicFlexes): void {
    flexes[">"] = makeAtomicFlex("shift right", "a / 1 b", "a 1 / b") as AtomicFlex;
    flexes["^"] = makeAtomicFlex("turn over", "a / b", "-b / -a") as AtomicFlex;
    flexes["~"] = makeAtomicFlex("change direction", "a / b", "-a / -b") as AtomicFlex;
    flexes["Ur"] = makeAtomicFlex("unfold right", "a / [-2,1] > b", "a / 1 < 2 > -b") as AtomicFlex;
  }

  // create some larger pieces that can more easily be combined into "full" flexes
  function addSubflexes(flexes: AtomicFlexes): void {
    // < = >'
    flexes["<"] = makeAtomicFlex("shift left", "a 1 / b", "a / 1 b") as AtomicFlex;
    // Ul = ~Ur~
    flexes["Ul"] = makeAtomicFlex("unfold left", "a / [1,-2] < b", "a / 1 > 2 < -b") as AtomicFlex;

    flexes["Xr"] = makeAtomicFlex("exchange right", "a 1 > / [-3,2] > b", "-a [2,-1] > / 3 > -b") as AtomicFlex;
    flexes["Xl"] = makeAtomicFlex("exchange left", "a 4 < / [5,-6] < b", "-a [-4,5] < / 6 < -b") as AtomicFlex;
    flexes["K"] = makeAtomicFlex("pocket", "a [-2,1] > -3 > / [5,-4] > b", "a 1 < 2 > / [-4,3] > -5 > -b") as AtomicFlex;

    flexes["Hf"] = makeAtomicFlex("half: fold forward", "a [-2,1] > -3 > / [5,-4] > 6 > b", "a 1 < 2 > / [-4,3] > [-5,6] < b") as AtomicFlex;
    flexes["Hb"] = makeAtomicFlex("half: fold back", "a 1 > [-3,2] > / -4 > [6,-5] > b", "a [1,-2] < [4,-3] > / 5 > 6 < b") as AtomicFlex;
    flexes["Hr"] = makeAtomicFlex("half: fold right", "a [-2,1] > -3 > / -4 > [6,-5] > b", "a 1 < 2 > / [[-4,5],3] > 6 < b") as AtomicFlex;
    flexes["Hl"] = makeAtomicFlex("half: fold left", "a [-2,1] > -3 > / -4 > [6,-5] > b", "a 1 < [4,[2,-3]] > / 5 > 6 < b") as AtomicFlex;
    flexes["Hsr"] = makeAtomicFlex("half: partial pyramid right",
      "a 1 > [[-3,4],2] > / 5 > [-7,6] > b", "a [1,-2] < -3 > / [[5,-6],-4] > -7 < b") as AtomicFlex;
    flexes["Hsl"] = makeAtomicFlex("half: partial pyramid left",
      "a [-2, 1] > -3 > / [-6,[-4,5]] > -7 > b", "a 1 < [4,[2,-3]] > / 5 > [6,-7] < b") as AtomicFlex;
  }

}
