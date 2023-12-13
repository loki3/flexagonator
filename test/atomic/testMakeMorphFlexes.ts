namespace Flexagonator {

  describe('makeMorphFlexes', () => {
    it('should generate valid flexes', () => {
      const flexes: Flexes = makeMorphFlexes(6);
      for (let flex of Object.keys(flexes)) {
        if (isFlexError(flexes[flex])) {
          fail();
          return;
        }
      }
    });

    it('should combine into other valid flexes on a hexaflexagon', () => {
      const morphFlexes: Flexes = makeMorphFlexes(6);
      const mainFlexes: Flexes = makeAllFlexes(6);

      expect(checkForEqual("F", "Mkf Mkb'", mainFlexes, morphFlexes)).toBeTruthy("F failed");
      expect(checkForEqual("St", "Mkf Mkfs'", mainFlexes, morphFlexes)).toBeTruthy("St failed");
      expect(checkForEqual("S", "< Mkfs Mkb' >", mainFlexes, morphFlexes)).toBeTruthy("S failed");
      expect(checkForEqual("T", "< Mkr Mkf' >", mainFlexes, morphFlexes)).toBeTruthy("T failed");
      expect(checkForEqual("Fm", "< Mkr Mkb' >", mainFlexes, morphFlexes)).toBeTruthy("Fm failed");
      expect(checkForEqual("S3", "< Mkr Mkl' >", mainFlexes, morphFlexes)).toBeTruthy("S3 failed");

      expect(checkForEqual("S", "Mkf Sp Mkb' >", mainFlexes, morphFlexes)).toBeTruthy("S from Sp failed");
      expect(checkForEqual("Ltf", "Mkf Lkk Mkf' <", mainFlexes, morphFlexes)).toBeTruthy("Ltf failed");
      expect(checkForEqual("Lk", "Mkf Lkk Mkbs' <", mainFlexes, morphFlexes)).toBeTruthy("Lk failed");

      // uses hexa specific flexes: Mkh, Mkt
      expect(checkForEqual("Ttf", "Mkh Mkf'", mainFlexes, morphFlexes)).toBeTruthy("Ttf failed");
      expect(checkForEqual("V", "Mkb Mkh'", mainFlexes, morphFlexes)).toBeTruthy("V failed");
      expect(checkForEqual("T", "Mkh Mkt'", mainFlexes, morphFlexes)).toBeTruthy("T failed");
      expect(checkForEqual("Lh", "Mkf Lkk Mkh'", mainFlexes, morphFlexes)).toBeTruthy("Lh failed");
      expect(checkForEqual("Ltb", "Mkf Lkk Mkt'", mainFlexes, morphFlexes)).toBeTruthy("Ltb failed");
      expect(checkForEqual("Lbb", "Mkf Lkk > > > Mkt' < <", mainFlexes, morphFlexes)).toBeTruthy("Lbb failed");
      expect(checkForEqual("Lbf", "Mkf Lkk > > > Mkf' < <", mainFlexes, morphFlexes)).toBeTruthy("Lbf failed");
    });

    it('should combine into other valid flexes on an octaflexagon', () => {
      const morphFlexes: Flexes = makeMorphFlexes(8);
      const mainFlexes: Flexes = makeAllFlexes(8);

      expect(checkForEqual("F", "Mkf Mkb'", mainFlexes, morphFlexes)).toBeTruthy("F failed");
      expect(checkForEqual("St", "Mkf Mkfs'", mainFlexes, morphFlexes)).toBeTruthy("St failed");
      expect(checkForEqual("S", "< Mkfs Mkb' >", mainFlexes, morphFlexes)).toBeTruthy("S failed");
      expect(checkForEqual("T3", "< Mkr Mkf' >", mainFlexes, morphFlexes)).toBeTruthy("T3 failed");
      expect(checkForEqual("Fm", "< Mkr Mkb' >", mainFlexes, morphFlexes)).toBeTruthy("Fm failed");
      expect(checkForEqual("S3", "< Mkr Mkl' >", mainFlexes, morphFlexes)).toBeTruthy("S3 failed");

      expect(checkForEqual("S", "Mkf Sp Mkb' >", mainFlexes, morphFlexes)).toBeTruthy("S from Sp failed");
      expect(checkForEqual("Ltf", "Mkf Lkk Mkf' <", mainFlexes, morphFlexes)).toBeTruthy("Ltf failed");
      expect(checkForEqual("Lk", "Mkf Lkk Mkbs' <", mainFlexes, morphFlexes)).toBeTruthy("Lk failed");
    });

    // check that flex = sequence, when applied
    function checkForEqual(flex: string, sequence: string, mainFlexes: Flexes, morphFlexes: Flexes): boolean {
      const pre = Flexagon.makeFromTree(mainFlexes[flex].input) as Flexagon;
      const fFlex = applyFlexes(mainFlexes, morphFlexes, flex, pre);
      const fSequence = applyFlexes(mainFlexes, morphFlexes, sequence, pre);
      return compare(fFlex, fSequence)
    }

    // apply a sequence of flexes like "< Mkfs Mkb' >"
    function applyFlexes(mainFlexes: Flexes, morphFlexes: Flexes, sequence: string, flexagon: Flexagon): Flexagon {
      const flexes = sequence.split(' ');
      for (const flex of flexes) {
        const which = flex.startsWith('Mk') || (flex === 'Sp') || (flex === 'Lkk') ? morphFlexes : mainFlexes;
        const result = which[flex].apply(flexagon);
        if (isFlexError(result)) {
          console.log('failed to apply ', flex, ' with error ', JSON.stringify(result));
          return flexagon;
        }
        flexagon = result;
      }
      return flexagon
    }

    // compare the pat structure of two flexagons
    function compare(f1: Flexagon, f2: Flexagon): boolean {
      const s1 = JSON.stringify(f1.getAsLeafTrees());
      const s2 = JSON.stringify(f2.getAsLeafTrees());
      if (s1 === s2) {
        return true;
      }
      console.log('');
      console.log('expected: ', s1);
      console.log('  actual: ', s2);
      return false;
    }
  });
}
