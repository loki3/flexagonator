namespace Flexagonator {

  function makeFlexNames(list: string[]): FlexName[] {
    const result: FlexName[] = [];
    for (let f of list) {
      result.push(makeFlexName(f));
    }
    return result;
  }

  describe('History.add', () => {
    it('should add new items to history', () => {
      const flexagon: Flexagon = Flexagon.makeFromTree([1, 2]) as Flexagon;
      const tracker = Tracker.make(flexagon);

      const history: History = new History(flexagon, tracker);
      expect(history.canUndo()).toBe(false);
      expect(history.getCurrent().flexes.length).toBe(0);

      history.add([makeFlexName("S")], flexagon, tracker);
      expect(history.canUndo()).toBe(true);
      expect(history.getCurrent().flexes.length).toBe(1);
      expect(history.getCurrent().flexes[0].fullName).toBe("S");

      history.add([makeFlexName("T")], flexagon, tracker);
      expect(history.canUndo()).toBe(true);
      expect(history.getCurrent().flexes.length).toBe(2);
      expect(history.getCurrent().flexes[0].fullName).toBe("S");
      expect(history.getCurrent().flexes[1].fullName).toBe("T");
    });
  });

  describe('History.add2', () => {
    it('should add multiple items to history', () => {
      const flexagon: Flexagon = Flexagon.makeFromTree([1, 2]) as Flexagon;
      const tracker = Tracker.make(flexagon);

      const history: History = new History(flexagon, tracker);
      expect(history.canUndo()).toBe(false);
      expect(history.getCurrent().flexes.length).toBe(0);

      history.add(makeFlexNames(["S", "P"]), flexagon, tracker);
      expect(history.canUndo()).toBe(true);
      expect(history.getCurrent().flexes.length).toBe(2);
      expect(history.getCurrent().flexes[0].fullName).toBe("S");
      expect(history.getCurrent().flexes[1].fullName).toBe("P");

      history.add(makeFlexNames(["T", "F"]), flexagon, tracker);
      expect(history.canUndo()).toBe(true);
      expect(history.getCurrent().flexes.length).toBe(4);
      expect(history.getCurrent().flexes[0].fullName).toBe("S");
      expect(history.getCurrent().flexes[1].fullName).toBe("P");
      expect(history.getCurrent().flexes[2].fullName).toBe("T");
      expect(history.getCurrent().flexes[3].fullName).toBe("F");
    });
  });

  describe('History.add3', () => {
    it('should consolidate unneeded rotates', () => {
      const flexagon: Flexagon = Flexagon.makeFromTree([1, 2]) as Flexagon;
      const tracker = Tracker.make(flexagon);

      const history: History = new History(flexagon, tracker);
      expect(history.canUndo()).toBe(false);
      expect(history.getCurrent().flexes.length).toBe(0);

      history.add(makeFlexNames(["S", ">", ">", ">"]), flexagon, tracker);
      history.add(makeFlexNames(["<", "<", "P", "<"]), flexagon, tracker);
      expect(history.canUndo()).toBe(true);
      expect(history.getCurrent().flexes.length).toBe(4);
      expect(history.getCurrent().flexes[0].fullName).toBe("S");
      expect(history.getCurrent().flexes[1].fullName).toBe(">");
      expect(history.getCurrent().flexes[2].fullName).toBe("P");
      expect(history.getCurrent().flexes[3].fullName).toBe("<");
    });
  });

  describe('History.undo', () => {
    it('should undo items in the history', () => {
      const flexagon: Flexagon = Flexagon.makeFromTree([1, 2]) as Flexagon;
      const tracker = Tracker.make(flexagon);

      const history: History = new History(flexagon, tracker);
      history.add([makeFlexName("S")], flexagon, tracker);
      history.add([makeFlexName("T")], flexagon, tracker);
      expect(history.getCurrent().flexes.length).toBe(2);

      history.undo();
      expect(history.getCurrent().flexes.length).toBe(1);
      expect(history.getCurrent().flexes[0].fullName).toBe("S");

      history.undo();
      expect(history.getCurrent().flexes.length).toBe(0);

      history.undo();
      expect(history.getCurrent().flexes.length).toBe(0);
    });
  });

  describe('History.undoAll', () => {
    it('should undo everything back to the original state', () => {
      const flexagon: Flexagon = Flexagon.makeFromTree([1, 2]) as Flexagon;
      const tracker = Tracker.make(flexagon);

      const history: History = new History(flexagon, tracker);
      history.add([makeFlexName("S")], flexagon, tracker);
      history.add([makeFlexName("T")], flexagon, tracker);
      history.add([makeFlexName("P")], flexagon, tracker);
      expect(history.getCurrent().flexes.length).toBe(3);

      history.undoAll();
      expect(history.getCurrent().flexes.length).toBe(0);
      expect(history.canUndo()).toBe(false);
    });
  });

  describe('History.redo', () => {
    it('should redo items that had been undone', () => {
      const flexagon: Flexagon = Flexagon.makeFromTree([1, 2]) as Flexagon;
      const tracker = Tracker.make(flexagon);

      const history: History = new History(flexagon, tracker);
      history.add([makeFlexName("S")], flexagon, tracker);
      history.add([makeFlexName("T")], flexagon, tracker);
      expect(history.getCurrent().flexes.length).toBe(2);
      expect(history.canRedo()).toBe(false);
      history.undo();
      expect(history.canRedo()).toBe(true);
      history.undo();
      expect(history.getCurrent().flexes.length).toBe(0);

      expect(history.canRedo()).toBe(true);
      history.redo();
      expect(history.canRedo()).toBe(true);
      expect(history.getCurrent().flexes.length).toBe(1);
      history.redo();
      expect(history.canRedo()).toBe(false);
      expect(history.getCurrent().flexes.length).toBe(2);
    });
  });

}
