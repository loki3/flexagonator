namespace Flexagonator {

  /**
   * get the graph of leaf-face ids that are adjacent across all the given flexagons.
   * looks at both sides of each flexagon.
   * lowest id gets connection, e.g., graph[1] contains 2 but not the other way around.
   */
  export function getLeafGraph(flexagons: Flexagon[]): StateToState {
    const leafToLeaf: StateToState = [];
    for (const flexagon of flexagons) {
      const visible = flexagon.getVisible();
      addFace(leafToLeaf, visible[0]);  // front face
      addFace(leafToLeaf, visible[1]);  // back face
    }
    return leafToLeaf;
  }

  /** add connections between adjacent leaves on this face */
  function addFace(leafToLeaf: StateToState, visible: number[]) {
    const len = visible.length;
    for (let i = 0; i < len - 1; i++) {
      addEdge(leafToLeaf, visible[i], visible[i + 1]);
    }
    // wrap from last to first
    addEdge(leafToLeaf, visible[len - 1], visible[0]);
  }

  /** add connection between two leaf-face ids, added to list for lowest id */
  function addEdge(leafToLeaf: StateToState, i: number, j: number) {
    const [low, high] = Math.abs(i) < Math.abs(j) ? [i, j] : [j, i];
    if (leafToLeaf[low] === undefined) {
      leafToLeaf[low] = [high];   // first connection for the 'low' leaf-face
    } else if (leafToLeaf[low].find(id => id === high) === undefined) {
      leafToLeaf[low].push(high); // add to list if not already present
    }
  }
}

