namespace Flexagonator {

  // turn a mouse event into a script if the mouse was over a button
  export function getScriptItem(event: MouseEvent, canvasId: string, buttons: ScriptButtons): ScriptItem | null {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return buttons.findButton(x, y);
  }

}
