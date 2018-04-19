namespace Flexagonator {

  /*
    Manages the pats in a flexagon
  */
  export class Flexagon {
    root: Pat[];
    constructor(root: Pat[]) {
      this.root = root;
    }

    getPatCount(): number {
      return this.root.length;
    }
  }
}
