# Pat Notation

*Pat Notation* is used to describe the internal structure of a flexagon.
It's also used when defining flexes to describe the before and after states of the flexagon.

## *Pat* definition

A flexagon is made of a series of polygons mirrored over an edge, then folded up into a working flexagon.
Each individual polygon is a `leaf`.
A stack of folded leaves is called a `pat`, and the full flexagon consists of a series of connected pats.
For example, a hexaflexagon consists of 6 connected pats.

Every leaf in the flexagon is represented by a unique number.
One face of the leaf is positive and the other face is the corresponding negative number.
A pat consists of either a single leaf number or nested arrays of leaf numbers.
Each array in a pat has exactly two elements, where each element is either a leaf number or an array.
The full structure of a flexagon specified by `pats` consists of an array of pats, where the pats go clockwise.
For example, a hexaflexagon will be described using an array of 6 pats.

```javascript
// a flexagon with 5 leaves but no internal structure
[1, 2, 3, 4, 5]

// describes the minimal hexaflexagon that supports the pyramid shuffle
[[1, 2], 3, 4, 5, [[[6, 7], 8], 9], 10]
```

## Create pat notation from a flexagon

In order to figure out the pat notation for a given flexagon, start by uniquely labeling every leaf, from 1 on up.
Put the negative numbers on the backside of each leaf, e.g. if the front is 3, the back will be -3.
From the folded state you want to describe, pick a pat to start with, then continue clockwise till you've described each pat.

For an individual pat, identify the first hinge that could unfold it.
The subpat on the top will be listed first, and the subpat on the bottom will be listed second.
If a subpat is just a single leaf, list the leaf number, including whether the positive or negative value is face up.
If the subpat has more structure, repeat the above process, finding the next hinge and describing the two subpats.
In this way, you can recursively describe the entire structure of a pat in nested arrays.

```javascript
// in the following pat, the first hinge is between the subpats 1 and [3, -2]
// and the second hing is between 3 and -2
[ 1, [3, -2] ]
```

One interesting note is that pat notation for triangle flexagons doesn't need to say which hinge connects subpats.
This is implicit in how flexagons behave.
See [Atomic Theory](atomic-theory.md) for a description of how to handle flexagons where the pats don't all meet in the center.


## More information

See [Flexagon Theory](http://loki3.com/flex/g4g10/Flex-Theory.pdf) for more information about pat notation and defining flexes using it.
