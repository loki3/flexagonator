namespace Flexagonator {

  interface HistoryItem {
    readonly flexes: string[];
    readonly flexagon: Flexagon;
    readonly tracker: Tracker;
  }

  /*
    Store all the flexes that have been performed & the corresponding
    flexagon state.  Manage undoing & redoing flexes.
  */
  export class History {
    private done: HistoryItem[] = [];
    private undone: HistoryItem[] = [];

    constructor(original: Flexagon, tracker: Tracker) {
      this.done.push({ flexes: [], flexagon: original, tracker: tracker });
    }

    getCurrent(): HistoryItem {
      return this.done[this.done.length - 1];
    }

    getStart(): HistoryItem {
      return this.done[0];
    }

    add(newFlexes: string[], newflexagon: Flexagon, tracker: Tracker) {
      var allflexes = [];
      // copy old list across
      for (var flex of this.getCurrent().flexes) {
        allflexes.push(flex);
      }

      // add new flexes, consolidating redundant rotates
      var start = true;
      for (var flex of newFlexes) {
        if (start) {
          const last = allflexes.length > 0 ? allflexes[allflexes.length - 1] : "";
          if ((flex === '<' && last === '>') || (flex === '>' && last === '<')) {
            allflexes.pop();
            continue;
          }
          start = false;
        }

        allflexes.push(flex);
      }

      this.done.push({ flexes: allflexes, flexagon: newflexagon, tracker: tracker });
      this.undone = [];
    }

    canUndo(): boolean {
      return this.done.length > 1;
    }

    canRedo(): boolean {
      return this.undone.length > 0;
    }

    undoAll() {
      for (var i = this.done.length - 1; i > 0; i--) {
        this.undone.push(this.done[i]);
      }
      this.done = [this.done[0]];
    }

    undo() {
      if (this.done.length > 1) {
        this.undone.push(this.done.pop() as HistoryItem);
      }
    }

    redo() {
      if (this.undone.length > 0) {
        this.done.push(this.undone.pop() as HistoryItem);
      }
    }

    clear(original: Flexagon, tracker: Tracker) {
      this.done = [];
      this.undone = [];
      this.done.push({ flexes: [], flexagon: original, tracker: tracker });
    }
  }

}
