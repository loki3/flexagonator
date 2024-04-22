# Flex Notation

*Flex Notation* is used to describe how to perform a series of flexes on a flexagon.

It uses the concept of a "current hinge" that a flex is relative to.
You can switch the current hinge using `>` (rotate one hinge clockwise), `<` (rotate one hinge counterclockwise),
or `^` (turn the flexagon over).

Flex notation uses an abbreviated name for each flex, which should start with capital letter.
This can be followed by a series of lower case letters or numbers,
for example, `P`, `S`, `F3`, `Ltb`, or `P334d`.
This makes it easy to find the beginning of a flex in a series of flexes.

Some important notes about flexes:

* Not all flexes are available on all flexagons, e.g. you can't perform a pinch flex on a pentaflexagon, which only has 5 leaves per face
* Even on a flexagon that supports a given flex, you can't always perform that flex at the current hinge.
The flexagon must have the proper structure.


## Flex modifiers

There are several modifiers that can be tacked on to a flex:

* `'`: a flex name followed by a single quote refers to the *inverse* of a flex, i.e. the flex performed in reverse, e.g. `P'` or `S'`
* `+`: if the current state of the flexagon doesn't support the given flex, create the internal structure necessary to support it *without* applying the flex, e.g. `F3+` or `Ltb'+`
* `*`: same as `+`, but apply the flex after creating the necessary structure, e.g. `T*` or `P334d'*`

```
P > > T'* ^ < S+
```

You can declare that you want to repeat a given flex sequence by putting it in (parens) followed by the number of times to repeat.

```
// repeat sequence 6 times
(P > S >) x 6
// repeat P* twice followed by repeating a different sequence 4 times
(P*) x 2 (^ > P*) x 4
```


## Generating sequences

A sequence of flexes used to create a new flexagon is called a *generating sequence*.
It typically consists of flexes followed with `*` or `+`.
For example, the generating sequence `P* P* P*` can be used to create a pentahexaflexagon,
i.e. a hexagonal flexagon where you can pinch flex to 5 different faces.


## Flexes

Here are some of the flexes built in to Flexagonator:

* `>`: rotate the current hinge one clockwise
* `<`: rotate the current hinge one counterclockwise
* `^`: turn the flexagon over, while keeping the same current hinge
* `P`: the pinch flex - see [Pinch Flex](http://loki3.com/flex/flex/pinch.html)
* `P44d`, `P333d`, `P334d`, `P55d`, `P3333d`, `P444d`, `P66d`: pinch flex variants where the numbers describe how many
hinges are skipped in between pinches, e.g. P334d means that you pinch one hinge, skip 3 before the next pinch, and skip another 4 before the final pinch,
the final `d` is short for *double* to indicate that you perform it twice
* `T`: the tuck flex - see [Tuck Flex](http://loki3.com/flex/flex/tuck.html)
* `T1`, `T2`, etc.:  tuck flex variants - since the tuck flex requires an opening opposite where the flex is being
performed, these variants describe which opposite hinge needs to exist
* `Tf`: forced tuck - same as the tuck flex, but doesn't require an opening on the opposite side - note that this
flex can be very hard to do without damaging the flexagon, so it's generally just used for simulation to explore
the states of a flexagon
* `Ttf`: the tuck top front flex - same as the tuck flex, but you open up the front instead of the back after doing the tuck
* `S`: the pyramid shuffle - see [Pyramid Shuffle](http://loki3.com/flex/flex/pyramid-shuffle.html)
* `V`: the v-flex - see [V Flex](http://loki3.com/flex/flex/v.html)
* `F`: the flip flex - see [Flip Flex](http://loki3.com/flex/flex/flip.html)
* `St`: the silver tetra - see [Silver Tetra](http://loki3.com/flex/flex/silver-tetra.html)
* `Tw`: the twist flex - best on an even-ordered star flexagon, and involves multiple simple pivot flexes
* `Ltf`: the slot tuck top front - see [Slot Tuck](http://loki3.com/flex/flex/slot-tuck.html)
* `Ltb`: the slot tuck top back - same as the slot tuck, but you open it from the opposite side
* `Lbf`: the slot tuck bottom front - same as the slot tuck top front, but you tuck from the opposite hinge
* `Lbb`: the slot tuck bottom back - same as the slot tuck top back, but you tuck from the opposite hinge
* `Lh`: the slot half - start with a slot, fold the flexagon in half, then open it up
* `Lk`: the slot pocket - start with a slot, then do a series of pocket flexes before opening it up
* `L3`: the slot triple pocket - do 3 pocket flexes, a slot, then 3 pocket flexes
* `Tk`: the ticket flex - see [Ticket Flex](http://loki3.com/flex/flex/ticket.html)
