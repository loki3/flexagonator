namespace Flexagonator {

  export interface FlexCounts {
    [index: string]: number;
  }

  /** count the number of states that support each flex */
  export function countStatesThatSupportFlexes(allRelFlexes: RelativeFlexes[]): FlexCounts {
    const counts: FlexCounts = {};
    for (const relFlexes of allRelFlexes) {
      // now we have all the flexes that can be done from one state
      // find all the flexes that can be performed here
      const flexList: string[] = [];
      for (const relFlex of relFlexes) {
        if (!flexList.find(x => (x === relFlex.flex))) {
          flexList.push(relFlex.flex);
        }
      }

      // bump the master counts
      for (const flex of flexList) {
        if (counts[flex] === undefined) {
          counts[flex] = 1;
        } else {
          counts[flex]++;
        }
      }
    }
    return counts;
  }

}
