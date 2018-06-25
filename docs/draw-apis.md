# Drawing APIs

## Drawing a folded flexagon

There are two different functions you can use to draw the current state of a folded flexagon.
Both take an object that describes various options for how the flexagon should be drawn
and both return a `ScriptButtons` object that can be used to turn mouse clicks into flexes.
They differ in how you pass information about the flexagon itself,
which could come either from an instance of `FlexagonManager` or bundled up in `DrawFlexagonObjects`.

```javascript
// canvasId: a string for the id of the canvas to draw in
// fm:       an instance of FlexagonManager
// objects:  an instance of DrawFlexagonObjects
// options:  an instance of DrawFlexagonOptions
// RETURNS:  ScriptButtons if options.flexes is true
function drawEntireFlexagon(canvasId, fm, options) {}
function drawEntireFlexagonObjects(canvasId, objects, options) {}
```

Everything in `DrawFlexagonOptions` is optional.
It's used to specify additional information about how the flexagon is drawn
such as whether to draw the front or back, whether to display useful statistics, or
whether to display which flexes can be performed where.

```javascript
// DrawFlexagonOptions
{
  back: true,        // boolean: default false (front), draw front or back
  stats: true,       // boolean: default false, show stats such as the number of leaves
  flexes: true,      // boolean: default false, show possible flexes at each corner
  structure: true,   // boolean: default false, show internal structure of each pat
  drawover: true,    // boolean: default false, draw over canvas or clear first
}

// example using DrawFlexagonOptions with drawEntireFlexagon
Flexagonator.drawEntireFlexagon('mycanvas', fm, { stats: true, flexes: true, structure: true });
```

Use `drawEntireFlexagon` to draw the flexagon using the properties in `FlexagonManager` as shown above.
Or you can explicit pass the same information to `drawEntireFlexagonObjects` using `DrawFlexagonObjects`
as shown below.

```javascript
// DrawFlexagonObjects
{
  flexagon,       // Flexagon
  angleInfo,      // FlexagonAngles
  leafProps,      // PropertiesForLeaves
  allFlexes,      // Flexes
  flexesToSearch, // Flexes
}

// example using DrawFlexagonObjects with drawEntireFlexagonObjects
const objects = {
  flexagon: fm.flexagon,
  angleInfo: fm.getAngleInfo(),
  leafProps: fm.leafProps,
  allFlexes: fm.allFlexes,
  flexesToSearch: fm.flexesToSearch,
};
Flexagonator.drawEntireFlexagonObjects('mycanvas', objects, { stats: true, flexes: true, structure: true });
```

If `options.flexes` is true, the draw routine will figure out which flexes can be performed at each corner,
draw shorthand for the flexes, and return an object that can figure out how to perform a flex when it's clicked on.
The following code demonstrates how you could do this.

```javascript
// example using returned ScriptButtons
var buttons = Flexagonator.drawEntireFlexagon('mycanvas', fm, { flexes: true });
var interface = document.getElementById('interface');
interface.addEventListener('click', interfaceMouseClick, false);

function interfaceMouseClick(event) {
  var script = Flexagonator.getScriptItem(event, 'interface', buttons);
  if (script != null) {
    var result = Flexagonator.RunScriptItem(fm, script);
    if (!Flexagonator.isError(result)) {
      fm = result;
      updateUI();
    }
  }
}

```


## Drawing an unfolded flexagon

