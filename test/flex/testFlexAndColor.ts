namespace Flexagonator {

  describe('flexAndColor', () => {
    it('should color & number newly created faces', () => {
      const empty = Flexagon.makeFromTree([1, 2, 3, 4, 5, 6]) as Flexagon;
      const fm = FlexagonManager.make(empty);
      const result = flexAndColor(fm, "P*P+PP*", [10, 20, 30, 40]);
      expect(result).toBe(true);

      // validate that every face is set
      const rawprops = fm.leafProps.getRawProps();
      expect(rawprops.length).toBe(15);
      for (const props of rawprops) {
        expect(props.front.label).toBeDefined();
        expect(props.back.label).toBeDefined();
      }

      // validate a couple faces
      expect(rawprops[0].front.label).toBe('4');
      expect(rawprops[0].front.color).toBe(40);
      expect(rawprops[0].back.label).toBe('5');
      expect(rawprops[0].back.color).toBeUndefined();
      expect(rawprops[7].front.label).toBe('3');
      expect(rawprops[7].front.color).toBe(30);
      expect(rawprops[7].back.label).toBe('2');
      expect(rawprops[7].back.color).toBe(20);
    });
  });

}
