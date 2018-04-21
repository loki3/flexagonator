namespace Flexagonator {

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
