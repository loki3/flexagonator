namespace Flexagonator {

  // info on how to create a new flexagon and run a script modifying it
  export interface Creator {
    readonly pats: LeafTree[];
    readonly script: ScriptItem[];
  }

  export interface ScriptItem {
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
  export function Create(creator: Creator): FlexagonManager | TreeError | FlexError {
    const result = makeFlexagon(creator.pats);
    if (isTreeError(result)) {
      return result;
    }
    const fm: FlexagonManager = makeFlexagonManager(result);
    return RunScript(fm, creator.script);
  }

  // apply a script to an existing flexagon
  export function RunScript(fm: FlexagonManager, script: ScriptItem[]): FlexagonManager | FlexError {
    for (var item of script) {
      const result = RunScriptItem(fm, item);
      if (isFlexError(result)) {
        return result;
      }
    }
    return fm;
  }

  function RunScriptItem(fm: FlexagonManager, item: ScriptItem): FlexagonManager | FlexError {
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
