# Workshop notes

## Flexagon terminology

**leaf**

> a single polygon in a flexagon

**pat**

> a stack of leaves in a flexagon

**face**

> one visible side of a flexagon

**mathematical face**

> a unique arrangement and orientation of the leaves in a face

**state**

> a unique arrangement of the pats (also: configuration)

**template**

> an unfolded flexagon (also: frieze, net, plan, strip)

**minimal flexagon**

> the flexagon with the fewest leaves that supports a given flex or flexes

**cycle**

> a flex sequence that ends where it begins

**class**

> all the states accessible from a starting state using a given flex or set of flexes, e.g. pinch class, {P, V} class

**traversal**

> a flex sequence that visits every state out of a class of faces

**generating sequence**

> a flex sequence used to create the minimal flexagon supporting it

**relatively prime flex**

> a flex that isn’t exactly equal to any flex sequence using a given set of flexes



## Flexagon Naming

**Leaf polygon:**  use the pattern `<polygon> flexagon`

* examples: triangle flexagon, square flexagon, pentagon flexagon

**Leaf angle:**  use specifc names for various classes of polygons

* examples: equilateral, silver (45-45-90), bronze (30-60-90), right, isosceles

**Number of pats:**  use the pattern `<Greek prefix>flexagon`

* examples: tetraflexagon, pentaflexagon, hexaflexagon, heptaflexagon, octaflexagon

**Number of faces:**  use the pattern `<Greek prefix>-flexagon`

* examples: tri-hexaflexagon (hexaflexagon with 3 faces), penta-hexaflexagon (hexaflexagon with 5 faces)

**Specifying multiple aspects:**  use the pattern `<angle> <polygon> <Greek prefix>flexagon`,
note that all three pieces are optional

* examples: equilateral triangle hexaflexagon, bronze hexaflexagon, silver octaflexagon


## Notation

[Flex notation](https://github.com/loki3/flexagonator/blob/master/docs/flex-notation.md)
gives us the ability to make lots of interesting statements about flexagons

[Pat notation](https://github.com/loki3/flexagonator/blob/master/docs/pat-notation.md)
gives us the ability to *prove* lots of interesting statements about flexagons


## Links

* [Explorable Flexagons](http://loki3.com/flex/explore/): interactive book for exploring flexagons
* [Playground](http://loki3.com/flex/explore/playground.html): online tools for analyzing flexagons
* [Flexagonator](https://github.com/loki3/flexagonator): source code for analyzing flexagons
* [Flexagons](http://loki3.com/flex/): templates, theory, puzzles
