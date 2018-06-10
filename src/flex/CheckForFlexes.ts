namespace Flexagonator {

  // possibly flip the flexagon and rotate 'rightSteps',
  // then check which flexes can be performed at the current vertex
  export function checkForFlexesAtVertex(flexagon: Flexagon, allFlexes: Flexes, flexesToSearch: Flexes,
    flip: boolean, rightSteps: number): string[] {

    var modified = flexagon;
    if (flip) {
      modified = allFlexes["^"].apply(modified) as Flexagon;
    }
    for (var i = 0; i < rightSteps; i++) {
      modified = allFlexes[">"].apply(modified) as Flexagon;
    }
    return checkForFlexes(modified, flexesToSearch);
  }

  // get the list of all flexes that can be performed at the current vertex
  export function checkForFlexes(flexagon: Flexagon, flexes: Flexes): string[] {
    var results: string[] = [];

    for (var key of Object.keys(flexes)) {
      const flex = flexes[key];
      if (flexagon.hasPattern(flex.pattern)) {
        results.push(key);
      }
    }

    return results;
  }

}
