namespace Flexagonator {

  export type StateId = number;
  // every top level element is an array of other states accessbile from it
  export type StateToState = Array<Array<StateId>>;

  // take a description of all the flexes that can be performed from each state
  // and create a simple description of which states can be reach from each state.
  // if 'oneway', only list transitions from smaller states to larger
  export function getStateToState(allRelFlexes: RelativeFlexes[], oneway: boolean): StateToState {
    var result: StateToState = [];

    for (var i in allRelFlexes) {
      // find all the states that can be reached from this state
      const thisState = Number.parseInt(i);
      var states: number[] = [];
      for (var relFlex of allRelFlexes[i]) {
        if (oneway && thisState > relFlex.toState) {
          continue;
        }
        if (!states.find(x => (x === relFlex.toState))) {
          states.push(relFlex.toState);
        }
      }
      result[i] = states;
    }

    return result;
  }


  export interface FlexToState {
    readonly flex: string,
    readonly state: StateId,
  }
  // every top level element is an array of flex->state mappings
  export type FlexesToStates = Array<Array<FlexToState>>;

  // take a description of all the flexes that can be performed from each state
  // and create a list of which flexes can be used to get to other states,
  // while ignoring rotations
  export function getSimpleFlexGraph(allRelFlexes: RelativeFlexes[], oneway: boolean): FlexesToStates {
    var result: FlexesToStates = [];

    for (var i in allRelFlexes) {
      // check all flexes from this state
      const thisState = Number.parseInt(i);
      var flexes: FlexToState[] = [];

      for (var relFlex of allRelFlexes[i]) {
        if (oneway) {
          const flexname = makeFlexName(relFlex.flex);
          // only output flex if we're flexing to a state later in the list (to avoid double counting)
          // -or- if this is an inverse taking us to a state that we can't flex back to w/ the same flex
          if (relFlex.toState > thisState || hasOneWayInverse(flexname, thisState, allRelFlexes[relFlex.toState])) {
            flexes.push({ flex: relFlex.flex, state: relFlex.toState });
          }
        } else {
          flexes.push({ flex: relFlex.flex, state: relFlex.toState });
        }
      }

      result.push(flexes);
    }

    return result;
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
