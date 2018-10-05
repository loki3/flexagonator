# Scripting Flexagonator

You can run a script to create a flexagon, apply flexes, and customize a flexagon.
Scripts be used when creating custom UI for a specific flexagon or category of flexagon.
They can also be used as a way to transport the current state of a flexagon from one custom UI to another.

Script commands:

* Defining flexagon structure
    * **pats:** create a new flexagon with the given structure
    * **numPats:** create a new flexagon with the given number of pats, but only one leaf per pat
* Flexes
    * **flexes:** perform a series of flexes
    * **reverseFlexes:** run a series of flexes in reverse, effectively undoing them
    * **flexAndColor:** run a series of flexes, labeling and coloring new faces as they're generated
    * **searchFlexes:** a list of flexes to search, e.g. displayed from the UI
    * **addFlex:** define a new flex
* Properties
    * **leafProps:** describe the properties for every leaf
    * **setFace:** set properties for the entire face (front and/or back)
    * **unsetFace:** set properties for just the portion of the current face that's not already set (front and/or back)
    * **angles:** set the angles for first leaf: [center angle, clockwise angle]
* History
    * **history:** manipulate the history that tracks which flexes have been performed

Note that all the examples listed here are in JavaScript.
If you're transporting scripts around, they may instead be in JSON, which is almost the same except all the property names are wrapped in quotes.
For example, `{ flexes: "P" }` is the JavaScript version while `{ "flexes": "P" }` is JSON.


## Defining flexagon structure

### the `pats` command

Use the `pats` command to describe the structure of a flexagon.
This structure definition is also used to define the before and after states when defining a flex.

```javascript
// create a flexagon with 5 leaves but no internal structure
{ pats: [1, 2, 3, 4, 5] }

// create the minimal hexaflexagon that supports the pyramid shuffle
{ pats: [[1, 2], 3, 4, 5, [[[6, 7], 8], 9], 10] }
```

If you know the *structure* you want, but the actual ids aren't important,
you can simply specify 0's for all the ids and useful ids will be filled in for you.

```javascript
// this describes the structure, letting the system assign ids
{ pats: [[0, 0], 0, 0, 0, [[[0, 0], 0], 0], 0] }
{ pats: [1, 2, 3, 4, 5] }
```

See [Pat Notation](pat-notation.md) for details on how to create and interpret pat notation.

### the `numPats` command

Use the `numPats` command to create a new flexagon with the given number of pats, but only one leaf per pat.
This is often followed by the `flexes` command to create more complex structure in the flexagon.

```javascript
// the following two commands are equivalent
{ pats: [1, 2, 3, 4, 5] }
{ numPats: 5 }
```


## Flexes

### the `flexes` command

This allows you to specify a series of flexes to be performed on a flexagon,
optionally creating new structure in the flexagon in order to allow the flex to be performed.
Each flex is separated by one or more space and uses the `shorthand` field from `addFlex` for representation,
e.g. `P > > Sh+ ^ T'`.

A flex is performed relative to the "current corner".
You can change the current corner using the special flexes `>` and `<` or turn the flexagon over with `^`.

* `>` step one corner clockwise
* `<` step one corner counterclockwise
* `^` turn the flexagon over, keeping the same current corner

Which flexes can be performed depends on the current structure of the flexagon and the number of pats in the flexagon.
Some of the sample UIs will display the flexes available for the current flexagon when the structure permits,
or you can call `FlexagonManager.allFlexes` to get the list.
Here are some examples of flexes:

* `P` the pinch flex, usable on flexagons with an even number of pats
* `V` the v-flex; while it can be applied to a variety of flexagons, Flexagonator currently only defines it for hexaflexagons
* `T` the tuck flex
* `Sh` the pyramid shuffle
* `F` the flip flex

Additionally, there are several symbols you can tack onto a flex to modify it.

* `'` apply the inverse of the flex, e.g. `P'`
* `+` generate the structure necessary for the flex without applying it, e.g. `T+`
* `*` generate the structure necessary for the flex and apply it, e.g. `Sh*`

```javascript
[
// perform the given flexes in order
{ flexes: "P > > V' ^ Sh" },
// create the structure necessary to perform two pinch flexes in a row
{ flexes: "P* P*" },
// run the given flexes backwards
{ reverseFlexes: "P > > V' ^ Sh" }
]
```

One technique for creating flexagons is to start from the "base" flexagon, one where the pats only have a single leaf,
then apply a series of flexes using `*` or `+` to generate the necessary structure for those flexes.
Such a sequence is called the "generating sequence" for the flexagon.

```javascript
[
// create the base hexaflexagon
{ pats: [1, 2, 3, 4, 5, 6] },
// create the structure necessary to perform two pinch flexes in a row
{ flexes: "P* P*" },
]
```


### the `flexAndColor` command

Use the `flexAndColor` command to have it automatically label and color new faces as they're created by a flex generating sequence.

It starts by labeling the top and bottom of the initial state with 1's on the front and 2's on the back.
If colors are specified, it uses the first color for the front and the second for the back.
From there on, whenever new leaves are created because of a generating flex (e.g. `P*` or `Sh+`),
it will label any freshly created leaves with the next number and apply the next color,
if there are still more in the color array.

```javascript
{ flexAndColor: { flexes: 'P* > Sh*' }, colors: [0x555555, 0x0000ff] } }
```


### the `searchFlexes` command

You can specify the flexes used by the system when it searches for which flexes can be performed on a flexagon.
The system defaults to using a set of "prime" flexes, i.e. flexes that can't always be expressed in terms of other flexes.
You can fetch the current list through `FlexagonManager.flexesToSearch`.

```javascript
{ searchFlexes: "P V T T' Sh" }
```

### the `addFlex` command

While Flexagonator has a lot of built-in flexes, it doesn't contain all the possible flexes.
Therefore, you can define your own flexes.
You specify both a full name and an abbreviated name used in flex sequences.
See [Flex Notation](flex-notation.md) for notes on naming conventions for the names of flexes.

After the names, you list the minimal pat structure before the flex is applied  with `input` and the resulting pat structure after the flex has been applied with `output`.
See [Pat Notation](pat-notation.md) for details on how to create and interpret pat notation.
Note that you should figure out the simplest pat structure needed to support your flex so that it can be applied from all appropriate configurations.

One other note is that flexes are performed relative to a "current corner", which is between the first and last pat in your `input` and `output` definitions.
For `input`, this will typically be where you fold two leaves together when starting the flex.
For `output`, a good rule of thumb is to make it so after you perform the flex,
you can turn it over and, without `>` or `<`, perform the flex again to get back to the original state.
In other words, `A = ^A^`.

```javascript
{ // create the flip3 flex that works on a 9-triangle flexagon
  addFlex: {
    shorthand: "F3",
    name: "flip3",
    input: [[1, 2], 3, 4, 5, 6, 7, [[8, 9], [10, 11]], 12, 13],
    output: [9, 12, [[-1, 3], [13, -2]], 4, 5, 6, 7, 10, [-8, -11]]
  }
}
```

There is one more optional parameter for a flex defintion called `rotation`,
which takes the values `0`, `1`, `2`, or `3` in JSON or one of the following values in JavaScript:

* `FlexRotation.None`:          same center vertex, no mirroring (the default)
* `FlexRotation.ClockMirror`:   new center = 1 step clockwise, flexagon is mirrored
* `FlexRotation.CounterMirror`: new center = 1 step counterclockwise, flexagon is mirrored
* `FlexRotation.Mirror`:        same center vertex, flexagon is mirrored

This describes how the top leaf in the first pat rotates when the flex is performed.
For many flexes (such as `T`, `Sh`, and `F`), rotation doesn't change, so you can rely on the default of `None`.
But for other flexs (such as `P` and `V`), the leaves rotate so a different corner of the leaf triangle is pointing into the center.
When you change the current corner with `>` or `<`, the leaves are mirrored, not rotated, so they use `FlexRotation.Mirror`.


## Properties

### the `leafProps` command

Every individual leaf can have a custom label and color, both on the front and back.
`leafProps` takes an array of properties, where the position in the array corresponds to the leaf id.
`front` and `back` can either be empty (which means use the default) or can contain `label` and/or `color`.
An array element can be `null` if you want to use the default for both the front and back of the leaf.

```javascript
{leafProps:[
  { front:{ label:"1", color:3031410 }, back:{} },
  { front:{ label:"1", color:3031410 }, back:{ label:"2", color:2850878 } },
  { front:{ label:"1", color:3031410 }, back:{ label:"2", color:2850878 } },
  { front:{ label:"2", color:2850878 }, back:{ label:"1", color:3031410 } },
  { front:{ label:"2", color:2850878 }, back:{} },
  null,
  { front:{ label:"1", color:3031410 }, back:{} },
  null,
  { front:{}, back:{ label:"2", color:2850878 } }
]}
```

### the `setFace` & `unsetFace` commands

With `setFace`, you can set common properties on the front and back of every visible leaf, overriding any existing properties.
`unsetFace` is the same except that it only sets properties on a leaf if it didn't already have any.
Both use the same `front` and `back` settings as `leafProps`.

```javascript
[
// set all the visible faces, front & back
{ setFace: { front: { label: "1", color: 0x2E4172 }, back: { label: "2", color: 0x2B803E } } },
// apply a pyramid shuffle
{ flexes: "Sh" },
// then set all the faces that weren't previously set
{ unsetFace: { front: { label: "3", color: 0xAA4439 }, back: { label: "4", color: 0x622870 } } },
]
```

### the `angles` command

By default, Flexagonator chooses isosceles triangles where the center angle is 360 / the number of pats.
To override this, use the `angles` command.
It takes an array of two numbers: the center angle and the angle immediately clockwise.
You can specify the third angle, but it's ignored.
Note that this describes the triangle corresponding to the first leaf on the first pat.
Since the second pat is a mirror image of the first, the second angle corresponds to the angle immediately counterclockwise from the center.

```javascript
// the leaf angle in the middle of the flexagon is 30
{ angles: [30, 60] }
```


## History

### the `history` command

As flexes are performed, the history is maintained, allowing you to undo and redo them.
The `history` command allows you to manipulate the history list.

* `undo` the last flex or set of flexes
* `redo` what was previously undone
* `clear` keep the current state of the flexagon, but clear out the history list
* `reset` undo everything in the history, resetting to the original state

```javascript
[
// create the base hexaflexagon and apply a generating sequence
{ pats: [1, 2, 3, 4, 5, 6] }
{ flexes: "P* P*" },
// clear the history so you can't undo the generating sequence
{ history: "clear" }
]
```
