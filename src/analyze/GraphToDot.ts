namespace Flexagonator {

  /*
    Utilities for creating DOT graph descriptions of the
    state transitions described by a list of RelativeFlexes
  */

  // create a DOT graph of just the state-to-state transitions,
  // ignoring flexes & rotations
  export function DotSimple(allRelFlexes: RelativeFlexes[]): string {
    const transitions = getStateToState(allRelFlexes, true/*oneway*/);
    var str = "graph {\n";

    for (var i in transitions) {
      for (var state of transitions[i]) {
        str += "  " + i + " -- " + state.toString() + '\n';
      }
    }

    str += "}";
    return str;
  }

  // lookup DOT properties like color based on flex name
  export interface FlexDotProps {
    [index: string]: string;
  }

  const defaultDotProps: FlexDotProps = {
    P: "color=black",
    V: "color=green, style=dashed",
    S: "color=red, style=dashed",
    T: "color=blue",
    "T'": "color=blue, style=dashed",
    Lt: "color=orange",
  }

  // create a DOT graph describing which flexes you can use to get between states,
  // ignoring rotations
  export function DotWithFlexes(allRelFlexes: RelativeFlexes[], oneway: boolean, props: FlexDotProps | undefined): string {
    if (!props) {
      props = defaultDotProps;
    }
    const transitions = getSimpleFlexGraph(allRelFlexes, oneway);

    var str = oneway ? "" : "di";
    str += "graph {\n";
    const connect = oneway ? " -- " : " -> ";

    for (var i in transitions) {
      for (var state of transitions[i]) {
        str += "  " + i + connect + state.state;
        if (props[state.flex]) {
          str += " [" + props[state.flex] + "]";
        }
        str += '\n';
      }
    }

    str += "}";
    return str;
  }

}
