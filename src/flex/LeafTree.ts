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

}
