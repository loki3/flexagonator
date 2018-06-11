namespace Flexagonator {

  describe('countStatesThatSupportFlexes', () => {
    it('should count up states', () => {
      const relFlexes1: RelativeFlexes = [];
      relFlexes1.push(new RelativeFlex(0, false, 'Sh', 1));
      relFlexes1.push(new RelativeFlex(2, false, 'P', 2));
      relFlexes1.push(new RelativeFlex(0, true, 'T', 3));
      relFlexes1.push(new RelativeFlex(0, true, 'Sh', 4));
      const relFlexes2: RelativeFlexes = [];
      relFlexes2.push(new RelativeFlex(3, true, 'Sh', 5));

      const result = countStatesThatSupportFlexes([relFlexes1, relFlexes2]);
      expect(result['Sh']).toBe(2);
      expect(result['P']).toBe(1);
      expect(result['T']).toBe(1);
    });
  });

}
