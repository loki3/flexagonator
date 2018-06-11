namespace Flexagonator {

  describe('RelativeFlex.toString', () => {
    it('should properly convert to a string', () => {
      const relFlex1 = new RelativeFlex(0, false, 'Sh', 3);
      expect(relFlex1.toString()).toBe('3(Sh)');

      const relFlex2 = new RelativeFlex(2, false, 'Sh', 3);
      expect(relFlex2.toString()).toBe('3(>>Sh)');

      const relFlex3 = new RelativeFlex(0, true, 'Sh', 3);
      expect(relFlex3.toString()).toBe('3(^Sh)');

      const relFlex4 = new RelativeFlex(4, true, 'Sh', 3);
      expect(relFlex4.toString()).toBe('3(^>>>>Sh)');
    });
  });

}
