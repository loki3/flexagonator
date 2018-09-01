namespace Flexagonator {

  // create a flexagon, apply a script, and return it
  export function createFromScript(script: ScriptItem[]): FlexagonManager | TreeError | FlexError {
    const result = Flexagon.makeFromTree([1, 2, 3, 4, 5, 6]) as Flexagon;
    const fm: FlexagonManager = FlexagonManager.make(result);
    return runScript(fm, script);
  }

  // apply a script to an existing flexagon (though it may create a new flexagon)
  export function runScript(fm: FlexagonManager, script: ScriptItem[]): FlexagonManager | FlexError | TreeError {
    for (let item of script) {
      const result = runScriptItem(fm, item);
      if (isFlexError(result) || isTreeError(result)) {
        return result;
      }
      fm = result;
    }
    return fm;
  }

  export function runScriptString(fm: FlexagonManager, str: string): FlexagonManager | FlexError | TreeError {
    const script = JSON.parse(str);
    return runScript(fm, script);
  }

  export function runScriptItem(fm: FlexagonManager, item: ScriptItem): FlexagonManager | FlexError | TreeError {
    if (item.pats !== undefined) {
      const result = Flexagon.makeFromTreeCheckZeros(item.pats);
      if (isTreeError(result)) {
        return result;
      }
      fm = FlexagonManager.make(result);
    }

    if (item.flexes !== undefined) {
      const result = fm.applyFlexes(item.flexes, false);
      if (isFlexError(result)) {
        return result;
      }
    }

    if (item.reverseFlexes !== undefined) {
      const result = fm.applyInReverse(item.reverseFlexes);
      if (isFlexError(result)) {
        return result;
      }
    }

    if (item.leafProps !== undefined) {
      fm.leafProps = new PropertiesForLeaves(item.leafProps);
    }

    if (item.setFace !== undefined) {
      if (item.setFace.front !== undefined) {
        if (item.setFace.front.label !== undefined) {
          fm.setFaceLabel(item.setFace.front.label, true);
        }
        if (item.setFace.front.color !== undefined) {
          fm.setFaceColor(item.setFace.front.color, true);
        }
      }
      if (item.setFace.back !== undefined) {
        if (item.setFace.back.label !== undefined) {
          fm.setFaceLabel(item.setFace.back.label, false);
        }
        if (item.setFace.back.color !== undefined) {
          fm.setFaceColor(item.setFace.back.color, false);
        }
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
      // & add the inverse
      fm.allFlexes[f.shorthand + "'"] = newFlex.createInverse();
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

    if (item.searchFlexes !== undefined) {
      const flexNames: FlexName[] = parseFlexSequence(item.searchFlexes);
      const flexes: Flexes = {};
      for (const flexName of flexNames) {
        const f = flexName.flexName;
        const flex = fm.allFlexes[f];
        if (flex !== undefined) {
          flexes[f] = flex;
        }
      }
      fm.flexesToSearch = flexes;
    }

    if (item.angles !== undefined) {
      fm.setAngles(item.angles[0], item.angles[1]);
    }

    return fm;
  }

}
