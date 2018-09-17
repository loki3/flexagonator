namespace Flexagonator {

  /**
   * Find the Tuckerman traverse for a given flexagon,
   * which is a flex sequence of pinches and rotates that visits every state
   * and returns to the beginning
   */
  export function findTuckermanTraverse(flexagon: Flexagon): string {
    const patCount = flexagon.getPatCount();
    const flexes = makeAllFlexes(patCount);
    return findTuckermanTraverse3(flexagon, flexes['P'], flexes['>']);
  }

  export function findTuckermanTraverse3(flexagon: Flexagon, pinch: Flex, right: Flex): string {
    let best = '';
    let current = '';
    const tracker = Tracker.make(flexagon);
    const visited = new TrackVisited();
    while (true) {
      const afterP = pinch.apply(flexagon);
      if (!isFlexError(afterP)) {
        current += 'P';
        const result = tracker.findMaybeAdd(afterP);
        if (result === null) {
          // we found a new state, so reset our visit tracker
          visited.reset(tracker.getTotalStates());
          best = '';  // signal that we want to grab 'current' next time we revisit start
        } else {
          // we just revisited a state
          if (result === 0 && best === '') {
            // if we're back at the start, that could be our traversal
            best = current;
          }
          visited.add(result);
          if (visited.allVisited()) {
            break;  // we're done
          }
        }
        flexagon = afterP;
      } else {
        // couldn't pinch, so shift to next corner
        if (current.length > 0 && current[current.length - 1] != 'P') {
          break;  // no traverse is possible
        }
        const afterShift = right.apply(flexagon) as Flexagon;
        current += '>';
        flexagon = afterShift;
      }
    }
    return best;
  }

  // when we see a new state, we reset the tracker.
  // once we've seen every state since we last saw a new state,
  // we assume we've done the full traversal.
  class TrackVisited {
    private total = 0;
    private visited = 0;
    private which: boolean[] = [];

    reset(count: number) {
      this.total = count;
      this.visited = 0;
      this.which = [];
      for (let i = 0; i < count; i++) {
        this.which.push(false);
      }
    }

    add(n: number) {
      if (!this.which[n]) {
        this.visited++;
        this.which[n] = true;
      }
    }

    allVisited(): boolean {
      return this.visited >= this.total;
    }
  }

}
