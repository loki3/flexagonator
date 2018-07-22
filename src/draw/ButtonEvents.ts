namespace Flexagonator {

  // turn a mouse event into a script if the mouse was over a button
  export function getScriptItem(event: MouseEvent, canvas: string | HTMLCanvasElement, buttons: ScriptButtons): ScriptItem | null {
    const output: HTMLCanvasElement = canvas instanceof HTMLCanvasElement ? canvas : document.getElementById(canvas) as HTMLCanvasElement;
    const rect = output.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return buttons.findButton(x, y);
  }

}
