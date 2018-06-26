# Drawing APIs

There are functions you can use to draw folded or unfolded flexagons.
They both work with flexagons with any number of pats and leaves that consist of any type of triangle.

The routines for drawing a folded flexagon can also figure out which flexes can
be performed at each corner, with an option for hooking up UI to buttons describing the flexes.

The routines for drawing unfolded flexagons take the internal of structure of
the flexagon as described in [pat notation](pat-notation.md) and figure out how to turn it into an unfolded strip.


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
Or you can explicitly pass the same information to `drawEntireFlexagonObjects` using `DrawFlexagonObjects`
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
    var result = Flexagonator.runScriptItem(fm, script);
    if (!Flexagonator.isError(result)) {
      fm = result;
      updateUI();
    }
  }
}

```


## Drawing an unfolded flexagon

There are two different functions you can use to draw an unfolded flexagon strip.
Both take an object that describes various options for how the strip should be drawn.
They differ in how you pass information about the flexagon itself,
which could come either from an instance of `FlexagonManager` or bundled up in `DrawStripObjects`.

```javascript
// canvasId: a string for the id of the canvas to draw in
// fm:       an instance of FlexagonManager
// objects:  an instance of DrawStripObjects
// options:  an instance of DrawStripOptions
function drawUnfolded(canvasId, fm, options) {}
function drawUnfoldedObjects(canvasId, objects, options) {}
```

The following shows the options that can be used when drawing an unfolded flexagon.
By default, it draws the entire strip scaled and rotated to fill the canvas as much as possible.

```javascript
enum StripContent {
  FoldingLabels,  // put everything on one-side, use labels that indicate folding order
  FoldingAndIds,  // FoldingLabels plus ids
  Front,          // only display what's on the front side, use leaf properties
  Back,           // only display what's on the back side, use leaf properties
}

// DrawStripOptions
{
  content,  // [optional] StripContent: describes what to display in each leaf, defaults to FoldingLabels
  start;    // [optional] number: index of the first leaf to draw
  end;      // [optional] number: index of the last leaf to draw
  scale;    // [optional] number: scale factor (approximately the number of pixels on a leaf edge)
  rotation; // [optional] number: rotation (degrees) to apply when drawing
}

// example passing DrawStripOptions to drawUnfolded
drawUnfolded('mycanvas', fm, { content: Flexagonator.StripContent.Front, rotation: 60 });
```

Use `drawUnfolded` to draw the strip using the properties in `FlexagonManager` as shown above.
Or you can explicitly pass the same information to `drawUnfoldedObjects` using `DrawStripObjects`
as shown below.

```javascript
// DrawStripObjects
{
  flexagon,   // Flexagon
  angleInfo,  // FlexagonAngles
  leafProps,  // PropertiesForLeaves
}

// example passing DrawStripObjects to drawUnfoldedObjects
const objects = {
  flexagon: fm.flexagon,
  angleInfo: fm.getAngleInfo(),
  leafProps: fm.leafProps,
};
drawUnfoldedObjects('mycanvas', objects, {});
```
