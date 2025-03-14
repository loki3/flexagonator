namespace Flexagonator {

  describe('makeFlexName', () => {
    it('should interpret flex names correctly', () => {
      {
        const flex = makeFlexName("S");
        expect(flex.fullName).toBe("S");
        expect(flex.baseName).toBe("S");
        expect(flex.flexName).toBe("S");
        expect(flex.isInverse).toBeFalse();
        expect(flex.shouldApply).toBeTrue();
        expect(flex.shouldGenerate).toBeFalse();
      }

      {
        const flex = makeFlexName("Ltf'");
        expect(flex.fullName).toBe("Ltf'");
        expect(flex.baseName).toBe("Ltf");
        expect(flex.flexName).toBe("Ltf'");
        expect(flex.isInverse).toBeTrue();
        expect(flex.shouldApply).toBeTrue();
        expect(flex.shouldGenerate).toBeFalse();
      }

      {
        const flex = makeFlexName("Ltb'*");
        expect(flex.fullName).toBe("Ltb'*");
        expect(flex.baseName).toBe("Ltb");
        expect(flex.flexName).toBe("Ltb'");
        expect(flex.isInverse).toBeTrue();
        expect(flex.shouldApply).toBeTrue();
        expect(flex.shouldGenerate).toBeTrue();
      }

      {
        const flex = makeFlexName("P+");
        expect(flex.fullName).toBe("P+");
        expect(flex.baseName).toBe("P");
        expect(flex.flexName).toBe("P");
        expect(flex.isInverse).toBeFalse();
        expect(flex.shouldApply).toBeFalse();
        expect(flex.shouldGenerate).toBeTrue();
      }
    });

    it('deals with alternate symbols', () => {
      const flex = makeFlexName("S’");
      expect(flex.fullName).toBe("S'");
      expect(flex.baseName).toBe("S");
      expect(flex.flexName).toBe("S'");
      expect(flex.isInverse).toBeTrue();
      expect(flex.shouldApply).toBeTrue();
      expect(flex.shouldGenerate).toBeFalse();
    });
  });

  describe('getUniqueFlexes', () => {
    it('should return just the unique names', () => {
      const result = getUniqueFlexes("S S' S* > S+ S'* < Ltf ^ P*", true);
      expect(result.length).toBe(4);
      expect(result[0]).toBe("S");
      expect(result[1]).toBe("S'");
      expect(result[2]).toBe("Ltf");
      expect(result[3]).toBe("P");
    });
    it('should not require spaces', () => {
      const result = getUniqueFlexes("S'+>Ltf", true);
      expect(result.length).toBe(2);
      expect(result[0]).toBe("S'");
      expect(result[1]).toBe("Ltf");
    });
  });

  describe('FlexName', () => {
    it('getInverse creates the inverse flex', () => {
      expect(makeFlexName("T").getInverse().fullName).toBe("T'");
      expect(makeFlexName("T'").getInverse().fullName).toBe("T");
    });

    it('getGenerator adds * when needed', () => {
      expect(makeFlexName("T").getGenerator().fullName).toBe("T*");
      expect(makeFlexName("T*").getGenerator().fullName).toBe("T*");
      expect(makeFlexName("T+").getGenerator().fullName).toBe("T+");
      expect(makeFlexName(">").getGenerator().fullName).toBe(">");
    });
  });
}
