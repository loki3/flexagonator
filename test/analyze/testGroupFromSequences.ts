namespace Flexagonator {

  describe('getGroupFromSequences', () => {
    it('reports cycle sizes', () => {
      const result1 = getGroupFromSequences(['^'], 4) as GroupFromFlexes;
      expect(result1.cycleLengths[0]).toBe(2);
      const result2 = getGroupFromSequences(['>>'], 6) as GroupFromFlexes;
      expect(result2.cycleLengths[0]).toBe(3);
      const result3 = getGroupFromSequences(['(F<)2'], 8) as GroupFromFlexes;
      expect(result3.cycleLengths[0]).toBe(3);
    });

    it('creates table for the simplest cycle', () => {
      const result = getGroupFromSequences(['^'], 4) as GroupFromFlexes;
      expect(result.cycleLengths[0]).toBe(2);
      expect(result.groupElements.join(' ')).toBe('e a');
      expect(result.flexElements.join(' ')).toBe('I ^');
      expect(result.rows[0].join(' ')).toBe('0 1');
      expect(result.rows[1].join(' ')).toBe('1 0');
    });

    it('creates table for multiple sequences', () => {
      const result = getGroupFromSequences(['P>', '^>'], 4) as GroupFromFlexes;
      expect(result.cycleLengths[0]).toBe(3);
      expect(result.cycleLengths[1]).toBe(2);
      expect(result.groupElements.join(' ')).toBe('e a a2 b ba ba2');
      expect(result.flexElements.join(' ')).toBe('I P> P>P> ^> ^>P> ^>P>P>');
      expect(result.rows[0].join(' ')).toBe('0 1 2 3 4 5');
      expect(result.rows[1].join(' ')).toBe('1 2 0 5 3 4');
      expect(result.rows[2].join(' ')).toBe('2 0 1 4 5 3');
      expect(result.rows[3].join(' ')).toBe('3 4 5 0 1 2');
      expect(result.rows[4].join(' ')).toBe('4 5 3 2 0 1');
      expect(result.rows[5].join(' ')).toBe('5 3 4 1 2 0');
    });

    it('creates table for fancier sequences', () => {
      // need to be more careful about generating the minimal flexagon for this group
      const result = getGroupFromSequences(['<<(S^<)2', '(>>SS)2^<'], 6) as GroupFromFlexes;
      expect(result.cycleLengths[0]).toBe(3);
      expect(result.cycleLengths[1]).toBe(2);
      expect(result.groupElements.join(' ')).toBe('e a a2 b ba ba2');
      expect(result.rows[0].join(' ')).toBe('0 1 2 3 4 5');
      expect(result.rows[1].join(' ')).toBe('1 2 0 5 3 4');
      expect(result.rows[2].join(' ')).toBe('2 0 1 4 5 3');
      expect(result.rows[3].join(' ')).toBe('3 4 5 0 1 2');
      expect(result.rows[4].join(' ')).toBe('4 5 3 2 0 1');
      expect(result.rows[5].join(' ')).toBe('5 3 4 1 2 0');
    });

    it('handles non-isoflexagons', () => {
      const result = getGroupFromSequences(['Bf<<~'], 12, Directions.make('/||//||//||/')) as GroupFromFlexes;
      expect(result.cycleLengths[0]).toBe(8);

      const result2 = getGroupFromSequences(['<Tao>Tf', '^Fet(>)5'], 10, Directions.make("//|////|//")) as GroupFromFlexes;
      expect(result2.cycleLengths[0]).toBe(8);
      expect(result2.cycleLengths[1]).toBe(2);
      expect(result2.minimalPats).toEqual([14, 5, -15, [-16, -4], [2, -3], [-10, 1], [11, 13], 9, 8, [-6, [7, 12]]]);
    });

    it('detects if group is commutative', () => {
      const result1 = getGroupFromSequences(['P>'], 4) as GroupFromFlexes;
      expect(result1.commutative).toBe(true);
      const result2 = getGroupFromSequences(['^>P>', 'PP^'], 6) as GroupFromFlexes;
      expect(result2.commutative).toBe(true);
      const result3 = getGroupFromSequences(['F>>>', '^>>>'], 7) as GroupFromFlexes;
      expect(result3.commutative).toBe(false);
    });

    it('reports on sequences that are not a cycle', () => {
      const result = getGroupFromSequences(['P>', 'P', 'PP'], 6) as GroupError;
      expect(result.reason).toBe('not-cyclic');
      expect(result.sequences ? result.sequences[0] : '').toBe('P');
      expect(result.sequences ? result.sequences[1] : '').toBe('PP');
    });

    it('reports when generators do not support common pat structure', () => {
      const result = getGroupFromSequences(['P>', '^'], 6) as GroupError;
      expect(result.reason).toBe('changes-structure');
    });

    it('reports when sequences are redundant', () => {
      const result = getGroupFromSequences(['P>', 'P>P>'], 6) as GroupError;
      expect(result.reason).toBe('redundant');
      expect(result.sequences ? result.sequences[0] : '').toBe('P>P>');
    });

    it('reports when generators do not cover all required states', () => {
      /*
      given a=<Tao>^, b=^Tf', c=^Fet(>)5,
      we find that a*a=e, b*b=e, c*c=e so there are 8 elements {e, a, b, ba, c, ca, cb, cba}
      and all those elements preserve the structure of the minimal flexagon
      but you can reach 16 states with them, e.g., ab isn't one of those 8 elements
      */
      const result = getGroupFromSequences(['<Tao>^', '^Tf', '^Fet(>)5'], 10, Directions.make("//|////|//")) as GroupError;
      expect(result.reason).toBe('incomplete');
      expect(result.sequences ? result.sequences[0] : '').toBe('<Tao>^ ^Tf');
    });

    it('reports unsupported flex', () => {
      const result = getGroupFromSequences(['Qqq'], 6) as GroupError;
      expect(result.reason).toBe('unsupported-flex');
    });


    /*
    function dumpCayleyTable(check: GroupFromFlexes | GroupError) {
      if ((check as GroupError).reason !== undefined) {
        console.log('NOT A GROUP', JSON.stringify(check));
        return;
      }
      const group = check as GroupFromFlexes;
      console.log('');
      console.log('minimal pats:', JSON.stringify(group.minimalPats));
      console.log(group.groupElements.length, 'elements in group, commutative:', group.commutative ? 'yes' : 'no');
      console.log(group.sequences.join(' '), ' cyles lengths:', JSON.stringify(group.cycleLengths));
      console.log(' ', group.groupElements.join(' '));
      let i = 0;
      for (const row of group.rows) {
        console.log(group.groupElements[i++], row.join(' '));
      }
    }
    it('dumps Cayley tables', () => {
      dumpCayleyTable(getGroupFromSequences(['F<', '^<'], 7));
      dumpCayleyTable(getGroupFromSequences(['V>', '^>'], 6));
    });
    */

  });

}
