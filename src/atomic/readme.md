# Atomic flexagon theory

## Purpose

"Atomic flexagon theory" describes at a low level how flexagons operate.
It can be used to describe any flex, and explains how to fold a template, unfold a flexagon, and how a flexagon can shape shift.

The fundamental axiom, `Ur = a # [-2,1] / b ->  a # 1 \ 2 / -b`,
describes how to unfold a pair of pats or leaves along a single hinge.
Combined with its folding inverse, `Ur'`, it explains how flexagons work.

## Notation

Flex definitions include an initial pattern that must be present in the flexagon in order to perform the flex,
followed by a final pattern that describes how the flex has changed the flexagon.
They are relative to a "current hinge", which can be changed,
allowing us to move around a flexagon, performing flexes in different locations.

The notation leverages many of the concepts of [pat notation](https://github.com/loki3/flexagonator/blob/master/docs/pat-notation.md)
with a few additional concepts.

Here are the symbols used in defining a flex:

```
#       current hinge
a       all the remaining pats to the left
b       all the remaining pats to the right
-       turn over a leaf or pat
[x,y]   two leafs or pats folded together, with x on top of y
/       next pat is to lower right of triangle; previous pat at left
\       next pat is to upper right of triangle; previous pat at left
=       flex definition
x -> y  x is the initial state, y is the state after the flex
'       inverse - if A = x -> y, then A' = y -> x
```

For example, the definition `Ur = a # [-2,1] / b ->  a # 1 \ 2 / -b` means the following:

* define a flex named `Ur`
* the input pattern is `a # [-2,1] / b`
    * everything to the left of the current hinge is referred to as `a`
    * the first pat to the right of the current hinge has a pat called `-2` folded on top of a pat called `1`
    * `\` means the next pat is connected to the upper right side of the triangle, with the previous pat connected to the left
    * everything to the right of that pat is referred to as `b`
* the output pattern is `a # 1 \ 2 / -b`
    * `a` is unchanged
    * the `1` subpat becomes the first pat after the current hinge
    * `/` means the next pat is connected to the lower right side of the `1` subpat
    * the `2` subpat is next and has been turned over, since it changed from `-2`
    * `\` means the next pat is connected to the upper right side of the `2` subpat
    * `-b` indicates that all the pats to the right have been turned over - since a flexagon is a loop where `a` and `b` are attached to each other, this implies that `Ur` has just added a half twist to the loop

We can also define new flexes in terms of existing flexes
using [flex notation](https://github.com/loki3/flexagonator/blob/master/docs/flex-notation.md),
e.g. `Xr = Ur> ^Ur'^`.

An extra note on how the changes to `a` and `b` should be interpreted based on where the are relative to the current hinge and whether they start with a minus (`-`)
, which can be confirmed by experimenting with a physical flexagon:

* `a # -> a #` : keep everything in `a` the same
    * e.g. `1 \ [-3,2] \` stays the same
* `a # -> # a` : reverse pat order, reverse directions, preserve pats
    * e.g. `1 \ [-3,2] \` changes to `[-3,2] \ 1 \`
* `a # -> -a #` : turn over pats, reverse directions, preserve pat order
    * e.g. `1 \ [-3,2] \` changes to `-1 / [-2,3] /`
* `a # -> # -a` : turn over pats, reverse pat order, preserve directions
    * e.g. `1 \ [-3,2] \` changes to `[-2,3] / -1 /`

## Definitions

All flexes can be defined as the composition of just 4 different operations:

* `>`  shift the current hinge one pat to the right
* `^`  turn over the flexagon across the vertical axis
* `~`  turn over the flexagon across the horizontal axis
* `Ur` unfold a hinge to the right

Using the notation given above, we can define these basic axioms:

```
>  =  a # 1 b        ->  a 1 # b
^  =  a # b          -> -b # -a
~  =  a # b          -> -a # -b
Ur =  a # [-2,1] / b ->  a # 1 \ 2 / -b
```

From those 4 definitions, we can derive several convenient building blocks in terms of those initial flexes:

```
# shift current hinge one pat to the left
<  = >'
   = a 1 # b  ->  a # 1 b

# unfold a hinge to the left
Ul = ~Ur~
   =  a # [1,-2] \ b  ->  a # 1 / 2 \ -b

# exchange a sub-pat between adjacent pats
Xr = Ur> ^Ur'^
   = a 1 / # [-3,2] / b  ->  -a [2,-1] / # 3 / -b
Xl = Ul> ^Ul'^
   = a 4 \ # [5,-6] \ b  ->  -a [-4,5] \ # 6 \ -b

# pocket flex
K  = Ur >^ Ur' > Ul ^
   = Xr^ > Ul^
   = a [-2,1] / -3 / # [5,-4] / b  ->  a 1 \ 2 / # [-4,3] / -5 / -b
```

Here's how we can define various types of pinch flexes using these components:

```
# pinch flex on a hexaflexagon
P = K <<< ^K'^ >>>
  = Xr >> Xl >> Xr >>
  = Ur> ^Ur'^ >> Ul> ^Ul'^ >> Ur> ^Ur'^ >>

# pinch flex variations on a dodecaflexagon
P      = (Xr >> Xl >>)3 ~
P3333h = Xr >>> Xl >>> Xr >>> Xl >>> ~
P3333  = (Xr >>> Xl >>> Xr >>> Xl >>>)2
P444h  = Xr >>>> Xl >>>> Xr >>>>
P444   = (Xr >>>> Xl >>>> Xr >>>>)2
P66    = (Xr (>)6 Xl (<)6)2
```

Many other flexes can be assembled from a small set of "half flexes".
On a flexagon where all pats meet in the middle,
they take you to a position that looks like a kite on one edge.
Doing the inverse of a different half flex takes you back to a state where all pats meet in the middle again,
except that some leaves have been rearranged.

Here are the definitions of various half flexes:

```
# flexes from main to kite, inverse from kite to main
# current hinge in middle
Hf  = K > Ul' <
Hb  = ^Hf^
Hr  = << Ur >>>> Xl << Ul' ~
Hl  = ^Hr^
Hsr = > K < Ur << Ul' >> Ur'
Hsl = ^Hsr^

# kite-to-kite slot
Hkl = > Ul Ur <<<< Ul' < Ul' >>

# specific to hexaflexagon
Hh  = Xr >>> Xl <<<~
Ht  = < Ur ^<<< Ur' <<^ Xl <<<~
```

Composing half flexes into more complex flexes:

```
F   = Hf Hb'
St  = Hf Hsr'
S   = < Hsr Hb' >
T   = < Hr Hf' >
Mf  = < Hr Hb' >
S3  = < Hr Hl' >

Ltf = Hf Hkl Hf' <
Lk  = Hf Hkl Hsl' <

# specific to hexaflexagon
Ttf = Hh Hf'
V   = Hb Hh'
T   = Hh Ht'
Lh  = Hf Hkl Hh'
Ltb = Hf Hkl Ht'
Lbb = Hf Hkl >>> Ht' <<
Lbf = Hf Hkl >>> Hf' <<
```

Some other selected flexes:

```
# on a pentaflexagon
L3  = (K^)3 (<)5 (K'^)3

# "inner pivot" with pat directions \//\
Iv  = > Ul > Ul <<<< Ur' Ul' >>
```
