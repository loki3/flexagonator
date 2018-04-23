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
    getThickness(): number;
    getStructure(): string;

    hasPattern(pattern: LeafTree): boolean;
    // returns an array where the index is the pattern number from the input
    matchPattern(pattern: LeafTree): Pat[] | PatternError;
    createPattern(pattern: LeafTree, getNextId: () => number): Pat;
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

    getThickness(): number {
      return 1;
    }

    getStructure(): string {
      return '-';
    }

    hasPattern(pattern: LeafTree): boolean {
      return typeof (pattern) === "number";
    }

    matchPattern(pattern: LeafTree): Pat[] | PatternError {
      if (!this.hasPattern(pattern)) {
        return { expected: pattern, actual: this.id };
      }
      const n: number = pattern as number;
      var match: Pat[] = [];
      match[Math.abs(n)] = n >= 0 ? this : this.makeFlipped();
      return match;
    }

    createPattern(pattern: LeafTree, getNextId: () => number): Pat {
      if (typeof (pattern) === "number") {
        return this.makeCopy();
      }

      // we want the first leaf to use this.id, all others use getNextId
      var usedId = false;
      const patternArray = pattern as any[];
      const newLeft = this.subCreate(patternArray[0], () => {
        if (usedId) return getNextId();
        usedId = true;
        return this.id;
      });
      const newRight = this.subCreate(patternArray[0], getNextId);
      return new PatPair(newLeft, newRight);
    }

    // recurse through 'pattern', creating substructure as needed
    private subCreate(pattern: LeafTree, getNextId: () => number): Pat {
      if (typeof (pattern) === "number") {
        return new PatLeaf(getNextId());
      }
      const patternArray = pattern as any[];
      const newLeft = this.subCreate(patternArray[0], getNextId);
      const newRight = this.subCreate(patternArray[1], getNextId);
      return new PatPair(newLeft, newRight);
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

    getThickness(): number {
      return this.left.getThickness() + this.right.getThickness();
    }

    getStructure(): string {
      return '[' + this.left.getStructure() + ' ' + this.right.getStructure() + ']';
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
        const n: number = pattern as number;
        var match: Pat[] = [];
        match[Math.abs(n)] = n >= 0 ? this : this.makeFlipped();
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

    createPattern(pattern: LeafTree, getNextId: () => number): Pat {
      if (typeof (pattern) === "number") {
        return this.makeCopy();
      }
      const patternArray = pattern as any[];
      const newLeft = this.left.createPattern(patternArray[0], getNextId);
      const newRight = this.right.createPattern(patternArray[1], getNextId);
      return new PatPair(newLeft, newRight);
    }
  }

}
