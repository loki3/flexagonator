# Drawing APIs

There are functions you can use to draw folded or unfolded flexagons.
They both work with flexagons with any number of pats and leaves that consist of any type of triangle.

The routines for drawing a folded flexagon can also figure out which flexes can
be performed at each corner, with an option for hooking up UI to buttons describing the flexes.

The routines for drawing unfolded flexagons take the internal of structure of
the flexagon as described in [pat notation](pat-notation.md) and figure out how to turn it into an unfolded strip.

There's also a function for drawing the graph of states accessible by just using the pinch flex.


## Drawing a folded flexagon

There are two different functions you can use to draw the current state of a folded flexagon.
Both take an object that describes various options for how the flexagon should be drawn
and both return a `RegionForFlexes` object that describes where various flexes can be performed.
They differ in how you pass information about the flexagon itself,
which could come either from an instance of `FlexagonManager` or bundled up in `DrawFlexagonObjects`.

```javascript
// canvas:   canvas to draw in (string | HTMLCanvasElement)
// fm:       an instance of FlexagonManager
// objects:  an instance of DrawFlexagonObjects
// options:  an instance of DrawFlexagonOptions
// RETURNS:  ScriptButtons if options.flexes is true
function drawEntireFlexagon(canvas, fm, options) {}
function drawEntireFlexagonObjects(canvas, objects, options) {}
```

Everything in `DrawFlexagonOptions` is optional.
It's used to specify additional information about how the flexagon is drawn
such as whether to draw the front or back, and whether to display useful statistics.

```javascript
// DrawFlexagonOptions
{
  back: true,        // boolean: default false (front), draw front or back
  stats: true,       // boolean: default false, show stats such as the number of leaves
  structure: true,   // boolean: default false, show internal structure of each pat
  drawover: true,    // boolean: default false, draw over canvas or clear first
  showIds: true,     // boolean: default true, show leaf ids
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

If you want to have buttons that can be used to perform flexes at the different flexagon corners,
you can leverage the `RegionForFlexes[]` collection that is returned from the draw routines.
You can either use the information to draw your own buttons or call `drawScriptButtons` to both
draw the flexes and get a detailed description of where they're drawn so the buttons are functional.
The following shows how you can hook up mouse events using these "script buttons".

```javascript
// example using returned ScriptButtons
var regions = Flexagonator.drawEntireFlexagon('mycanvas', fm, {});
// drawScriptButtons takes a canvas id, flexagon, angle info, boolean for front/back, and RegionForFlexes[]
var buttons = Flexagonator.drawScriptButtons('interface', fm.flexagon, fm.getAngleInfo(), true, regions);
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

Optionally, you can get the button regions without drawing.

```javascript
var regions = getButtonRegions(fm, width, height, true/*front*/);
```

`RegionForFlexes` describes all the flexes that are valid at a single corner of the flexagon.
If you want to apply a flex, you would first need to change the current vertex by applying
what's listed in `prefix`, e.g. `>>`.
After the flex is applied, you could move back to that original flex by applying `postfix`, e.g `<<`.
Here's what it contains:

```javascript
// RegionForFlexes
{
    flexes: string[];  // flexes valid at this corner e.g. [ 'P', 'Sh' ]
    prefix: string;    // change the current vertex, e.g. '>>'
    postfix: string;   // restore the current vertex, e.g. '<<'
    corner: Point;     // where the associated corner was drawn, e.g. { x: 10, y: 50 }
    isOnLeft: boolean; // true if the point is on the left half of the flexagon
    isOnTop: boolean;  // true if the point is on the top half of the flexagon
}
```


## Drawing an unfolded flexagon

There are two different functions you can use to draw an unfolded flexagon strip.
Both take an object that describes various options for how the strip should be drawn.
They differ in how you pass information about the flexagon itself,
which could come either from an instance of `FlexagonManager` or bundled up in `DrawStripObjects`.

```javascript
// canvas:   canvas to draw in (string | HTMLCanvasElement)
// fm:       an instance of FlexagonManager
// objects:  an instance of DrawStripObjects
// options:  an instance of DrawStripOptions
function drawUnfolded(canvas, fm, options) {}
function drawUnfoldedObjects(canvas, objects, options) {}
```

The following shows the options that can be used when drawing an unfolded flexagon.
By default, it draws the entire strip scaled and rotated to fill the canvas as much as possible.

```javascript
enum StripContent {
  FoldingLabels,  // put everything on one-side, use labels that indicate folding order
  FoldingAndIds,  // FoldingLabels plus ids
  Front,          // only display what's on the front side, use leaf properties
  Back,           // only display what's on the back side, use leaf properties
  LeafLabels,     // put everything on one side, use labels from the leaf properties
}

{ // DrawStripCaption
  text;   // text to display along one edge of the specified leaf
  which;  // if >=0 it's an offset from the start of the strip, else it's an offset from the end
}

// DrawStripOptions
{
  content,  // [optional] StripContent: describes what to display in each leaf, defaults to FoldingLabels
  start;    // [optional] number: index of the first leaf to draw
  end;      // [optional] number: index of the last leaf to draw
  scale;    // [optional] number: scale factor (approximately the number of pixels on a leaf edge)
  rotation; // [optional] number: rotation (degrees) to apply when drawing
  captions; // [optional] DrawStripCaption[]: specify additional text to display on a given leaf
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

The following shows how you could add a `*` to the first and last edges to indicate that they should be taped together:

```javascript
drawUnfolded('mycanvas', fm, { captions: [ { text: '*', which: 0 }, { text: '*', which: -1 } ] });
```


## Drawing a pinch graph

You can have it draw a graph representing all the states accessible just through pinch flexes.
This includes any of the following: P, P', ^, <, or >.

```javascript
drawPinchGraph('mycanvas', { flexes: "PPP^>PP" });
```

The classic example is the Tuckerman Traverse, which is the quickest way to visit every state accessible by just using the pinch flex.
The following shows how to have it figure out the Tuckerman traverse for a given flexagon and display it.

```javascript
var traverse = findTuckermanTraverse(fm.flexagon);
drawPinchGraph('mycanvas', { traverse: traverse });
```

You can also have it overlay a flex sequence (e.g. `P>P^P<P`) on top of the Tuckerman traverse.
The `drawEnds` option is useful if you want it to highlight the start and end of the flex squence.

```javascript
drawPinchGraph('mycanvas', { traverse: traverse, flexes: "PPP^>PP", drawEnds: true });
```
