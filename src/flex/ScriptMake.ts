namespace Flexagonator {

  export function makeScript(fm: FlexagonManager): ScriptItem[] {
    const script: ScriptItem[] = [];
    script.push(makePats(fm));
    if (fm.getFlexHistory().length > 0) {
      script.push(makeFlexHistory(fm));
    }
    if (fm.leafProps.getRawProps().length !== 0) {
      script.push({ leafProps: fm.leafProps.getRawProps() });
    }
    script.push(makeFlexesToSearch(fm));
    script.push({ angles: fm.getAngleInfo().getAngles(fm.flexagon) });
    if (fm.getDirections()) {
      script.push({ directions: fm.getDirections() });
    }
    return script;
  }

  function makePats(fm: FlexagonManager): ScriptItem {
    const flexagon = fm.getBaseFlexagon();
    return { pats: flexagon.getAsLeafTrees() };
  }

  function makeFlexHistory(fm: FlexagonManager): ScriptItem {
    const flexes = fm.getFlexHistory().join(' ');
    return { flexes: flexes };
  }

  function makeFlexesToSearch(fm: FlexagonManager): ScriptItem {
    let searchFlexes = "";
    let firstFlex = true;
    for (let name in fm.flexesToSearch) {
      if (firstFlex) {
        firstFlex = false;
      } else {
        searchFlexes += ' ';
      }
      searchFlexes += name;
    }
    return { searchFlexes: searchFlexes };
  }

}
