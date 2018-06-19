namespace Flexagonator {

  export interface Box {
    readonly x: number;
    readonly y: number;
    readonly w: number;
    readonly h: number;
  }

  interface Button {
    readonly box: Box;
    readonly script: ScriptItem;
  }

  export class ButtonsBuilder {
    private buttons: Button[] = [];

    addFlexButton(box: Box, flexes: string) {
      this.buttons.push({ box: box, script: { flexes: flexes } });
    }

    create(): ScriptButtons {
      const buttons = this.buttons;
      this.buttons = [];
      return new ScriptButtons(buttons);
    }
  }

  // tracks regions that will trigger a script command when asked
  export class ScriptButtons {
    constructor(private readonly buttons: Button[]) {
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

}
