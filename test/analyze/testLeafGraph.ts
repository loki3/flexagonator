namespace Flexagonator {

  describe('getLeafGraph', () => {
    it('creates graph of connected leaf-faces', () => {
      const flexagons = [
        // 1->2,3  2->3  -1->-2,4  -2->4
        Flexagon.makeFromTree([1, 2, [3, -4]]) as Flexagon,
        // 1->2,-4,3  2->-4  -2->4  3->4
        Flexagon.makeFromTree([1, [2, -3], -4]) as Flexagon,
      ];
      const graph = getLeafGraph(flexagons);
      expect(graph[1]).toEqual([2, 3, -4]);
      expect(graph[2]).toEqual([3, -4]);
      expect(graph[3]).toEqual([4]);
      expect(graph[4]).toBeUndefined();
      expect(graph[-1]).toEqual([-2, 4, 3]);
      expect(graph[-2]).toEqual([4]);
      expect(graph[-3]).toBeUndefined();
      expect(graph[-4]).toBeUndefined();
    });
  });
}
