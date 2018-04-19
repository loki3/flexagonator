"use strict"
namespace Flexagonator {

  /*
    Manages a single pat (pile of leaves) in a flexagon
  */
  export class Pat {
    root: Node;
    constructor(root: Node) {
      this.root = root;
    }

    getLeafCount(): number {
      return this.root.getLeafCount();
    }

    makeCopy(): Node {
      return this.root.makeCopy();
    }

    makeFlipped(): Pat {
      return new Pat(this.root.makeFlipped());
    }
  }

  /*
    Make a pat out of nested arrays, where leaves are
    represented by numbers, with negative numbers
    representing leaves that are flipped over
    e.g. [1, [[-2, 3], 4]]
  */
  export function makePat(leaves: any[]): Pat {
    return new Pat(makeNode(leaves));
  }

  // sub-pat, either a leaf or pair of sub-pats
  interface Node {
    getLeafCount(): number;
    makeCopy(): Node;
    makeFlipped(): Node;
  }

  // single leaf
  class LeafNode implements Node {
    id: number;
    constructor(id: number) {
      this.id = id;
    }

    getLeafCount(): number {
      return 1;
    }

    makeCopy(): Node {
      return new LeafNode(this.id);
    }

    makeFlipped(): Node {
      return new LeafNode(-this.id);
    }
  }

  // pair of sub-pats
  class SplitNode implements Node {
    left: Node;
    right: Node;
    constructor(left: Node, right: Node) {
      this.left = left;
      this.right = right;
    }

    getLeafCount(): number {
      return this.left.getLeafCount() + this.right.getLeafCount();
    }

    makeCopy(): Node {
      return new SplitNode(this.left.makeCopy(), this.right.makeCopy());
    }

    makeFlipped(): Node {
      return new SplitNode(this.right.makeFlipped(), this.left.makeFlipped());
    }
  }

  // recursively create a pat from a nested array
  function makeNode(leaves: any[]): Node {
    if (leaves.length == 1) {
      return new LeafNode(leaves[0] as number);
    }
    const left = makeNode(leaves[0]);
    const right = makeNode(leaves[1]);
    return new SplitNode(left, right);
  }

}
