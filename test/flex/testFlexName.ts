namespace Flexagonator {

  describe('makeFlexName', () => {
    it('should interpret flex names correctly', () => {
      {
        const flex = makeFlexName("Sh");
        expect(flex.fullName).toBe("Sh");
        expect(flex.baseName).toBe("Sh");
        expect(flex.flexName).toBe("Sh");
        expect(flex.isInverse).toBeFalsy();
        expect(flex.shouldApply).toBeTruthy();
        expect(flex.shouldGenerate).toBeFalsy();
      }

      {
        const flex = makeFlexName("Ltf'");
        expect(flex.fullName).toBe("Ltf'");
        expect(flex.baseName).toBe("Ltf");
        expect(flex.flexName).toBe("Ltf'");
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
      const result = getUniqueFlexes("Sh Sh' Sh* > Sh+ Sh'* < Ltf ^ P*", true);
      expect(result.length).toBe(4);
      expect(result[0]).toBe("Sh");
      expect(result[1]).toBe("Sh'");
      expect(result[2]).toBe("Ltf");
      expect(result[3]).toBe("P");
    });
    it('should not require spaces', () => {
      const result = getUniqueFlexes("Sh'+>Ltf", true);
      expect(result.length).toBe(2);
      expect(result[0]).toBe("Sh'");
      expect(result[1]).toBe("Ltf");
    });
  });
}
