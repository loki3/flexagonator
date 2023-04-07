namespace Flexagonator {
  export type EqualResult =
    /** a=b : the sequences have the exact same effect */
    | 'exact'
    /** a>=b : if you do sequence 'a' first, they have the same effect */
    | 'aFirst'
    /** a<=b : if you do sequence 'b' first, they have the same effect */
    | 'bFirst'
    /** a~=b : the sequences have different requirements, but otherwise same effect */
    | 'approx'
    /** a!=b : the sequences never have the same effect */
    | 'unequal'
    ;

  /** check if two flex sequences have the same effect on a given flexagon */
  export function checkEqual(
    flexagon: Flexagon, aFlexes: string, bFlexes: string, useFlexes?: Flexes
  ): EqualResult | FlexError {
    // validate & check if sequences are exactly equal
    const result = checkExact(flexagon, aFlexes, bFlexes, useFlexes);
    if (isFlexError(result)) {
      return result;
    }
    if (result === true) {
      return 'exact';
    }

    // can 'b' be done on the structure created by 'a'?
    if (equalAfterGeneratingOne(flexagon, aFlexes, bFlexes, useFlexes)) {
      return 'aFirst';
    }
    // can 'a' be done on the structure created by 'b'?
    if (equalAfterGeneratingOne(flexagon, bFlexes, aFlexes, useFlexes)) {
      return 'bFirst';
    }

    // it's possible that both sequences create different structure,
    // but they otherwise have the same effect
    if (equalAfterGeneratingBoth(flexagon, aFlexes, bFlexes, useFlexes)) {
      return 'approx';
    }

    return 'unequal';
  }

  /** check if two sequences are exactly equal */
  function checkExact(
    flexagon: Flexagon, aFlexes: string, bFlexes: string, useFlexes?: Flexes
  ): boolean | FlexError {
    // apply 'a' to input
    const fmA = new FlexagonManager(flexagon, undefined, useFlexes);
    const resultA = fmA.applyFlexes(aFlexes, false);
    if (isFlexError(resultA)) {
      return resultA;
    }
    // apply 'b' to input
    const fmB = new FlexagonManager(flexagon, undefined, useFlexes);
    const resultB = fmB.applyFlexes(bFlexes, false);
    if (isFlexError(resultB)) {
      return resultB;
    }

    // if results are identical, they're exactly equal
    const treeA = fmA.flexagon.getAsLeafTrees();
    const treeB = fmB.flexagon.getAsLeafTrees();
    if (areLTArraysEqual(treeA, treeB)) {
      return true;
    }
    // it's possible they both created the exact same structure, but in a different order,
    // which means the leaf ids differ, so try B after using A as a generating sequence,
    // but only if they both generated the same number of leaves
    if (fmA.flexagon.getLeafCount() === fmB.flexagon.getLeafCount()) {
      if (equalAfterGeneratingOne(flexagon, aFlexes, bFlexes, useFlexes)) {
        return true;
      }
    }

    return false;
  }

  /** use sequence1 as a generating sequence & then see if sequence produces the same result */
  function equalAfterGeneratingOne(
    flexagon: Flexagon, sequence1: string, sequence2: string, useFlexes?: Flexes
  ): boolean {
    const fm = new FlexagonManager(flexagon, undefined, useFlexes);

    // apply sequence1 as a generating sequence from base state
    fm.applyFlexes(sequence1, false);
    const tree1 = fm.flexagon.getAsLeafTrees();
    // apply sequence2 from base state
    fm.applyInReverse(sequence1);
    fm.applyFlexes(sequence2, false);
    const tree2 = fm.flexagon.getAsLeafTrees();

    return areLTArraysEqual(tree1, tree2);
  }

  /** apply both generating sequences & then see if the sequences produce the same result */
  function equalAfterGeneratingBoth(
    flexagon: Flexagon, aFlexes: string, bFlexes: string, useFlexes?: Flexes
  ): boolean {
    const fm = new FlexagonManager(flexagon, undefined, useFlexes);

    // apply both generating sequences from base state
    fm.applyFlexes(aFlexes, false);
    fm.applyInReverse(aFlexes);
    fm.applyFlexes(bFlexes, false);
    fm.applyInReverse(bFlexes);

    // find result of applying each sequence
    fm.applyFlexes(aFlexes, false);
    const tree1 = fm.flexagon.getAsLeafTrees();
    fm.applyInReverse(aFlexes);
    fm.applyFlexes(bFlexes, false);
    const tree2 = fm.flexagon.getAsLeafTrees();

    return areLTArraysEqual(tree1, tree2);
  }
}
