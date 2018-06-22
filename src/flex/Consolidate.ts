namespace Flexagonator {

  // add new flexes to old, consolidating redundant rotates
  // and return the new list (which could be shorter)
  export function addAndConsolidate(oldFlexes: string[], newFlexes: string[]): string[] {
    const allflexes = [];
    // copy old list across
    for (let flex of oldFlexes) {
      allflexes.push(flex);
    }

    // add new flexes, consolidating redundant rotates
    let start = true;
    for (let flex of newFlexes) {
      if (start) {
        const last = allflexes.length > 0 ? allflexes[allflexes.length - 1] : "";
        const last2 = allflexes.length > 1 ? allflexes[allflexes.length - 2] : "";
        if ((flex === '<' && last === '>') || (flex === '>' && last === '<') || (flex === '^' && last === '^')) {
          // they cancel out
          allflexes.pop();
          continue;
        } else if ((flex === '>' && last === '^' && last2 === '>') || (flex === '<' && last === '^' && last2 === '<')) {
          // >^> is just ^
          allflexes.pop();
          allflexes.pop();
          allflexes.push('^');
          continue;
        }
        start = false;
      }

      allflexes.push(flex);
    }

    return allflexes;
  }

}
