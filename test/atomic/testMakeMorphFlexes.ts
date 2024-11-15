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

      expect(checkForEqual("F", "Mkf Mkb'", mainFlexes, morphFlexes)).withContext("F failed").toBeTrue();
      expect(checkForEqual("St", "Mkf Mkfs'", mainFlexes, morphFlexes)).withContext("St failed").toBeTrue();
      expect(checkForEqual("S", "< Mkfs Mkb' >", mainFlexes, morphFlexes)).withContext("S failed").toBeTrue();
      expect(checkForEqual("T", "< Mkr Mkf' >", mainFlexes, morphFlexes)).withContext("T failed").toBeTrue();
      expect(checkForEqual("Fm", "< Mkr Mkb' >", mainFlexes, morphFlexes)).withContext("Fm failed").toBeTrue();
      expect(checkForEqual("S3", "< Mkr Mkl' >", mainFlexes, morphFlexes)).withContext("S3 failed").toBeTrue();

      expect(checkForEqual("S", "Mkf Sp Mkb' >", mainFlexes, morphFlexes)).withContext("S from Sp failed").toBeTrue();
      expect(checkForEqual("Ltf", "Mkf Lkk Mkf' <", mainFlexes, morphFlexes)).withContext("Ltf failed").toBeTrue();
      expect(checkForEqual("Lk", "Mkf Lkk Mkbs' <", mainFlexes, morphFlexes)).withContext("Lk failed").toBeTrue();

      // uses hexa specific flexes: Mkh, Mkt
      expect(checkForEqual("Ttf", "Mkh Mkf'", mainFlexes, morphFlexes)).withContext("Ttf failed").toBeTrue();
      expect(checkForEqual("V", "Mkb Mkh'", mainFlexes, morphFlexes)).withContext("V failed").toBeTrue();
      expect(checkForEqual("T", "Mkh Mkt'", mainFlexes, morphFlexes)).withContext("T failed").toBeTrue();
      expect(checkForEqual("Lh", "Mkf Lkk Mkh'", mainFlexes, morphFlexes)).withContext("Lh failed").toBeTrue();
      expect(checkForEqual("Ltb", "Mkf Lkk Mkt'", mainFlexes, morphFlexes)).withContext("Ltb failed").toBeTrue();
      expect(checkForEqual("Lbb", "Mkf Lkk > > > Mkt' < <", mainFlexes, morphFlexes)).withContext("Lbb failed").toBeTrue();
      expect(checkForEqual("Lbf", "Mkf Lkk > > > Mkf' < <", mainFlexes, morphFlexes)).withContext("Lbf failed").toBeTrue();
    });

    it('should combine into other valid flexes on an octaflexagon', () => {
      const morphFlexes: Flexes = makeMorphFlexes(8);
      const mainFlexes: Flexes = makeAllFlexes(8);

      expect(checkForEqual("F", "Mkf Mkb'", mainFlexes, morphFlexes)).withContext("F failed").toBeTrue();
      expect(checkForEqual("St", "Mkf Mkfs'", mainFlexes, morphFlexes)).withContext("St failed").toBeTrue();
      expect(checkForEqual("S", "< Mkfs Mkb' >", mainFlexes, morphFlexes)).withContext("S failed").toBeTrue();
      expect(checkForEqual("T3", "< Mkr Mkf' >", mainFlexes, morphFlexes)).withContext("T3 failed").toBeTrue();
      expect(checkForEqual("Fm", "< Mkr Mkb' >", mainFlexes, morphFlexes)).withContext("Fm failed").toBeTrue();
      expect(checkForEqual("S3", "< Mkr Mkl' >", mainFlexes, morphFlexes)).withContext("S3 failed").toBeTrue();

      expect(checkForEqual("S", "Mkf Sp Mkb' >", mainFlexes, morphFlexes)).withContext("S from Sp failed").toBeTrue();
      expect(checkForEqual("Ltf", "Mkf Lkk Mkf' <", mainFlexes, morphFlexes)).withContext("Ltf failed").toBeTrue();
      expect(checkForEqual("Lk", "Mkf Lkk Mkbs' <", mainFlexes, morphFlexes)).withContext("Lk failed").toBeTrue();
    });

    // check that flex = sequence, when applied
    function checkForEqual(flex: string, sequence: string, mainFlexes: Flexes, morphFlexes: Flexes): boolean {
      const pre = Flexagon.makeFromTree(mainFlexes[flex].input) as Flexagon;
      const fFlex = applyFlexes(mainFlexes, morphFlexes, flex, pre);
      const fSequence = applyFlexes(mainFlexes, morphFlexes, sequence, pre);
      return compare(flex, sequence, fFlex, fSequence)
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
    function compare(flex: string, sequence: string, f1: Flexagon, f2: Flexagon): boolean {
      // compare pat structure
      const s1 = JSON.stringify(f1.getAsLeafTrees());
      const s2 = JSON.stringify(f2.getAsLeafTrees());
      if (s1 !== s2) {
        console.log('\nPAT MISMATCH trying', flex, '=', sequence);
        console.log('expected: ', s1);
        console.log('  actual: ', s2);
        return false;
      }

      // compare directions
      const d1 = !f1.directions ? 'iso'
        : f1.hasSameDirections() ? 'iso'
          : f1.directions.asString(true);
      const d2 = !f2.directions ? 'iso'
        : f2.hasSameDirections() ? 'iso'
          : f2.directions.asString(true);
      if (d1 !== d2) {
        console.log('\nDIR MISMATCH trying', flex, '=', sequence);
        console.log('expected: ', d1);
        console.log('  actual: ', d2);
        return false;
      }

      // compare angles
      const a1 = JSON.stringify(f1.angleTracker.corners);
      const a2 = JSON.stringify(f2.angleTracker.corners);
      if (a1 !== a2) {
        console.log('\nANGLE MISMATCH trying', flex, '=', sequence);
        console.log('expected: ', a1);
        console.log('  actual: ', a2);
        return false;
      }

      return true;
    }
  });
}
