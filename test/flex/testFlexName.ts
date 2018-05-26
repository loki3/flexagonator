namespace Flexagonator {

  describe('makeFlexName', () => {
    it('should interpret flex names correctly', () => {
      {
        const flex = makeFlexName("S");
        expect(flex.fullName).toBe("S");
        expect(flex.baseName).toBe("S");
        expect(flex.flexName).toBe("S");
        expect(flex.isInverse).toBeFalsy();
        expect(flex.shouldApply).toBeTruthy();
        expect(flex.shouldGenerate).toBeFalsy();
      }

      {
        const flex = makeFlexName("Lt'");
        expect(flex.fullName).toBe("Lt'");
        expect(flex.baseName).toBe("Lt");
        expect(flex.flexName).toBe("Lt'");
        expect(flex.isInverse).toBeTruthy();
        expect(flex.shouldApply).toBeTruthy();
        expect(flex.shouldGenerate).toBeFalsy();
      }

      {
        const flex = makeFlexName("Ltb'*");
        expect(flex.fullName).toBe("Ltb'*");
        expect(flex.baseName).toBe("Ltb");
        expect(flex.flexName).toBe("Ltb'");
        expect(flex.isInverse).toBeTruthy();
        expect(flex.shouldApply).toBeTruthy();
        expect(flex.shouldGenerate).toBeTruthy();
      }

      {
        const flex = makeFlexName("P+");
        expect(flex.fullName).toBe("P+");
        expect(flex.baseName).toBe("P");
        expect(flex.flexName).toBe("P");
        expect(flex.isInverse).toBeFalsy();
        expect(flex.shouldApply).toBeFalsy();
        expect(flex.shouldGenerate).toBeTruthy();
      }
    });
  });

  describe('getUniqueFlexes', () => {
    it('should return just the unique names', () => {
      const result = getUniqueFlexes("S S' S* > S+ S'* < Lt ^ P*", true);
      expect(result.length).toBe(4);
      expect(result[0]).toBe("S");
      expect(result[1]).toBe("S'");
      expect(result[2]).toBe("Lt");
      expect(result[3]).toBe("P");
    });
  });
}
