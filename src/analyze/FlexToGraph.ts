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

}
