namespace Flexagonator {

  export function MakeScript(fm: FlexagonManager): ScriptItem[] {
    var script: ScriptItem[] = [];
    script.push(makePats(fm));
    if (fm.getFlexHistory().length > 0) {
      script.push(makeFlexHistory(fm));
    }
    if (fm.leafProps.getRawProps().length !== 0) {
      script.push({ leafProps: fm.leafProps.getRawProps() });
    }
    script.push(makeFlexesToSearch(fm));
    script.push({ angles: fm.getAngles() });
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
    var searchFlexes = "";
    var firstFlex = true;
    for (var name in fm.flexesToSearch) {
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
