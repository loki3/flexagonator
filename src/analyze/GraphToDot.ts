namespace Flexagonator {

  /*
    Utilities for creating DOT graph descriptions of the
    state transitions described by a list of RelativeFlexes
  */

  // create a DOT graph of just the state-to-state transitions,
  // ignoring flexes & rotations
  export function dotSimple(allRelFlexes: RelativeFlexes[]): string {
    const transitions = getStateToState(allRelFlexes, true/*oneway*/);
    let str = "graph {\n";

    for (const i in transitions) {
      for (const state of transitions[i]) {
        str += "  " + i + " -- " + state.toString() + '\n';
      }
    }

    str += "}";
    return str;
  }

  // lookup DOT properties like color based on flex name
  export interface FlexDotProps {
    readonly [index: string]: string;
  }

  const defaultDotProps: FlexDotProps = {
    P: "color=black",
    V: "color=green",
    S: "color=red",
    T: "color=blue",
    T1: "color=blue",
    T2: "color=blue",
    T3: "color=blue",
    T4: "color=blue",
    T5: "color=blue",
    T6: "color=blue",
    T7: "color=blue",
    Lt: "color=orange",
    F: "color=magenta",
  }

  // create a DOT graph describing which flexes you can use to get between states,
  // ignoring rotations
  export function dotWithFlexes(allRelFlexes: RelativeFlexes[], oneway: boolean, props?: FlexDotProps): string {
    if (!props) {
      props = defaultDotProps;
    }
    const transitions = getSimpleFlexGraph(allRelFlexes, oneway);

    let str = oneway ? "" : "di";
    str += "graph {\n";
    const connect = oneway ? " -- " : " -> ";

    for (const i in transitions) {
      for (const state of transitions[i]) {
        str += "  " + i + connect + state.state;
        str += getProps(state.flex, props);
        str += '\n';
      }
    }

    str += "}";
    return str;
  }

  // lookup props either for the given name if it exists, or the base name,
  // e.g. if S' is passed, we'll try S if S' doesn't exist
  function getProps(flex: string, props: FlexDotProps): string {
    // if there's an explicit property for this flex, use it
    if (props[flex]) {
      return " [" + props[flex] + "]";
    }

    // otherwise, use props for the base name, tacking on dashed if it's an inverse
    const flexname = makeFlexName(flex);
    if (!props[flexname.baseName]) {
      return "";
    }
    let str = " [" + props[flexname.baseName];
    if (flexname.isInverse) {
      str += ", style=dashed";
    }
    return str + "]";
  }

}
