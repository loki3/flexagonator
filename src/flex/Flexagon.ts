namespace Flexagonator {

  /*
    Manages the pats in a flexagon
  */
  export class Flexagon {
    constructor(private root: Pat[]) {
    }

    getPatCount(): number {
      return this.root.length;
    }
  }
}
