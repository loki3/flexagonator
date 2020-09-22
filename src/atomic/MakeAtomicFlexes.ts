namespace Flexagonator {

  export interface AtomicFlexes {
    [index: string]: AtomicFlex;
  }

  /** create the basic atomic flexes that can be used to build all other flexes */
  export function makeAtomicFlexes(): AtomicFlexes {
    const flexes: AtomicFlexes = {};

    flexes[">"] = makeAtomicFlex("shift right", "a / 1 b", "a 1 / b") as AtomicFlex;
    flexes["<"] = makeAtomicFlex("shift left", "a 1 / b", "a / 1 b") as AtomicFlex;
    flexes["^"] = makeAtomicFlex("turn over", "a / b", "-b / -a") as AtomicFlex;
    flexes["Ur"] = makeAtomicFlex("unfold right", "a / [-2,1] > b", "a / 1 < 2 > -b") as AtomicFlex;
    flexes["Ul"] = makeAtomicFlex("unfold left", "a / [1,-2] < b", "a / 1 > 2 < -b") as AtomicFlex;

    // add all the inverses
    for (const flex of Object.keys(flexes)) {
      flexes[flex + "'"] = flexes[flex].createInverse();
    }

    return flexes;
  }

}
