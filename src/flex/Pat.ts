"use strict"
namespace Flexagonator {

  /*
    A single pat (stack of polygons) in a flexagon
  */
  export interface Pat {
    getLeafCount(): number;
    makeCopy(): Pat;
    makeFlipped(): Pat;
    getAsLeafTree(): LeafTree;
  }

  /*
    Make a pat out of nested binary arrays, where leaves are
    represented by numbers, with negative numbers representing
    leaves that are flipped over
    e.g. [1, [[-2, 3], 4]]
  */
  export function makePat(leaves: LeafTree): Pat {
    if (!Array.isArray(leaves)) {
      return new PatLeaf(leaves as number);
    }
    const left = makePat(leaves[0]);
    const right = makePat(leaves[1]);
    return new PatPair(left, right);
  }


  // single leaf
  class PatLeaf implements Pat {
    constructor(private id: number) {
    }

    getLeafCount(): number {
      return 1;
    }

    makeCopy(): Pat {
      return new PatLeaf(this.id);
    }

    makeFlipped(): Pat {
      return new PatLeaf(-this.id);
    }

    getAsLeafTree(): LeafTree {
      return this.id;
    }
  }

  // pair of sub-pats
  class PatPair implements Pat {
    constructor(private left: Pat, private right: Pat) {
    }

    getLeafCount(): number {
      return this.left.getLeafCount() + this.right.getLeafCount();
    }

    makeCopy(): Pat {
      return new PatPair(this.left.makeCopy(), this.right.makeCopy());
    }

    makeFlipped(): Pat {
      return new PatPair(this.right.makeFlipped(), this.left.makeFlipped());
    }

    getAsLeafTree(): LeafTree {
      return [this.left.getAsLeafTree(), this.right.getAsLeafTree()];
    }
  }

}
