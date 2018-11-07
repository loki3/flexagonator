namespace Flexagonator {

  // add new flexes to old, consolidating redundant rotates
  // and return the new list (which could be shorter)
  export function addAndConsolidate(
    oldFlexes: ReadonlyArray<FlexName>,
    newFlexes: ReadonlyArray<FlexName>,
    numPats: number
  ): FlexName[] {

    const oldLen = oldFlexes.length;
    const newLen = newFlexes.length;
    if (oldLen === 0 || newLen === 0) {
      return oldFlexes.concat(newFlexes);
    }

    const allflexes = oldFlexes.slice();
    const oldRotates: FlexName[] = [];
    // move trailing rotates from oldFlexes to rotates
    for (let i = oldLen - 1; i >= 0; i--) {
      if (!isRotate(oldFlexes[i])) {
        break;
      }
      oldRotates.push(allflexes.pop() as FlexName);
    }
    const rotates = oldRotates.reverse();
    // move leading rotates from newFlexes to rotates
    let moved = newLen;
    for (let i = 0; i < newLen; i++) {
      if (!isRotate(newFlexes[i])) {
        moved = i;
        break;
      }
      rotates.push(newFlexes[i]);
    }

    // simplify & put it all together
    const simpler = simplify(rotates, numPats);
    const result = allflexes.concat(simpler).concat(newFlexes.slice(moved));

    return result;
  }

  function isRotate(flexName: FlexName): boolean {
    return flexName.fullName === '>' || flexName.fullName === '<' || flexName.fullName === '^';
  }

  function simplify(flexNames: FlexName[], numPats: number): FlexName[] {
    // figure out what all those rotates do
    let flipped = false;
    const where = flexNames.reduce((prev, current) => {
      if (current.flexName === '>') {
        return flipped ? prev - 1 : prev + 1;
      } else if (current.flexName === '<') {
        return flipped ? prev + 1 : prev - 1;
      } else {
        flipped = !flipped;
        return prev;
      }
    }, 0);
    if (where === 0) {
      return flipped ? [makeFlexName('^')] : [];
    }

    // come up with the shortest description
    let left = (where < 0);
    let steps = (Math.abs(where) % numPats);
    if (steps > Math.floor((numPats + 1) / 2)) {
      steps = steps - numPats;
      if (steps < 0) {
        left = !left;
        steps = -steps;
      }
    }

    // describe them in a simple form
    const result: FlexName[] = [];
    const name = makeFlexName(left ? '<' : '>');
    for (let i = 0; i < steps; i++) {
      result.push(name);
    }
    if (flipped) {
      result.push(makeFlexName('^'));
    }
    return result;
  }

}
