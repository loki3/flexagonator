namespace Flexagonator {

  describe('convertLeafProps', () => {
    it('handles just numbers', () => {
      const result = convertLeafProps([[1, 2], [3, 4], [5, 6]]);
      expect(result).toEqual([{ front: { label: "1" }, back: { label: "2" } }, { front: { label: "3" }, back: { label: "4" } }, { front: { label: "5" }, back: { label: "6" } }]);
    });

    it('handles just strings', () => {
      const result = convertLeafProps([['1', '2'], ['3', '4'], ['5', '6']]);
      expect(result).toEqual([{ front: { label: "1" }, back: { label: "2" } }, { front: { label: "3" }, back: { label: "4" } }, { front: { label: "5" }, back: { label: "6" } }]);
    });

    it('handles repeats', () => {
      const result = convertLeafProps([[1, 2], [3, 4]], 2);
      expect(result).toEqual([{ front: { label: "1" }, back: { label: "2" } }, { front: { label: "3" }, back: { label: "4" } }, { front: { label: "1" }, back: { label: "2" } }, { front: { label: "3" }, back: { label: "4" } }]);
    });

    it('alternates sides when repeating an odd number of pats', () => {
      const result = convertLeafProps([[1, 2]], 3); // 1/2, 2/1, 1/2
      expect(result).toEqual([{ front: { label: "1" }, back: { label: "2" } }, { front: { label: "2" }, back: { label: "1" } }, { front: { label: "1" }, back: { label: "2" } }]);
    });

    it('looks up colors', () => {
      const result = convertLeafProps([[1, 2], [2, 1]], undefined, [12, 34]);
      expect(result).toEqual([{ front: { label: "1", color: 12 }, back: { label: "2", color: 34 } }, { front: { label: "2", color: 34 }, back: { label: "1", color: 12 } }]);
    });
  });

  describe('getColorProp1', () => {
    it('should fetch existing prop', () => {
      const prop = {
        front: { color: 3 },
        back: { color: 4 }
      }
      const props = new PropertiesForLeaves([prop]);
      expect(props.getColorProp(1)).toBe(3);
      expect(props.getColorProp(-1)).toBe(4);
    });
  });
  describe('getColorProp2', () => {
    it('should deal with undefined prop', () => {
      const prop = {
        front: { color: 3 },
        back: { color: 4 }
      }
      const props = new PropertiesForLeaves([prop]);
      expect(props.getColorProp(2)).toBe(undefined);
      expect(props.getColorProp(-2)).toBe(undefined);
    });
  });

  describe('setColorProp1', () => {
    it('should change existing prop', () => {
      const prop = {
        front: { color: 3 },
        back: { color: 4 }
      }
      const props = new PropertiesForLeaves([prop]);
      props.setColorProp(1, 6);
      props.setColorProp(-1, 7);
      expect(props.getColorProp(1)).toBe(6);
      expect(props.getColorProp(-1)).toBe(7);
    });
  });
  describe('setColorProp2', () => {
    it('should create new prop', () => {
      const prop = {
        front: { color: 3 },
        back: { color: 4 }
      }
      const props = new PropertiesForLeaves([prop]);
      props.setColorProp(2, 6);
      props.setColorProp(-2, 7);
      expect(props.getColorProp(2)).toBe(6);
      expect(props.getColorProp(-2)).toBe(7);
    });
  });

  describe('setUnsetLabel', () => {
    it('should only set label if not already set', () => {
      const prop = {
        front: { label: "3" },
        back: {}
      }
      const props = new PropertiesForLeaves([prop]);
      props.setUnsetLabelProp(1, "4");
      expect(props.getFaceLabel(1)).toBe("3");
      props.setUnsetLabelProp(-1, "4");
      expect(props.getFaceLabel(-1)).toBe("4");
    });
  });

  describe('getColorAsRGBString', () => {
    it('should convert color to "rgb(r,g,b)"', () => {
      const prop = {
        front: { color: 0x010203 },
        back: { color: 0 }
      }
      const props = new PropertiesForLeaves([prop]);
      expect(props.getColorAsRGBString(1)).toBe("rgb(1,2,3)");
    });
  });

  describe('adjustForSplit', () => {
    it('should move leaf properties from -top to bottom', () => {
      const propArray: LeafProperties[] = [
        { front: { color: 123 }, back: { color: 456 } },
        { front: {}, back: {} }
      ];
      const props = new PropertiesForLeaves(propArray);
      props.adjustForSplit(1, -2);

      expect(props.getColorProp(1)).toBe(123);
      expect(props.getColorProp(-1)).toBe(undefined);
      expect(props.getColorProp(2)).toBe(undefined);
      expect(props.getColorProp(-2)).toBe(456);
    });
  });
}
