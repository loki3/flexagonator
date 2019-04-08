namespace Flexagonator {

  describe('findSubgraphs', () => {
    // for a single flexagon state, creates a list of flexes & destination states
    type FlexAndTo = [string, number];
    function makeRelFlexes(a: FlexAndTo[]): RelativeFlexes {
      return a.map(b => new RelativeFlex(0, false, b[0], b[1]));
    }

    it('should find 2 simple subgraphs', () => {
      const all: RelativeFlexes[] = [];
      all.push(makeRelFlexes([['A', 1], ['B', 2]]));  // 0 -> 2 -> 1 -> 0
      all.push(makeRelFlexes([['A', 2], ['B', 0]]));
      all.push(makeRelFlexes([['A', 3], ['B', 1]]));
      all.push(makeRelFlexes([['A', 4], ['B', 4]]));  // 3 <-> 4
      all.push(makeRelFlexes([['A', 0], ['B', 3]]));

      const result = findSubgraphs(all, 'B');
      expect(result.uniqueSubgraphs).toBe(2);
      expect(result.sizesAndSubgraphCounts.length).toBe(2);
      expect(result.sizesAndSubgraphCounts[0].size).toBe(2);
      expect(result.sizesAndSubgraphCounts[0].subgraphCount).toBe(1);
      expect(result.sizesAndSubgraphCounts[1].size).toBe(3);
      expect(result.sizesAndSubgraphCounts[1].subgraphCount).toBe(1);
    });

    it('should consolidate multiple subgraphs', () => {
      const all: RelativeFlexes[] = [];
      all.push(makeRelFlexes([['A', 1], ['B', 1]]));  // 0 <-> 1
      all.push(makeRelFlexes([['A', 2], ['B', 0]]));
      all.push(makeRelFlexes([['A', 3], ['B', 3]]));  // 2 <-> 3
      all.push(makeRelFlexes([['A', 4], ['B', 2]]));
      all.push(makeRelFlexes([['B', 0], ['B', 3]]));  // -> 0, -> 3

      const result = findSubgraphs(all, 'B');
      expect(result.uniqueSubgraphs).toBe(1);
      expect(result.sizesAndSubgraphCounts.length).toBe(1);
      expect(result.sizesAndSubgraphCounts[0].size).toBe(5);
      expect(result.sizesAndSubgraphCounts[0].subgraphCount).toBe(1);
    });

    it('should ignore states that do not support the flex', () => {
      const all: RelativeFlexes[] = [];
      all.push(makeRelFlexes([['A', 1], ['B', 1]]));
      all.push(makeRelFlexes([['A', 2], ['B', 0]]));
      all.push(makeRelFlexes([['A', 3]]));  // doesn't support B
      all.push(makeRelFlexes([['A', 4], ['B', 4]]));
      all.push(makeRelFlexes([['A', 0], ['B', 3]]));

      const result = findSubgraphs(all, 'B');
      expect(result.uniqueSubgraphs).toBe(2);
      expect(result.sizesAndSubgraphCounts.length).toBe(1);
      expect(result.sizesAndSubgraphCounts[0].size).toBe(2);
      expect(result.sizesAndSubgraphCounts[0].subgraphCount).toBe(2);
    });
  });

}
