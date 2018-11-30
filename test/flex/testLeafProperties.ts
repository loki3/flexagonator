namespace Flexagonator {

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
      props.adjustForSplit({ topId: 1, bottomId: -2 });

      expect(props.getColorProp(1)).toBe(123);
      expect(props.getColorProp(-1)).toBe(undefined);
      expect(props.getColorProp(2)).toBe(undefined);
      expect(props.getColorProp(-2)).toBe(456);
    });
  });
}
