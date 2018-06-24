namespace Flexagonator {

  /*
    Either a number or an array with two LeafTrees,
    where each item is either a number or another LeafTree
  */
  export type LeafTree = number | any[];

  export function isValid(tree: LeafTree): boolean {
    if (typeof (tree) === "number") {
      return Number.isInteger(<number>tree);
    }

    if (Array.isArray(tree)) {
      const array = <any[]>tree;
      if (array.length == 2) {
        return isValid(array[0]) && isValid(array[1]);
      }
    }
    return false;
  }

  export function areEqual(tree1: LeafTree, tree2: LeafTree): boolean {
    if (typeof (tree1) !== typeof (tree2))
      return false;

    if (typeof (tree1) === "number") {
      return tree1 === tree2;
    }

    if (Array.isArray(tree1)) {
      const array1 = <any[]>tree1;
      const array2 = <any[]>tree2;
      if (array1.length == 2 && array2.length == 2) {
        return areEqual(array1[0], array2[0]) && areEqual(array1[1], array2[1]);
      }
    }
    return false;
  }

  export function areLTArraysEqual(a: LeafTree[], b: LeafTree[]): boolean {
    if (a.length !== b.length) {
      return false;
    }
    for (let i in a) {
      if (!areEqual(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }

  export function getTop(tree: LeafTree): number {
    return (typeof (tree) === "number") ? tree : getTop(tree[0]);
  }

  export function parseLeafTrees(str: string): LeafTree[] | TreeError {
    try {
      const result = JSON.parse(str);
      if (!Array.isArray(result)) {
        return { reason: TreeCode.ExpectedArray, context: result };
      }

      const array = <any[]>result;
      let i = 0;
      for (let tree of array) {
        if (!isValid(tree)) {
          return { reason: TreeCode.ErrorInSubArray, context: "problem in element # " + i };
        }
        i++;
      }

      return result;
    } catch (error) {
      return { reason: TreeCode.ParseError, context: error };
    }
  }

}
