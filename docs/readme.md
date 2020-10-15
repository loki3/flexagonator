# Flexagonator documentation

*Flexagonator* is a [flexagon](http://loki3.com/flex/) simulator.


## Detailed documents

* [Pat notation](pat-notation.md): The notation used to describe the internal structure of a flexagon.
  It's useful for defining how flexes transform a flexagon.
* [Flex notation](flex-notation.md): The notation used to describe a series of flexes on a flexagon.
* [Scripting](script.md): How to run scripts for creating and flexing specific flexagons.
* [Drawing APIs](draw-apis.md): APIs used for drawing folded or unfolded flexagons.
* [Atomic theory](atomic-theory.md): Describes the low level details of how flexagons operate.


## Features

* Supports multiple ways to describe a specific [triangle flexagon](http://loki3.com/flex/triangles.html):
    * You can use [pat notation](pat-notation.md) to describe the internal structure of the flexagon.
    * You can use [flex notation](flex-notation.md) to describe the series of flexes you want the flexagon to support.
      It will create the internal structure necessary to support the given [generating sequence](http://loki3.com/flex/flex/generating-sequences.html).
* Additional flexagon properties that are supported:
    * Any number of triangles per face (typically 4 through 12)
    * Any triangle can be used for the leaves
    * Leaves can be colored or numbered
* Can unfold a working flexagon model.
    * By default, the leaves are numbered to make it easy to fold into a working model.
      Fold the highest pair of numbers together, then the next highest pair, etc. till only the 1's and 2's are visible.
      Then you tape the first edge to the last edge and the flexagon should be ready to flex.
* [Drawing](draw-apis.md):
    * The current state of a flexagon.
    * The unfolded version of the flexagon
* Understands how to apply flexes to a given flexagon
    * Figures out which flexes are possible at which corners
    * Can search for all the states accessible from a starting state given a specified set of flexes
    * Can figure out the series of flexes needed to get from one state to another
* [Scripting](script.md)
    * See the [custom folder](..\custom) for examples of how to use the APIs.

## Limitations

* Limited flexagon structure:
    * It only supports triangles, not any other polygons ([squares](http://loki3.com/flex/square.html), pentagons, etc.).
    * The leaves must be connected across edges, not [points](http://loki3.com/flex/point-flexagon.html).
    * When drawing folded flexagons, it assumes all triangles meet in the middle.
      Note that drawing an unfolded flexagon *doesn't* assume the leaves in the folded flexagon meet in the middle.
* It only looks at pat structure when determining if a flex can be performed,
  though there are other reasons the flex might not be possible:
    * The flex may require additional openings in the physical flexagon that aren't otherwise impacted by the flex.
    For example, the [tuck flex](http://loki3.com/flex/flex/tuck.html) requires an opening across from the flex.
    While there's only one possibility for this opening for the hexaflexagon
    (thus it's easy to add to the pat structure), there are multiple possibilities on higher-ordered flexagons.
    Currently there isn't a simple way to describe this requirement
    * The physical model may impose limitations based on the angles of the triangles,
    e.g. the [flip flex](http://loki3.com/flex/flex/flip.html) may only be possible at every other corner,
    even if the pat structure supports it.
    Currently there isn't a simple way to describe this requirement
* Flexes must start and end with the same arrangement of pats.
  For example, you currently can't describe the intermediate states reachable through various
  [pocket and slot flexes](http://loki3.com/flex/state-slot-5-hexa.html).
  (Note: you can now use [atomic theory](./src/atomic/readme.md) to describe intermediate states,
  though the API is still in flux.)
* When drawing an unfolded flexagon, it doesn't detect when leaves overlap.
  However, you can manually break the strip up into multiple pieces with the [drawing API](draw-apis.md).

