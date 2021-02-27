namespace Flexagonator {

  // possibly flip the flexagon and rotate 'rightSteps',
  // then check which flexes can be performed at the current hinge
  export function checkForFlexesAtHinge(flexagon: Flexagon, allFlexes: Flexes, flexesToSearch: Flexes,
    flip: boolean, rightSteps: number): string[] {

    let modified = flexagon;
    if (flip) {
      modified = allFlexes["^"].apply(modified) as Flexagon;
    }
    for (let i = 0; i < rightSteps; i++) {
      modified = allFlexes[">"].apply(modified) as Flexagon;
    }
    return checkForFlexes(modified, flexesToSearch);
  }

  // get the list of all flexes that can be performed at the current hinge
  export function checkForFlexes(flexagon: Flexagon, flexes: Flexes): string[] {
    let results: string[] = [];

    for (let key of Object.keys(flexes)) {
      const flex = flexes[key];
      if (flexagon.hasPattern(flex.input)) {
        results.push(key);
      }
    }

    return results;
  }

}
