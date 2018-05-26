namespace Flexagonator {

  describe('makeFlexName', () => {
    it('should interpret flex names correctly', () => {
      {
        const flex = makeFlexName("S");
        expect(flex.fullName).toBe("S");
        expect(flex.justName).toBe("S");
        expect(flex.lookupName).toBe("S");
        expect(flex.isInverse).toBeFalsy();
        expect(flex.shouldApply).toBeTruthy();
        expect(flex.shouldGenerate).toBeFalsy();
      }

      {
        const flex = makeFlexName("Lt'");
        expect(flex.fullName).toBe("Lt'");
        expect(flex.justName).toBe("Lt");
        expect(flex.lookupName).toBe("Lt'");
        expect(flex.isInverse).toBeTruthy();
        expect(flex.shouldApply).toBeTruthy();
        expect(flex.shouldGenerate).toBeFalsy();
      }

      {
        const flex = makeFlexName("Ltb'*");
        expect(flex.fullName).toBe("Ltb'*");
        expect(flex.justName).toBe("Ltb");
        expect(flex.lookupName).toBe("Ltb'");
        expect(flex.isInverse).toBeTruthy();
        expect(flex.shouldApply).toBeTruthy();
        expect(flex.shouldGenerate).toBeTruthy();
      }

      {
        const flex = makeFlexName("P+");
        expect(flex.fullName).toBe("P+");
        expect(flex.justName).toBe("P");
        expect(flex.lookupName).toBe("P");
        expect(flex.isInverse).toBeFalsy();
        expect(flex.shouldApply).toBeFalsy();
        expect(flex.shouldGenerate).toBeTruthy();
      }
    });
  });

}
