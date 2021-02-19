namespace Flexagonator {

  describe('makeHalfFlexes', () => {
    it('should generate valid flexes', () => {
      const flexes: Flexes = makeHalfFlexes(6);
      for (let flex of Object.keys(flexes)) {
        if (isFlexError(flexes[flex])) {
          fail();
          return;
        }
      }
    });

    it('should combine into other valid flexes on a hexaflexagon', () => {
      const halfFlexes: Flexes = makeHalfFlexes(6);
      const mainFlexes: Flexes = makeAllFlexes(6);

      expect(checkForEqual("F", "Hf Hb'", mainFlexes, halfFlexes)).toBeTruthy("F failed");
      expect(checkForEqual("St", "Hf Hsr'", mainFlexes, halfFlexes)).toBeTruthy("St failed");
      expect(checkForEqual("S", "< Hsr Hb' >", mainFlexes, halfFlexes)).toBeTruthy("S failed");
      expect(checkForEqual("T", "< Hr Hf' >", mainFlexes, halfFlexes)).toBeTruthy("T failed");
      expect(checkForEqual("Mf", "< Hr Hb' >", mainFlexes, halfFlexes)).toBeTruthy("Mf failed");
      expect(checkForEqual("S3", "< Hr Hl' >", mainFlexes, halfFlexes)).toBeTruthy("S3 failed");

      expect(checkForEqual("Ltf", "Hf Lkk Hf' <", mainFlexes, halfFlexes)).toBeTruthy("Ltf failed");
      expect(checkForEqual("Lk", "Hf Lkk Hsl' <", mainFlexes, halfFlexes)).toBeTruthy("Lk failed");

      // uses hexa specific flexes: Hh, Ht
      expect(checkForEqual("Ttf", "Hh Hf'", mainFlexes, halfFlexes)).toBeTruthy("Ttf failed");
      expect(checkForEqual("V", "Hb Hh'", mainFlexes, halfFlexes)).toBeTruthy("V failed");
      expect(checkForEqual("T", "Hh Ht'", mainFlexes, halfFlexes)).toBeTruthy("T failed");
      expect(checkForEqual("Lh", "Hf Lkk Hh'", mainFlexes, halfFlexes)).toBeTruthy("Lh failed");
      expect(checkForEqual("Ltb", "Hf Lkk Ht'", mainFlexes, halfFlexes)).toBeTruthy("Ltb failed");
      expect(checkForEqual("Lbb", "Hf Lkk > > > Ht' < <", mainFlexes, halfFlexes)).toBeTruthy("Lbb failed");
      expect(checkForEqual("Lbf", "Hf Lkk > > > Hf' < <", mainFlexes, halfFlexes)).toBeTruthy("Lbf failed");
    });

    it('should combine into other valid flexes on an octaflexagon', () => {
      const halfFlexes: Flexes = makeHalfFlexes(8);
      const mainFlexes: Flexes = makeAllFlexes(8);

      expect(checkForEqual("F", "Hf Hb'", mainFlexes, halfFlexes)).toBeTruthy("F failed");
      expect(checkForEqual("St", "Hf Hsr'", mainFlexes, halfFlexes)).toBeTruthy("St failed");
      expect(checkForEqual("S", "< Hsr Hb' >", mainFlexes, halfFlexes)).toBeTruthy("S failed");
      expect(checkForEqual("T3", "< Hr Hf' >", mainFlexes, halfFlexes)).toBeTruthy("T3 failed");
      expect(checkForEqual("Mf", "< Hr Hb' >", mainFlexes, halfFlexes)).toBeTruthy("Mf failed");
      expect(checkForEqual("S3", "< Hr Hl' >", mainFlexes, halfFlexes)).toBeTruthy("S3 failed");

      expect(checkForEqual("Ltf", "Hf Lkk Hf' <", mainFlexes, halfFlexes)).toBeTruthy("Ltf failed");
      expect(checkForEqual("Lk", "Hf Lkk Hsl' <", mainFlexes, halfFlexes)).toBeTruthy("Lk failed");
    });

    // check that flex = sequence, when applied
    function checkForEqual(flex: string, sequence: string, mainFlexes: Flexes, halfFlexes: Flexes): boolean {
      const pre = Flexagon.makeFromTree(mainFlexes[flex].pattern) as Flexagon;
      const fFlex = applyFlexes(mainFlexes, halfFlexes, flex, pre);
      const fSequence = applyFlexes(mainFlexes, halfFlexes, sequence, pre);
      return compare(fFlex, fSequence)
    }

    // apply a sequence of flexes like "< Hsr Hb' >"
    function applyFlexes(mainFlexes: Flexes, halfFlexes: Flexes, sequence: string, flexagon: Flexagon): Flexagon {
      const flexes = sequence.split(' ');
      for (const flex of flexes) {
        const which = (flex[0] === 'H') || (flex === 'Lkk') ? halfFlexes : mainFlexes;
        const result = which[flex].apply(flexagon);
        if (isFlexError(result)) {
          console.log('failed to apply ', flex, ' with error ', result);
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
