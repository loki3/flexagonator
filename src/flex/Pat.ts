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
    getTop(): number;
    getBottom(): number;

    hasPattern(pattern: LeafTree): boolean;
    // returns an array where the index is the pattern number from the input
    matchPattern(pattern: LeafTree): Pat[] | PatternError;
  }

  /*
    Make a pat out of nested binary arrays, where leaves are
    represented by numbers, with negative numbers representing
    leaves that are flipped over
    e.g. [1, [[-2, 3], 4]]
  */
  export function makePat(leaves: LeafTree): Pat | TreeError {
    if (!Array.isArray(leaves)) {
      if (typeof (leaves) !== "number") {
        return { reason: TreeCode.LeafIdMustBeInt, context: leaves };
      }
      return new PatLeaf(leaves as number);
    }

    if (leaves.length !== 2) {
      return { reason: TreeCode.ArrayMustHave2Items, context: leaves };
    }
    const left = makePat(leaves[0]);
    if (isTreeError(left)) {
      return left;
    }
    const right = makePat(leaves[1]);
    if (isTreeError(right)) {
      return right;
    }
    return new PatPair(left, right);
  }

  export function combinePats(pat1: Pat, pat2: Pat): Pat {
    return new PatPair(pat1, pat2);
  }


  // single leaf
  class PatLeaf implements Pat {
    constructor(private readonly id: number) {
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

    getTop(): number {
      return this.id;
    }

    getBottom(): number {
      return -this.id;
    }

    hasPattern(pattern: LeafTree): boolean {
      return typeof (pattern) === "number";
    }

    matchPattern(pattern: LeafTree): Pat[] | PatternError {
      if (!this.hasPattern(pattern)) {
        return { expected: pattern, actual: this.id };
      }
      var match: Pat[] = [];
      match[pattern as number] = this;
      return match;
    }
  }

  // pair of sub-pats
  class PatPair implements Pat {
    constructor(private readonly left: Pat, private readonly right: Pat) {
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

    getTop(): number {
      return this.left.getTop();
    }

    getBottom(): number {
      return this.right.getBottom();
    }

    hasPattern(pattern: LeafTree): boolean {
      if (!Array.isArray(pattern)) {
        return true;
      }
      if (pattern.length !== 2) {
        return false;
      }
      return this.left.hasPattern(pattern[0]) && this.right.hasPattern(pattern[1]);
    }

    matchPattern(pattern: LeafTree): Pat[] | PatternError {
      if (typeof (pattern) === "number") {
        var match: Pat[] = [];
        match[pattern as number] = this;
        return match;
      }

      if (Array.isArray(pattern) && pattern.length === 2) {
        const leftMatch = this.left.matchPattern(pattern[0]);
        if (isPatternError(leftMatch)) {
          return leftMatch;
        }
        const rightMatch = this.right.matchPattern(pattern[1]);
        if (isPatternError(rightMatch)) {
          return rightMatch;
        }

        var join = leftMatch;
        for (var i in rightMatch) {
          join[i] = rightMatch[i];
        }
        return join;
      }

      return { expected: pattern, actual: [this.left, this.right] };
    }
  }

}
