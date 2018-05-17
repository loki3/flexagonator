namespace Flexagonator {

  export interface Box {
    readonly x: number;
    readonly y: number;
    readonly w: number;
    readonly h: number;
  }

  // tracks regions that will trigger a script command when asked
  export class ScriptButtons {
    private buttons: Button[] = [];

    addFlexButton(box: Box, flexes: string) {
      this.buttons.push({ box: box, script: { flexes: flexes } });
    }

    findButton(x: number, y: number): ScriptItem | null {
      for (var button of this.buttons) {
        const box = button.box;
        if (box.x <= x && x <= box.x + box.w && box.y <= y && y <= box.y + box.h) {
          return button.script;
        }
      }
      return null;
    }
  }

  interface Button {
    readonly box: Box;
    readonly script: ScriptItem;
  }

}
