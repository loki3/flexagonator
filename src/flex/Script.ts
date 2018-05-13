namespace Flexagonator {

  export interface ScriptItem {
    // creates a new flexagon with the given pat structure
    readonly pats: LeafTree[];
    // a series of space-delimited flexes
    readonly flexes?: string;
    // manipulate the flex history: "clear", "undo", "redo", "reset"
    readonly history?: string;
    // array of properties for every leaf
    readonly leafProps?: LeafProperties[];
    // set properties for the entire face (front and/or back)
    readonly setFace?: LeafProperties;
    // set properties for just the portion that's not already set (front and/or back)
    readonly unsetFace?: LeafProperties;
    // add a new flex to what can be applied to the current flexagon
    readonly addFlex?: FlexDef;
  }

  // create a flexagon, apply a script, and return it
  export function Create(script: ScriptItem[]): FlexagonManager | TreeError | FlexError {
    const result = makeFlexagon([1, 2, 3, 4, 5, 6]) as Flexagon;
    const fm: FlexagonManager = makeFlexagonManager(result);
    return RunScript(fm, script);
  }

  // apply a script to an existing flexagon (though it may create a new flexagon)
  export function RunScript(fm: FlexagonManager, script: ScriptItem[]): FlexagonManager | FlexError | TreeError {
    for (var item of script) {
      const result = RunScriptItem(fm, item);
      if (isFlexError(result) || isTreeError(result)) {
        return result;
      }
      fm = result;
    }
    return fm;
  }

  export function RunScriptString(fm: FlexagonManager, str: string): FlexagonManager | FlexError | TreeError {
    const script = JSON.parse(str);
    return RunScript(fm, script);
  }

  function RunScriptItem(fm: FlexagonManager, item: ScriptItem): FlexagonManager | FlexError | TreeError {
    if (item.pats !== undefined) {
      const result = makeFlexagon(item.pats);
      if (isTreeError(result)) {
        return result;
      }
      fm = makeFlexagonManager(result);
    }

    if (item.flexes !== undefined) {
      const result = fm.applyFlexes(item.flexes);
      if (isFlexError(result)) {
        return result;
      }
    }

    if (item.leafProps !== undefined) {
      fm.leafProps = new PropertiesForLeaves(item.leafProps);
    }

    if (item.setFace !== undefined) {
      if (item.setFace.front.label !== undefined) {
        fm.setFaceLabel(item.setFace.front.label, true);
      }
      if (item.setFace.back.label !== undefined) {
        fm.setFaceLabel(item.setFace.back.label, false);
      }
      if (item.setFace.front.color !== undefined) {
        fm.setFaceColor(item.setFace.front.color, true);
      }
      if (item.setFace.back.color !== undefined) {
        fm.setFaceColor(item.setFace.back.color, false);
      }
    }

    if (item.unsetFace !== undefined) {
      if (item.unsetFace.front.label !== undefined) {
        fm.setUnsetFaceLabel(item.unsetFace.front.label, true);
      }
      if (item.unsetFace.back.label !== undefined) {
        fm.setUnsetFaceLabel(item.unsetFace.back.label, false);
      }
      if (item.unsetFace.front.color !== undefined) {
        fm.setUnsetFaceColor(item.unsetFace.front.color, true);
      }
      if (item.unsetFace.back.color !== undefined) {
        fm.setUnsetFaceColor(item.unsetFace.back.color, false);
      }
    }

    if (item.addFlex !== undefined) {
      const f = item.addFlex;
      const fr = f.rotation == undefined ? FlexRotation.None : f.rotation;
      const newFlex = makeFlex(f.name, f.input, f.output, fr);
      if (isFlexError(newFlex)) {
        return newFlex;
      }
      fm.allFlexes[f.shorthand] = newFlex;
    }

    // manipulate the flex history: "clear", "undo", "redo", "reset"
    if (item.history !== undefined) {
      switch (item.history) {
        case "clear": fm.clearHistory(); break;
        case "undo": fm.undo(); break;
        case "redo": fm.redo(); break;
        case "reset": fm.undoAll(); break;
      }
    }

    return fm;
  }

}
