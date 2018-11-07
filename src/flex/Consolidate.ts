namespace Flexagonator {

  // add new flexes to old, consolidating redundant rotates
  // and return the new list (which could be shorter)
  export function addAndConsolidate(
    oldFlexes: ReadonlyArray<FlexName>,
    newFlexes: ReadonlyArray<FlexName>,
    numPats: number
  ): FlexName[] {
    // copy old list across
    const allflexes = oldFlexes.slice();

    // add new flexes, consolidating redundant rotates
    let start = true;
    for (let flexName of newFlexes) {
      if (start) {
        const last = allflexes.length > 0 ? allflexes[allflexes.length - 1].fullName : "";
        const last2 = allflexes.length > 1 ? allflexes[allflexes.length - 2].fullName : "";
        const flex = flexName.fullName;
        if ((flex === '<' && last === '>') || (flex === '>' && last === '<') || (flex === '^' && last === '^')) {
          // they cancel out
          allflexes.pop();
          continue;
        } else if ((flex === '>' && last === '^' && last2 === '>') || (flex === '<' && last === '^' && last2 === '<')) {
          // >^> is just ^
          allflexes.pop();
          allflexes.pop();
          allflexes.push(makeFlexName('^'));
          continue;
        }
        start = false;
      }

      allflexes.push(flexName);
    }

    return allflexes;
  }

}
