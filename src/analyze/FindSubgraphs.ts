namespace Flexagonator {

  /**
   * if you can't access the entire graph with a given flex,
   * figure out how many subgraphs there are
   */
  export function findSubgraphs(relFlexesList: RelativeFlexes[], flex: string): SubGraphStats {
    const find = new FindSubgraphs(relFlexesList, flex);
    return find.findSubgraphs();
  }

  export interface SubGraphStats {
    /** total number of disconnected subgraphs */
    uniqueSubgraphs: number;
    /** how many different subgraphs were there of a given size (number of states in the subgraph)? */
    sizesAndSubgraphCounts: SizeAndSubgraphCount[];
  }
  export interface SizeAndSubgraphCount {
    size: number;           /** how many states in the subgraph */
    subgraphCount: number;  /** how many subgraphs of that size */
  }

  class FindSubgraphs {
    // maps state index to the subgraph number the state is in
    private readonly stateToSubgraph: number[] = [];
    // list of states in each subgraph
    private readonly statesInSubgraph: number[][] = [];

    constructor(private relFlexesList: RelativeFlexes[], private flex: string) {
    }

    // examine the graph to find out how many subgraphs there are when limited to the given flex,
    // returns number of distinct subgraphs
    findSubgraphs(): SubGraphStats {
      this.relFlexesList.forEach((relFlexes, stateId) => this.checkOne(relFlexes, stateId));

      const uniqueSubgraphs = this.getDistinctCount();
      const sizesAndSubgraphCounts = this.getSizesAndSubgraphCounts();
      return { uniqueSubgraphs, sizesAndSubgraphCounts };
    }

    // check all the states pointed to by a single state
    private checkOne(relFlexes: RelativeFlexes, stateId: number): void {
      const [subGraphs, unknownStates] = this.getPointers(relFlexes, stateId);
      if (subGraphs.length > 0 || unknownStates.length > 0) {
        this.assignSubgraphs(stateId, subGraphs, unknownStates);
      }
    }

    // returns two lists of references to other states:
    //  [existing subgraphs this state points to], [states with unknown subgraph numbers]
    private getPointers(relFlexes: RelativeFlexes, stateId: number): [number[], number[]] {
      const subGraphs: number[] = [];
      const unknownStates: number[] = [];
      relFlexes.forEach(relFlex => {
        if (relFlex.flex === this.flex) {
          const otherState = this.stateToSubgraph[relFlex.toState];
          if (otherState === undefined) {
            if (unknownStates.find(v => v === relFlex.toState) === undefined) {
              unknownStates.push(relFlex.toState);
            }
          } else {
            // points to a a state that's already part of a subgraph
            if (subGraphs.find(v => v === otherState) === undefined) {
              subGraphs.push(otherState);
            }
          }
        }
      });
      return [subGraphs, unknownStates];
    }

    // based on existing subgraphs this state points to & states with an unknown subgraph,
    // figure out how to assign a uniied subgraph number to all those states
    private assignSubgraphs(stateId: number, subGraphs: number[], unknownStates: number[]): void {
      const unset = [stateId].concat(unknownStates);
      switch (subGraphs.length) {
        case 0:
          // all states are part of new subgraph
          this.assignNumberToAll(stateId, unset);
          break;
        case 1:
          // state only pointed to a single subgraph, so use that
          this.assignNumberToAll(subGraphs[0], unset);
          break;
        default:
          // pointed to different subgraphs that should be turned into one
          this.unifySubgraphs(subGraphs, unset);
          break;
      }
    }

    // assign everything in 'unset' the number 'subgraph'
    private assignNumberToAll(subgraph: number, unset: number[]): void {
      unset.forEach(state => this.stateToSubgraph[state] = subgraph);
      if (this.statesInSubgraph[subgraph] === undefined) {
        this.statesInSubgraph[subgraph] = unset;
      } else {
        const current = this.statesInSubgraph[subgraph];
        let added: number[] = [];
        unset.forEach(state => {
          if (current.find(s => s === state) === undefined) {
            added.push(state);
          }
        });
        if (added.length > 0) {
          this.statesInSubgraph[subgraph] = current.concat(added);
        }
      }
    }

    // state pointed to multiple existing subgraphs, which we now know are all part of the same subgraph
    private unifySubgraphs(existing: number[], unset: number[]): void {
      const subgraph = existing[0];  // assign everything to this subgraph

      existing.slice(1).forEach(one => {
        this.statesInSubgraph[one].forEach(a => this.stateToSubgraph[a] = subgraph);
        this.statesInSubgraph[subgraph] = this.statesInSubgraph[subgraph].concat(this.statesInSubgraph[one]);
        this.statesInSubgraph[one] = [];
      });

      this.assignNumberToAll(subgraph, unset);
    }

    // count how many distinct subgraphs were found
    private getDistinctCount(): number {
      return this.statesInSubgraph.reduce((prev: number, current) => prev + (current.length === 0 ? 0 : 1), 0);
    }

    // get stats on the results
    private getSizesAndSubgraphCounts(): SizeAndSubgraphCount[] {
      const counts: number[] = [];
      this.statesInSubgraph.forEach(states => {
        const size = states.length;
        if (counts[size] === undefined) {
          counts[size] = 1;
        } else {
          counts[size] = counts[size] + 1;
        }
      });

      const result: SizeAndSubgraphCount[] = [];
      counts.forEach((count, index) => {
        if (index !== 0) {
          result.push({ size: index, subgraphCount: count });
        }
      });
      return result;
    }
  }

}
