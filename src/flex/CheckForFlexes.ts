namespace Flexagonator {

  /** possibly flip the flexagon and rotate 'rightSteps',
    then check which flexes can be performed at the current hinge */
  export function checkForFlexesAtHinge(flexagon: Flexagon, allFlexes: Flexes, flexesToSearch: Flexes,
    flip: boolean, rightSteps: number, ignoreStructure?: boolean
  ): string[] {
    let modified = flexagon;
    if (flip) {
      modified = allFlexes["^"].apply(modified) as Flexagon;
    }
    for (let i = 0; i < rightSteps; i++) {
      modified = allFlexes[">"].apply(modified) as Flexagon;
    }
    return checkForFlexes(modified, flexesToSearch, ignoreStructure);
  }

  /** get the list of all flexes that can be performed at the current hinge */
  export function checkForFlexes(flexagon: Flexagon, flexes: Flexes, ignoreStructure?: boolean): string[] {
    let results: string[] = [];

    for (let key of Object.keys(flexes)) {
      const flex = flexes[key];
      if ((ignoreStructure || flexagon.hasPattern(flex.input)) && flexagon.hasDirections(flex.inputDirs)) {
        results.push(key);
      }
    }

    return results;
  }

  /** find every flex that could be supported for at least one hinge, checking only pat directions, not pat structure */
  export function checkForPossibleFlexes(flexagon: Flexagon, allFlexes: Flexes, flexesToSearch: Flexes): string[] {
    // if pats all go /, rule out any flexes with \
    if (flexagon.hasSameDirections()) {
      const results: string[] = [];
      for (const key of Object.keys(flexesToSearch)) {
        const flex = flexesToSearch[key];
        if (!flex.inputDirs || flex.inputDirs.asRaw().indexOf(false) === -1) {
          results.push(key);
        }
      }
      return results;
    }

    // check every hinge on both sides to see if each flex works anywhere
    const supported: string[] = [];
    const patCount = flexagon.getPatCount();
    for (let i = 0; i < 2; i++) { // front & back
      for (let j = 0; j < patCount; j++) {  // every hinge
        const set = checkForFlexesAtHinge(flexagon, allFlexes, flexesToSearch, i === 1, j, true);
        set.forEach(f => { if (supported.indexOf(f) === -1) supported.push(f) })
      }
    }
    return supported;
  }

}
