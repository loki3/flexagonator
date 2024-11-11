# Drawing APIs

There are functions you can use to draw folded or unfolded flexagons.
They both work with flexagons with any number of pats and leaves that consist of any type of triangle.

The routines for drawing a folded flexagon can also figure out which flexes can
be performed at each hinge, with an option for hooking up UI to buttons describing the flexes.

The routines for drawing unfolded flexagons take the internal of structure of
the flexagon as described in [pat notation](pat-notation.md) and figure out how to turn it into an unfolded strip.

There's also a function for drawing the graph of states accessible by just using the pinch flex.

The draw routines can accept the name of an HTML element that's either a canvas
or something to attach an SVG under, such as a `<div>` or `<span>`.

```html
<canvas id="canvas-name" width="800" height="500"></canvas>
<div id="target-name" width="800" height="500"></div>
```


## Drawing a folded flexagon

There are two different functions you can use to draw the current state of a folded flexagon.
Both take an object that describes various options for how the flexagon should be drawn
and both return a `RegionForFlexes` object that describes where various flexes can be performed.
They differ in how you pass information about the flexagon itself,
which could come either from an instance of `FlexagonManager` or bundled up in `DrawFlexagonObjects`.

```javascript
// target:   element to draw in (string | HTMLCanvasElement)
// fm:       an instance of FlexagonManager
// objects:  an instance of DrawFlexagonObjects
// options:  an instance of DrawFlexagonOptions
// RETURNS:  ScriptButtons if options.flexes is true
function drawEntireFlexagon(target, fm, options) {}
function drawEntireFlexagonObjects(target, objects, options) {}
```

Everything in `DrawFlexagonOptions` is optional.
It's used to specify additional information about how the flexagon is drawn
such as whether to draw the front or back, and whether to display useful statistics.

```javascript
// DrawFlexagonOptions
{
  back: true,        // boolean: default false (front), draw front or back
  both: true,        // boolean: default false, draw both front & back
  stats: true,       // boolean: default false, show stats such as the number of leaves
  structure: true,   // boolean: default false, show internal structure of each pat
  structureTopIds:   // boolean: default false, show pat structure that includes ids <= numpats
  scaleStructure: 1, // number: default 1, scale factor to apply to pat structure text
  drawover: true,    // boolean: default false, draw over canvas or clear first
  showIds: true,     // boolean: default true, show leaf ids
  showCurrent: true, // boolean: default true, show an indicator next to the current hinge
  showNumbers: true; // boolean: default true, show the face numbers
  showCenterMarker:  // boolean: default false, show a marker on every leaf for where original center corner now is
  generate: true,    // boolean: default false, include every flex with * added, e.g. P*
  scale: 1,          // number: default 1, scale factor
  rotate: 0,         // number: default 0, amount to rotate flexagon (degrees)
}

// example using DrawFlexagonOptions with drawEntireFlexagon
Flexagonator.drawEntireFlexagon('my-target', fm, { stats: true, structure: true });
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
Flexagonator.drawEntireFlexagonObjects('my-target', objects, { stats: true, flexes: true, structure: true });
```

If you want to have buttons that can be used to perform flexes at the different flexagon hinges,
you can leverage the `RegionForFlexes[]` collection that is returned from the draw routines.
You can either use the information to draw your own buttons or call `drawScriptButtons` to both
draw the flexes and get a detailed description of where they're drawn so the buttons are functional.
The following shows how you can hook up mouse events using these "script buttons".

```javascript
// example using returned ScriptButtons
var regions = Flexagonator.drawEntireFlexagon('my-target', fm, {});
// drawScriptButtons takes a canvas id, flexagon, angle info, boolean for front/back, RegionForFlexes[], optional fontsize
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

// or if you want everything listed under fm.flexesToSearch to be marked with a *,
// e.g. P* so that you can generate the structure needed for any flex at any hinge
var regions = getButtonRegions(fm, width, height, true/*front*/, true/*generate*/);
```

`RegionForFlexes` describes all the flexes that are valid at a single hinge of the flexagon.
If you want to apply a flex, you would first need to change the current hinge by applying
what's listed in `prefix`, e.g. `>>`.
After the flex is applied, you could move back to that original flex by applying `postfix`, e.g `<<`.
Here's what it contains:

```javascript
// RegionForFlexes
{
    flexes: string[];  // flexes valid at this hinge e.g. [ 'P', 'S' ]
    prefix: string;    // change the current hinge, e.g. '>>'
    postfix: string;   // restore the current hinge, e.g. '<<'
    corner: Point;     // where the associated hinge corner was drawn, e.g. { x: 10, y: 50 }
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
// target:   element(s) to draw in (string | string[] | HTMLCanvasElement)
// fm:       an instance of FlexagonManager
// objects:  an instance of DrawStripObjects
// options:  an instance or array of DrawStripOptions
function drawUnfolded(target, fm, options) {}
function drawUnfoldedObjects(target, objects, options) {}
```

The following shows the options that can be used when drawing an unfolded flexagon.
By default, it draws the entire strip scaled and rotated to fill the drawing region as much as possible.

```javascript
// DrawStripOptions
{
  content,  // [optional] LeafContent: describes what to display on each leaf, defaults to showFoldingOrder
  start;    // [optional] number: index of the first leaf to draw
  end;      // [optional] number: index of the last leaf to draw
  scale;    // [optional] number: scale factor (approximately the number of pixels on a leaf edge)
  rotation; // [optional] number: rotation (degrees) to apply when drawing
  captions; // [optional] DrawStripCaption[]: specify additional text to display on a given leaf
}

// LeafContent
{
  // [optional] default 'both'; draw both front and back labels, or just front,
  // or just back (flipped left-to-right) or back-y (flipped top-to-bottom)
  face: 'both' | 'front' | 'back' | 'back-y';
  // [optional] default false; draw labels that show folding order
  showFoldingOrder;
  // [optional] default false; draw labels and colors from leaf properties
  showLeafProps;
  // [optional] default false; draw leaf ids
  showIds;
  // [optional] default 0; if filling colors, this is the fractional amount to inset the fill, from 0 to 1
  inset;
  // [optional] default 'dashed'; the style to use for drawing the first and last edges
  endStyle;
}

{ // DrawStripCaption
  text;   // text to display along one edge of the specified leaf
  which;  // if >=0 it's an offset from the start of the strip, else it's an offset from the end
  edge;   // [optional] which leaf edge to put label on
  scale;  // [optional] how much to scale text by; default 1
}

// example passing DrawStripOptions to drawUnfolded
drawUnfolded('my-target', fm, { content: { face: 'front' }, rotation: 60 });
```

Use `drawUnfolded` to draw the strip using the properties in `FlexagonManager` as shown above.
Or you can explicitly pass the same information to `drawUnfoldedObjects` using `DrawStripObjects`
as shown below.

```javascript
// DrawStripObjects
{
  flexagon,   // Flexagon
  angleInfo,  // FlexagonAngles
  directions, // boolean[] | string, optional
  leafProps,  // PropertiesForLeaves
}

// example passing DrawStripObjects to drawUnfoldedObjects
const objects = {
  flexagon: fm.flexagon,
  angleInfo: fm.getAngleInfo(),
  leafProps: fm.leafProps,
};
drawUnfoldedObjects('my-target', objects, {});
```

The following shows how you could add a `⚹` to the first and last edges to indicate that they should be taped together:

```javascript
drawUnfolded('my-target', fm, { captions: [ { text: '⚹', which: 0 }, { text: '⚹', which: -1 } ] });
```

You can also break a strip up into multiple pieces.
A single piece can be drawn by setting `start` and `end` in `options`.
Or you can draw multiple pieces at once by passing arrays of targets and options.
If you have it draw multiple pieces at once and you don't specify a scale,
it will figure out the best common scale to make each piece fit.

```javascript
const targets = ['div1', 'div2'];
const options = [{start:0, end: 5}, {start:6, end:10}];
drawUnfolded(targets, fm, options);
```


## Drawing a pinch graph

You can have it draw a graph representing all the states accessible just through pinch flexes.
This includes any of the following: P, P', ^, <, or >.

```javascript
drawPinchGraph('my-target', { flexes: "PPP^>PP" });
```

The classic example is the Tuckerman Traverse, which is the quickest way to visit every state accessible by just using the pinch flex.
The following shows how to have it figure out the Tuckerman traverse for a given flexagon and display it.

```javascript
var traverse = findTuckermanTraverse(fm.flexagon);
drawPinchGraph('my-target', { traverse: traverse });
```

You can also have it overlay a flex sequence (e.g. `P>P^P<P`) on top of the Tuckerman traverse.
The `drawEnds` option is useful if you want it to highlight the start and end of the flex squence.

```javascript
drawPinchGraph('my-target', { traverse: traverse, flexes: "PPP^>PP", drawEnds: true });
```
