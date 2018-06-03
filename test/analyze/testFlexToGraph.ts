namespace Flexagonator {

  describe('getStateToState', () => {
    it('should distill state transitions', () => {
      const relFlexes1: RelativeFlexes = [];
      relFlexes1.push(new RelativeFlex(0, false, 'S', 1));
      relFlexes1.push(new RelativeFlex(2, false, 'T', 2));
      relFlexes1.push(new RelativeFlex(0, true, "^T'", 2));
      const relFlexes2: RelativeFlexes = [];
      relFlexes2.push(new RelativeFlex(3, true, 'S', 0));
      const relFlexes3: RelativeFlexes = [];
      relFlexes3.push(new RelativeFlex(3, true, 'T', 0));

      // should get [0->1, 0->2], [1->0], [2->0]
      const result = getStateToState([relFlexes1, relFlexes2, relFlexes3], false/*oneway*/);
      expect(result.length).toBe(3);
      expect(result[0].length).toBe(2);
      expect(result[1].length).toBe(1);
      expect(result[2].length).toBe(1);
      expect(result[0][0]).toBe(1);
      expect(result[0][1]).toBe(2);
      expect(result[1][0]).toBe(0);
      expect(result[2][0]).toBe(0);
    });
  });

  describe('getStateToState', () => {
    it('should remove duplicates when asked to output oneway', () => {
      const relFlexes1: RelativeFlexes = [];
      relFlexes1.push(new RelativeFlex(0, false, 'S', 1));
      relFlexes1.push(new RelativeFlex(2, false, 'T', 2));
      relFlexes1.push(new RelativeFlex(0, true, "^T'", 2));
      const relFlexes2: RelativeFlexes = [];
      relFlexes2.push(new RelativeFlex(3, true, 'S', 0));
      const relFlexes3: RelativeFlexes = [];
      relFlexes3.push(new RelativeFlex(3, true, 'T', 0));

      // should get [0->1, 0->2], [1->0], [2->0]
      const result = getStateToState([relFlexes1, relFlexes2, relFlexes3], true/*oneway*/);
      expect(result.length).toBe(3);
      expect(result[0].length).toBe(2);
      expect(result[1].length).toBe(0);
      expect(result[2].length).toBe(0);
      expect(result[0][0]).toBe(1);
      expect(result[0][1]).toBe(2);
    });
  });

  describe('getSimpleFlexGraph', () => {
    it('should list flexes that take you to various states', () => {
      const relFlexes1: RelativeFlexes = [];
      relFlexes1.push(new RelativeFlex(0, false, 'S', 1));
      relFlexes1.push(new RelativeFlex(2, false, 'T', 2));
      relFlexes1.push(new RelativeFlex(-1, true, "T'", 2));
      const relFlexes2: RelativeFlexes = [];
      relFlexes2.push(new RelativeFlex(3, true, 'S', 0));
      const relFlexes3: RelativeFlexes = [];
      relFlexes3.push(new RelativeFlex(3, true, 'T', 0));

      // should get [S->1, T->2, T'->2], [S->0], [T->0]
      const result = getSimpleFlexGraph([relFlexes1, relFlexes2, relFlexes3], false/*oneway*/);
      expect(result.length).toBe(3);
      expect(result[0].length).toBe(3);
      expect(result[1].length).toBe(1);
      expect(result[2].length).toBe(1);
      expect(result[0][0].flex).toBe('S');
      expect(result[0][0].state).toBe(1);
      expect(result[0][1].flex).toBe('T');
      expect(result[0][1].state).toBe(2);
      expect(result[0][2].flex).toBe("T'");
      expect(result[0][2].state).toBe(2);
      expect(result[1][0].flex).toBe('S');
      expect(result[1][0].state).toBe(0);
      expect(result[2][0].flex).toBe('T');
      expect(result[2][0].state).toBe(0);
    });
  });

  describe('getSimpleFlexGraph', () => {
    it('should dedupe flexes when oneway is true', () => {
      const relFlexes1: RelativeFlexes = [];
      relFlexes1.push(new RelativeFlex(0, false, 'S', 1));
      relFlexes1.push(new RelativeFlex(2, false, 'T', 2));
      relFlexes1.push(new RelativeFlex(-1, true, "T'", 2));
      const relFlexes2: RelativeFlexes = [];
      relFlexes2.push(new RelativeFlex(3, true, 'S', 0));
      const relFlexes3: RelativeFlexes = [];
      relFlexes3.push(new RelativeFlex(3, true, 'T', 0));

      // should get [S->1, T->2, T'->2], [S->0], [T->0]
      const result = getSimpleFlexGraph([relFlexes1, relFlexes2, relFlexes3], true/*oneway*/);
      expect(result.length).toBe(3);
      expect(result[0].length).toBe(3);
      expect(result[1].length).toBe(0);
      expect(result[2].length).toBe(0);
      expect(result[0][0].flex).toBe('S');
      expect(result[0][0].state).toBe(1);
      expect(result[0][1].flex).toBe('T');
      expect(result[0][1].state).toBe(2);
      expect(result[0][2].flex).toBe("T'");
      expect(result[0][2].state).toBe(2);
    });
  });

}
