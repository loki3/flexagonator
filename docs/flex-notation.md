# Flex Notation

*Flex Notation* is used to describe how to perform a series of flexes on a flexagon.

It uses the concept of a "current corner" (or "current vertex") that a flex is relative to.
You can switch the current corner using `>` (rotate one corner clockwise), `<` (rotate one corner counterclockwise),
or `^` (turn the flexagon over).

Flex notation uses an abbreviated name for each flex, which should start with capital letter.
This can be followed by a series of lower case letters or numbers,
for example, `P`, `Sh`, `F3`, `Ltb`, or `P334`.
This makes it easy to find the beginning of a flex in a series of flexes.

Some important notes about flexes:

* Not all flexes are available on all flexagons, e.g. you can't perform a pinch flex on a pentaflexagon, which only has 5 leaves per side
* Even on a flexagon that supports a given flex, you can't always perform that flex at the current corner.
The flexagon must have the proper structure.


## Flex modifiers

There are several modifiers that can be tacked on to a flex:

* `'`: a flex name followed by a single quote refers to the *inverse* of a flex, i.e. the flex performed in reverse, e.g. `P'` or `Sh'`
* `+`: if the current state of the flexagon doesn't support the given flex, create the internal structure necessary to support it *without* applying the flex, e.g. `F3+` or `Ltb'+`
* `*`: same as `+`, but apply the flex after creating the necessary structure, e.g. `T*` or `P334'*`

```
P > > T'* ^ < Sh+
```

A sequence of flexes used to create a new flexagon is called a *generating sequence*.
It typically consists of flexes followed with `*` or `+`.
For example, the generating sequence `P* P* P*` can be used to create a pentahexaflexagon,
i.e. a hexagonal flexagon where you can pinch flex to 5 different sides.


## Flexes

Here are some of the flexes built in to Flexagonator:

* `>`: rotate the current corner one clockwise
* `<`: rotate the current corner one counterclockwise
* `^`: turn the flexagon over, while keeping the same current corner
* `P`: the pinch flex - see [Pinch Flex](http://loki3.com/flex/flex/pinch.html)
* `P44`, `P333`, `P334`, `P55`, `P3333`, `P444`, `P66`: pinch flex variants where the numbers describe how many
corners are skipping in between pinches, e.g. P334 means that you pinch one corner, skip 3 before the next pinch, and skip another 4 before the final pinch
* `T`: the tuck flex - see [Tuck Flex](http://loki3.com/flex/flex/tuck.html)
* `T1`, `T2`, etc.:  tuck flex variants - since the tuck flex requires an opening opposite where the flex is being
performed, these variants describe which opposite hinge needs to exist
* `Tf`: forced tuck - same as the tuck flex, but doesn't require an opening on the opposite side - note that this
flex can be very hard to do without damaging the flexagon, so it's generally just used for simulation to explore
the states of a flexagon
* `Tt`: the tuck top flex - same as the tuck flex, but you open up the front instead of the back after doing the tuck
* `Sh`: the pyramid shuffle - see [Pyramid Shuffle](http://loki3.com/flex/flex/pyramid-shuffle.html) -
note that the linked page uses `S`, where `Sh = S <` - `Sh` was defined so that `Sh = ^ Sh ^`
* `V`: the v-flex - see [V Flex](http://loki3.com/flex/flex/v.html)
* `F`: the flip flex - see [Flip Flex](http://loki3.com/flex/flex/flip.html)
* `St`: the silver tetra - see [Silver Tetra](http://loki3.com/flex/flex/silver-tetra.html)
* `Lt`: the slot tuck - see [Slot Tuck](http://loki3.com/flex/flex/slot-tuck.html)
* `Ltb`: the slot tuck bottom - same as the slot tuck, but you open it from the opposite side
* `Lbtt`: the back slot tuck top - same as the slot tuck, but you tuck from the opposite corner
* `Lbtb`: the back slot tuck bottom - same as the slot tuck bottom, but you tuck from the opposite corner
* `Lh`: the slot half - start with a slot, fold the flexagon in half, then open it up
* `Lk`: the slot pocket - start with a slot, then do a series of pocket flexes before opening it up
* `L3`: the slot triple pocket - do 3 pocket flexes, a slot, then 3 pocket flexes
* `Tk`: the ticket flex - see [Ticket Flex](http://loki3.com/flex/flex/ticket.html)
