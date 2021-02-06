namespace Flexagonator {

  describe('labelAsTree', () => {
    it('should number when all pats are a single leaf', () => {
      const flexagon = Flexagon.makeFromTree([1, 2, 3]) as Flexagon;
      const props = labelAsTree(flexagon);

      // 1's on the front & 2's on the back
      expect(props.getFaceLabel(1)).toBe("1");
      expect(props.getFaceLabel(-1)).toBe("2");
      expect(props.getFaceLabel(2)).toBe("1");
      expect(props.getFaceLabel(-2)).toBe("2");
      expect(props.getFaceLabel(3)).toBe("1");
      expect(props.getFaceLabel(-3)).toBe("2");
    });

    it('should color when all pats are a single leaf', () => {
      const flexagon = Flexagon.makeFromTree([1, 2, 3]) as Flexagon;
      const props = labelAsTree(flexagon, [1, 2]);

      // 1's on the front & 2's on the back
      expect(props.getColorProp(1)).toBe(1);
      expect(props.getColorProp(-1)).toBe(2);
      expect(props.getColorProp(2)).toBe(1);
      expect(props.getColorProp(-2)).toBe(2);
      expect(props.getColorProp(3)).toBe(1);
      expect(props.getColorProp(-3)).toBe(2);
    });

    it('should alternate internal numbering for an even number of pats', () => {
      const flexagon = Flexagon.makeFromTree([[-2, 1], [4, -3], [-6, 5], [8, -7]]) as Flexagon;
      const props = labelAsTree(flexagon);

      // 1's on the front & 2's on the back
      expect(props.getFaceLabel(-2)).toBe("1");
      expect(props.getFaceLabel(-1)).toBe("2");
      expect(props.getFaceLabel(4)).toBe("1");
      expect(props.getFaceLabel(3)).toBe("2");
      expect(props.getFaceLabel(-6)).toBe("1");
      expect(props.getFaceLabel(-5)).toBe("2");
      expect(props.getFaceLabel(8)).toBe("1");
      expect(props.getFaceLabel(7)).toBe("2");
      // 3's on the insides of the odd pats
      expect(props.getFaceLabel(2)).toBe("3");
      expect(props.getFaceLabel(1)).toBe("3");
      expect(props.getFaceLabel(6)).toBe("3");
      expect(props.getFaceLabel(5)).toBe("3");
      // 4's on the insides of the even pats
      expect(props.getFaceLabel(-4)).toBe("4");
      expect(props.getFaceLabel(-3)).toBe("4");
      expect(props.getFaceLabel(-8)).toBe("4");
      expect(props.getFaceLabel(-7)).toBe("4");
    });

    it('should work two levels deep', () => {
      const flexagon = Flexagon.makeFromTree([1, [[4, -5], [2, -3]]]) as Flexagon;
      const props = labelAsTree(flexagon);

      // 1's on the front & 2's on the back
      expect(props.getFaceLabel(1)).toBe("1");
      expect(props.getFaceLabel(-1)).toBe("2");
      expect(props.getFaceLabel(4)).toBe("1");
      expect(props.getFaceLabel(3)).toBe("2");
      // unfold once
      expect(props.getFaceLabel(2)).toBe("3");
      expect(props.getFaceLabel(5)).toBe("3");
      // unfold twice
      expect(props.getFaceLabel(-2)).toBe("4");
      expect(props.getFaceLabel(-3)).toBe("4");
      expect(props.getFaceLabel(-4)).toBe("5");
      expect(props.getFaceLabel(-5)).toBe("5");
    });

    it('should work with a deeply nested pat', () => {
      const flexagon = Flexagon.makeFromTree([[[5, -6], [[3, [1, -2]], -4]], -7]) as Flexagon;
      const props = labelAsTree(flexagon);

      // 1's on the front & 2's on the back
      expect(props.getFaceLabel(5)).toBe("1");
      expect(props.getFaceLabel(4)).toBe("2");
      expect(props.getFaceLabel(-7)).toBe("1");
      expect(props.getFaceLabel(7)).toBe("2");
      // unfold once
      expect(props.getFaceLabel(6)).toBe("3");
      expect(props.getFaceLabel(3)).toBe("3");
      // unfold twice
      expect(props.getFaceLabel(2)).toBe("4");
      expect(props.getFaceLabel(-4)).toBe("4");
      expect(props.getFaceLabel(-5)).toBe("5");
      expect(props.getFaceLabel(-6)).toBe("5");
      // unfold thrice
      expect(props.getFaceLabel(-3)).toBe("6");
      expect(props.getFaceLabel(1)).toBe("6");
      // unfold 4x
      expect(props.getFaceLabel(-1)).toBe("7");
      expect(props.getFaceLabel(-2)).toBe("7");
    });

    it('should label all pats the same when there is an odd number of pats', () => {
      const flexagon = Flexagon.makeFromTree([[-2, 1], [4, -3], [-6, 5]]) as Flexagon;
      const props = labelAsTree(flexagon);

      // 1's on the front & 2's on the back
      expect(props.getFaceLabel(-2)).toBe("1");
      expect(props.getFaceLabel(-1)).toBe("2");
      expect(props.getFaceLabel(4)).toBe("1");
      expect(props.getFaceLabel(3)).toBe("2");
      expect(props.getFaceLabel(-6)).toBe("1");
      expect(props.getFaceLabel(-5)).toBe("2");
      // 3's & 4's folded together on the insides of all pats
      expect(props.getFaceLabel(2)).toBe("4");
      expect(props.getFaceLabel(1)).toBe("3");
      expect(props.getFaceLabel(6)).toBe("4");
      expect(props.getFaceLabel(5)).toBe("3");
      expect(props.getFaceLabel(-4)).toBe("4");
      expect(props.getFaceLabel(-3)).toBe("3");
    });
  });

}
