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
      const thisState = Number.parseInt(i);
      for (var state of transitions[i]) {
        if (state > thisState) {
          str += "  " + i + " -- " + state.toString() + '\n';
        }
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
  export function DotWithFlexes(allRelFlexes: RelativeFlexes[], props: FlexDotProps | undefined): string {
    if (!props) {
      props = defaultDotProps;
    }

    var str = "graph {\n";

    for (var i in allRelFlexes) {
      // use all flexes from this state
      const thisState = Number.parseInt(i);

      for (var relFlex of allRelFlexes[i]) {
        const flexname = makeFlexName(relFlex.flex);
        // only output flex if we're flexing to a state later in the list (to avoid double counting)
        // -or- if this is an inverse taking us to a state that we can't flex back to w/ the same flex
        if (relFlex.toState > thisState || hasOneWayInverse(flexname, thisState, allRelFlexes[relFlex.toState])) {
          str += "  " + i + " -- " + relFlex.toState.toString();
          if (props[relFlex.flex]) {
            str += " [" + props[relFlex.flex] + "]";
          }
          str += '\n';
        }
      }
    }

    str += "}";
    return str;
  }

  // check if 'flexname' is an inverse flex that sends us to a state
  // that has a normal flex back to 'state'
  function hasOneWayInverse(flexname: FlexName, state: number, other: RelativeFlexes): boolean {
    if (!flexname.isInverse) {
      return false;
    }
    for (var relFlex of other) {
      if (relFlex.flex === flexname.baseName && relFlex.toState === state) {
        return false;
      }
    }
    return true;
  }

}
