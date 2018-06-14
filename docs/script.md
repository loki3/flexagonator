# Scripting Flexagonator

You can run a script to create a flexagon, apply flexes, and customize a flexagon.
Scripts be used when creating custom UI for a specific flexagon or category of flexagon.
They can also be used as a way to transport the current state of a flexagon from one custom UI to another.

Script commands:

* Defining flexagon structure
    * **pats:** create a new flexagon with the given structure
* Flexes
    * **flexes:** perform a series of space-delimited flexes
    * **reverseFlexes:** run a series of flexes in reverse, effectively undoing them
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

```javascript
// create a flexagon with 5 leaves but no internal structure
{ pats: [1, 2, 3, 4, 5] }

// create the minimal hexaflexagon that supports the pyramid shuffle
{ pats: [[1, 2], 3, 4, 5, [[[6, 7], 8], 9], 10] }
```

## Flexes

```javascript
[
// perform the given flexes in order
{ flexes: "P > > V' ^ S" },
// create the structure necessary to perform two pinch flexes in a row
{ flexes: "P* P*" },
// run the given flexes backwards
{ flexes: "P > > V' ^ S" }
]
```

You can specify the flexes used by the system when it searches for which flexes can be performed on a flexagon.
The system defaults to using a set of "prime" flexes, i.e. flexes that can't always be expressed in terms of other flexes.

```javascript
{ searchFlexes: "P V T T' S" }
```

While Flexagonator has a lot of built-in flexes, it doesn't contain all the possible flexes.
Therefore, you can define your own flexes.
You specify both a full name and an abbreviated name used in flex sequences.

Then, you list the minimal pat structure before the flex is applied (input:) and the resulting pat structure after the flex has been applied (output:).
See the description above for how pats are defined for details on how you do this.
Note that you should figure out the simplest pat structure needed to support your flex so that it can be applied from all appropriate configurations.

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


## Properties

```javascript
{leafProps:[
  {front:{label:"1",color:3031410},back:{}},
  {front:{label:"1",color:3031410},back:{label:"2",color:2850878}},
  {front:{label:"1",color:3031410},back:{label:"2",color:2850878}},
  {front:{label:"2",color:2850878},back:{label:"1",color:3031410}},
  {front:{label:"2",color:2850878},back:{}},
  null,
  {front:{label:"1",color:3031410},back:{}},
  null,
  {front:{},back:{label:"2",color:2850878}}
]}
```

setFace & unsetFace

```javascript
[
// set all the visible faces, front & back
{ setFace: { front: { label: "1", color: 0x2E4172 }, back: { label: "2", color: 0x2B803E } } },
// apply a pyramid shuffle
{ flexes: "S" },
// then set all the faces that weren't previously set
{ unsetFace: { front: { label: "3", color: 0xAA4439 }, back: { label: "4", color: 0x622870 } } },
]
```

set the angles for first leaf: [center angle, clockwise angle]

```javascript
// the leaf angle in the middle of the flexagon is 30
{ angles: [30, 60, 90] }
```


## History

manipulate the flex history - `clear`, `undo`, `redo`, `reset`

```javascript
[
// create the base hexaflexagon and apply a generating sequence
{ pats: [1, 2, 3, 4, 5, 6] }
{ flexes: "P* P*" },
// clear the history so you can't undo the generating sequence
{ history: "clear" }
]
```
