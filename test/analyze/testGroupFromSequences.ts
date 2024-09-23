namespace Flexagonator {

  describe('getGroupFromSequences', () => {
    it('creates table for the simplest cycle', () => {
      const result = getGroupFromSequences(['^'], 4) as GroupFromFlexes;
      expect(result.cycleLengths[0]).toBe(2);
      expect(result.groupElements.join(' ')).toBe('e a');
      expect(result.flexElements.join(' ')).toBe('I ^');
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


    /*
    function dumpCayleyTable(check: GroupFromFlexes | GroupError) {
      if ((check as GroupError).reason !== undefined) {
        console.log('NOT A GROUP', JSON.stringify(check));
      }
      const group = check as GroupFromFlexes;
      console.log('');
      console.log(group.sequences.join(' '));
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
