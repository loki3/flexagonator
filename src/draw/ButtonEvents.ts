namespace Flexagonator {

  // turn a mouse event into a script if the mouse was over a button
  export function getScriptItem(event: MouseEvent, canvasId: string, buttons: ScriptButtons): ScriptItem | null {
    var canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    return buttons.findButton(x, y);
  }

}
