namespace Flexagonator {

  describe('RelativeFlex.toString', () => {
    it('should properly convert to a string', () => {
      const relFlex1 = new RelativeFlex(0, false, 'St', 3);
      expect(relFlex1.toString()).toBe('3(St)');

      const relFlex2 = new RelativeFlex(2, false, 'St', 3);
      expect(relFlex2.toString()).toBe('3(>>St)');

      const relFlex3 = new RelativeFlex(0, true, 'St', 3);
      expect(relFlex3.toString()).toBe('3(^St)');

      const relFlex4 = new RelativeFlex(4, true, 'St', 3);
      expect(relFlex4.toString()).toBe('3(^>>>>St)');
    });
  });

}
