namespace Flexagonator {

  export interface FlexCounts {
    [index: string]: number;
  }

  export function countStatesThatSupportFlexes(allRelFlexes: RelativeFlexes[]): FlexCounts {
    var counts: FlexCounts = {};
    for (var relFlexes of allRelFlexes) {
      // now we have all the flexes that can be done from one state
      // find all the flexes that can be performed here
      var flexList: string[] = [];
      for (var relFlex of relFlexes) {
        if (!flexList.find(x => (x === relFlex.flex))) {
          flexList.push(relFlex.flex);
        }
      }

      // bump the master counts
      for (var flex of flexList) {
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
