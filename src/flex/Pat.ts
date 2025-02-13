"use strict"
namespace Flexagonator {

  export enum WhereLeaf {
    NotFound,
    Found,
    FoundFlipped,
  }

  /*
    A single pat (stack of polygons) in a flexagon
  */
  export interface Pat {
    isEqual(pat: Pat): boolean; /** structure and id */
    isEqualStructure(pat: Pat): boolean; /** just structure, ignore id */
    getLeafCount(): number;
    makeCopy(): Pat;
    makeFlipped(): Pat;
    remap(map: Record<number, number>): Pat; // turn id into map[id]
    getAsLeafTree(): LeafTree;
    getTop(): number;
    getBottom(): number;
    getStructure(): string;
    getStructureLTEId(id: number): string;
    getString(): string;
    findId(id: number): WhereLeaf;
    findMinId(): number;  // min(abs(id))
    findMaxId(): number;  // max(abs(id))
    unfold(): [Pat, Pat] | null;  // unfold so the inside is on top

    hasPattern(pattern: LeafTree): boolean;
    // returns an array where the index is the pattern number from the input
    matchPattern(pattern: LeafTree): Pat[] | PatternError;
    // create structure necessary to support pattern, tracking new subpats split from single leaves
    createPattern(pattern: LeafTree, getNextId: () => number, splits: Pat[]): Pat;
    // fill in all 0's with an incremented counter
    replaceZeros(getNextId: () => number): Pat;
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

    isEqual(pat: Pat): boolean {
      return pat !== undefined && this.id === (pat as PatLeaf).id;
    }
    isEqualStructure(pat: Pat): boolean {
      return pat !== undefined && (pat as PatLeaf).id !== undefined; // are they both PatLeafs?
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

    remap(map: Record<number, number>): Pat {
      const newid = this.id > 0 ? map[this.id] : -map[-this.id];
      return new PatLeaf(newid);
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

    getStructure(): string {
      return '-';
    }

    getStructureLTEId(id: number): string {
      const thisId = Math.abs(this.id);
      return thisId <= id ? this.id.toString() : '';
    }

    getString(): string {
      return this.id.toString();
    }

    findId(id: number): WhereLeaf {
      if (this.id == id) {
        return WhereLeaf.Found;
      }
      return (this.id == -id) ? WhereLeaf.FoundFlipped : WhereLeaf.NotFound;
    }

    findMinId(): number {
      return Math.abs(this.id);
    }

    findMaxId(): number {
      return Math.abs(this.id);
    }

    unfold(): [Pat, Pat] | null {
      return null;
    }

    hasPattern(pattern: LeafTree): boolean {
      return typeof (pattern) === "number";
    }

    matchPattern(pattern: LeafTree): Pat[] | PatternError {
      if (!this.hasPattern(pattern)) {
        return { expected: pattern, actual: this.id };
      }
      const n: number = pattern as number;
      const match: Pat[] = [];
      match[Math.abs(n)] = n >= 0 ? this : this.makeFlipped();
      return match;
    }

    createPattern(pattern: LeafTree, getNextId: () => number, splits: Pat[]): Pat {
      if (typeof (pattern) === "number") {
        return this.makeCopy();
      }

      // we want the first leaf to use this.id, all others use getNextId
      let usedId = false;
      const patternArray = pattern as any[];
      const newLeft = this.subCreate(patternArray[0], () => {
        if (usedId) return getNextId();
        usedId = true;
        return this.id;
      });
      const newRight = this.subCreate(patternArray[1], getNextId);

      const newpat = new PatPair(newLeft, newRight);
      splits.push(newpat);
      return newpat;
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

    replaceZeros(getNextId: () => number): Pat {
      return this.id === 0 ? new PatLeaf(getNextId()) : this;
    }
  }

  // pair of sub-pats
  class PatPair implements Pat {
    constructor(private readonly left: Pat, private readonly right: Pat) {
    }

    isEqual(pat: Pat): boolean {
      if (pat === undefined) {
        return false;
      }
      return this.left.isEqual((pat as PatPair).left) && this.right.isEqual((pat as PatPair).right);
    }
    isEqualStructure(pat: Pat): boolean {  // are they both PatPairs with same structure?
      const other = pat as PatPair;
      if (other === undefined || other.left === undefined) {
        return false;
      }
      return this.left.isEqualStructure(other.left) && this.right.isEqualStructure(other.right);
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

    remap(map: Record<number, number>): Pat {
      return new PatPair(this.left.remap(map), this.right.remap(map));
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

    getStructure(): string {
      return '[' + this.left.getStructure() + ' ' + this.right.getStructure() + ']';
    }

    getStructureLTEId(id: number): string {
      const left = this.left.getStructureLTEId(id);
      const right = this.right.getStructureLTEId(id);
      if (left === '' && right === '') {
        return '';
      }
      return '[' + (left === '' ? ':' : left) + ' ' + (right === '' ? ':' : right) + ']';
    }

    getString(): string {
      return '[' + this.left.getString() + ',' + this.right.getString() + ']';
    }

    findId(id: number): WhereLeaf {
      const a = this.left.findId(id);
      if (a !== WhereLeaf.NotFound) {
        return a;
      }
      return this.right.findId(id);
    }

    findMinId(): number {
      const a = this.left.findMinId();
      const b = this.right.findMinId();
      return Math.min(a, b);
    }

    findMaxId(): number {
      const a = this.left.findMaxId();
      const b = this.right.findMaxId();
      return Math.max(a, b);
    }

    unfold(): [Pat, Pat] | null {
      return [this.right, this.left.makeFlipped()];
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
        const match: Pat[] = [];
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

        let join = leftMatch;
        for (let i in rightMatch) {
          join[i] = rightMatch[i];
        }
        return join;
      }

      return { expected: pattern, actual: [this.left, this.right] };
    }

    createPattern(pattern: LeafTree, getNextId: () => number, splits: Pat[]): Pat {
      if (typeof (pattern) === "number") {
        return this.makeCopy();
      }
      const patternArray = pattern as any[];
      const newLeft = this.left.createPattern(patternArray[0], getNextId, splits);
      const newRight = this.right.createPattern(patternArray[1], getNextId, splits);
      return new PatPair(newLeft, newRight);
    }

    replaceZeros(getNextId: () => number): Pat {
      const newLeft = this.left.replaceZeros(getNextId);
      const newRight = this.right.replaceZeros(getNextId);
      return new PatPair(newLeft, newRight);
    }
  }

}
