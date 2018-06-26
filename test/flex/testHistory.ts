namespace Flexagonator {

  describe('History.add', () => {
    it('should add new items to history', () => {
      const flexagon: Flexagon = Flexagon.makeFromTree([1, 2]) as Flexagon;
      const tracker = Tracker.make(flexagon);

      const history: History = new History(flexagon, tracker);
      expect(history.canUndo()).toBe(false);
      expect(history.getCurrent().flexes.length).toBe(0);

      history.add(["Sh"], flexagon, tracker);
      expect(history.canUndo()).toBe(true);
      expect(history.getCurrent().flexes.length).toBe(1);
      expect(history.getCurrent().flexes[0]).toBe("Sh");

      history.add(["T"], flexagon, tracker);
      expect(history.canUndo()).toBe(true);
      expect(history.getCurrent().flexes.length).toBe(2);
      expect(history.getCurrent().flexes[0]).toBe("Sh");
      expect(history.getCurrent().flexes[1]).toBe("T");
    });
  });

  describe('History.add2', () => {
    it('should add multiple items to history', () => {
      const flexagon: Flexagon = Flexagon.makeFromTree([1, 2]) as Flexagon;
      const tracker = Tracker.make(flexagon);

      const history: History = new History(flexagon, tracker);
      expect(history.canUndo()).toBe(false);
      expect(history.getCurrent().flexes.length).toBe(0);

      history.add(["Sh", "P"], flexagon, tracker);
      expect(history.canUndo()).toBe(true);
      expect(history.getCurrent().flexes.length).toBe(2);
      expect(history.getCurrent().flexes[0]).toBe("Sh");
      expect(history.getCurrent().flexes[1]).toBe("P");

      history.add(["T", "F"], flexagon, tracker);
      expect(history.canUndo()).toBe(true);
      expect(history.getCurrent().flexes.length).toBe(4);
      expect(history.getCurrent().flexes[0]).toBe("Sh");
      expect(history.getCurrent().flexes[1]).toBe("P");
      expect(history.getCurrent().flexes[2]).toBe("T");
      expect(history.getCurrent().flexes[3]).toBe("F");
    });
  });

  describe('History.add3', () => {
    it('should consolidate unneeded rotates', () => {
      const flexagon: Flexagon = Flexagon.makeFromTree([1, 2]) as Flexagon;
      const tracker = Tracker.make(flexagon);

      const history: History = new History(flexagon, tracker);
      expect(history.canUndo()).toBe(false);
      expect(history.getCurrent().flexes.length).toBe(0);

      history.add(["Sh", ">", ">", ">"], flexagon, tracker);
      history.add(["<", "<", "P", "<"], flexagon, tracker);
      expect(history.canUndo()).toBe(true);
      expect(history.getCurrent().flexes.length).toBe(4);
      expect(history.getCurrent().flexes[0]).toBe("Sh");
      expect(history.getCurrent().flexes[1]).toBe(">");
      expect(history.getCurrent().flexes[2]).toBe("P");
      expect(history.getCurrent().flexes[3]).toBe("<");
    });
  });

  describe('History.undo', () => {
    it('should undo items in the history', () => {
      const flexagon: Flexagon = Flexagon.makeFromTree([1, 2]) as Flexagon;
      const tracker = Tracker.make(flexagon);

      const history: History = new History(flexagon, tracker);
      history.add(["Sh"], flexagon, tracker);
      history.add(["T"], flexagon, tracker);
      expect(history.getCurrent().flexes.length).toBe(2);

      history.undo();
      expect(history.getCurrent().flexes.length).toBe(1);
      expect(history.getCurrent().flexes[0]).toBe("Sh");

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
      history.add(["Sh"], flexagon, tracker);
      history.add(["T"], flexagon, tracker);
      history.add(["P"], flexagon, tracker);
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
      history.add(["Sh"], flexagon, tracker);
      history.add(["T"], flexagon, tracker);
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
