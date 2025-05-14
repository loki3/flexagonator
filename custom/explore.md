# Flexagon Explorer

The [Flexagon Explorer](../custom/explore.html) page is a custom page for
exploring all the states of a flexagon that is specified using a [flexagonator script](script.md).
There are several different sections of the page that offer various ways to explore the states:

* [explore](#explore) - enter a script and find all the states of a flexagon
* [viewing states](#viewing-states) - view the flexagon states in different ways
* [visible leaves to state](#visible-leaves-to-state) - find which state(s)
  have the given visible leaves
* [find sequence between two states](#find-sequence-between-two-states) - find the
  shortest flex sequence that takes you between two states
* [find disconnected subgraphs](#find-disconnected-subgraphs) - find out how many
  disconnected subgraphs there are when only using a single type of flex
* [find cycles](#find-cycles) - find all all cycles that preserve pat structure
  starting from a given state
* [pat rearrangements](#pat-rearrangements) - find which states contain a pat that's
  a rearrangement of a given pat

## Explore

The first step is to enter a script that describes the flexagon you want to explore,
optionally specifying the flexes you want to use for traveling between states.
Then select one of the _explore_ buttons to initiate a search,
starting from the state described by the script and applying all the flexes
(either explicit or implicit) to find all the accessible states.

To learn about all the supported script commands, see [Scripting flexagonator](script.md).
Alternately, you can use an app such as [Flexagon Inspector](https://loki3.github.io/flex/inspector.html)
to generate the script.

One way to specify a flexagon is to use its _name_
and a _generating sequence_ using [flex notation](flex-notation.md):

```javascript
[ {"name": "hexaflexagon"}, {"flexes": "P* S*"} ]
```

Another option is to use [pat notation](pat-notation.md) to describe the flexagon:

```javascript
[ {"pats": [0, [0,0], 0, [0,[0,0]], 0, [0,0]]} ]
```

To instruct it to use specific flexes, use the `searchFlexes` command.
If not specified, it defaults to using the relatively prime flexes for the given flexagon.

```javascript
[
  {"name": "hexaflexagon"}, {"flexes": "P* S*"},
  {"searchFlexes": "P S F T T'"}
]
```

When you pick the _explore_ button, it will start its search with the flexagon described
by the script.
It will then try applying every flex listed in `searchFlexes` (or the all the relatively
prime flexes) to every hinge, shifting hinges and turning the flexagon over,
repeating this for every state it finds until it exausts all the possibilities.
During the search, it will report how many states it has found and
how many states it has fully explored.
When finished, it lists the total number of states and how many leaves the flexagon has.
At any point during the search, you can pick the _cancel_ button to stop the search.

Alternately, you can tell it not to turn over the flexagon - _explore (no ^)_ - not
shift hinges - _explore (no >)_ - or to not turn it over or shift - _explore (no ^ or >)_.

When determining unique states, it considers states that are rotated and/or flipped
as being the same state.
For example, states `[0, 1, 2]` and `[1, 2, 0]` are considered to be the same state
since the second is the same as the first after applying the rotate right flex `>`.

Note that it won't be practical to explore flexagons with a very large number of states,
though the actual limit depends on your system.

## Viewing states

Once you've invoked an _explore_ option, you can use the next section of the page
to view information about the states it found.

* _show states_: list each state number and its pat structure
* _show visible_: list each state number with the visible leaf ids
* _show labels_: list each state number and the visible leaf labels
* _show flexes_: list each state number, the flexes the state supports,
  and which state a given flex travels to
* _show counts_: list each of the flexes it used to explore
  and how many states allow the flex for at least one hinge
* _group by structure_: cluster all the states into groups that
  share the same pat structure, ignoring leaf ids - use [find cycles](#find-cycles)
  to find flex sequences that cycle between the states in a group

The next few options output a format called
[DOT](https://en.wikipedia.org/wiki/DOT_(graph_description_language)),
which describes a graph where the _nodes_ are _flexagon states_
and the _edges_ are _flexes between those states_.
The graph can be used by tools such as [viz.js](https://viz-js.com/),
which displays a diagram of the resulting graph.
Note, however, that viz.js only works with small graphs.

* _DOT: state to state_: if any flex takes you from state _a_ to _b_,
  create an edge between them
* _DOT: flexes_: similar to _state to state_, except that it creates an edge for
  every flex that takes you between states, coloring common flexes such as _T_ and _S_
* _DOT: directed flexes_: similar to _flexes_, but also adds direction to the edges,
  so if a flex takes you from state _a_ to _b_, the edge will be directed from _a_ to _b_
* _DOT: leaf graph_: create a graph where each _node_ is a _leaf id_
  and an _edge_ connects two nodes if they are _adjacent on a visible face_
  in at least one state

## Visible leaves to state

Use when you have a flexagon in an arbitrary state and you want to figure
which state it's in just given the visible leaf ids.
The input format matches what you see when you pick the _show visible_ button.
Note that it's possible for multiple states to have the same visible leaves,
so it may list multiple state numbers.

This can be useful when your flexagon is mixed up and you want to figure out how to restore it.
You can use this option to find state numbers and
[find sequence between two states](#find-sequence-between-two-states)
to find a flex sequence that will take you back to a desired state.

## Find sequence between two states

This searches for the shortest flex sequence that takes you from one state to another.
The states can either be specified using using [pat notation](pat-notation.md) or state numbers.

The flexes it uses during the search are listed in the box following the `use flexes` text.
It defaults to the same set of flexes as the _explore_ option,
but you can type in any list of supported flexes (separated by spaces).

Picking the _Find_ option will start the search using the specified flexes,
which includes turning over the flexagon and shifting hinges.
You can skip turning it over with _Find (no ^)_ or skip shifting hinges with _Find (no >)_.

## Find disconnected subgraphs

After finding all states accessible using a set of different flexes,
this will count the disconnected subgraphs of various sizes using a single flex.

For example, if you tell it to only use the pinch (`P`) and it lists `3: 1134` and `9: 2`,
this means there are 1134 different subgraphs of size 3 and 2 subgraphs of size 9.
Each subgraph is a set of states where you can pinch flex between each of the
states in the subgraph, but you can't pinch flex to any of the other subgraphs.

## Find cycles

In the [viewing states](#viewing-states) section above,
it described using the `group by structure` button to group all the explored states
by common pat structure.

This turns out to be useful for finding flex sequences that cycle.
Since any sequence that travels between two states in such a group preserves this
pat structure, it means that no matter how many times you apply the sequence,
it will continue to preserve that pat structure,
so it will only travel between other states in the same group.
Thus, it will have to eventually return to the original state, forming a cycle.
Since most flex sequences don't cycle, this is a simple way to find cyclic sequences.
(See the _Structure Preservation Theorem_ in
[The Secret World of Flexagons](https://loki3.github.io/flex/secret.html)
for more background on this result.)

If you type in a state number that's part of one such group and pick `Find`,
it will find the shortest sequence from that state to each of the other states in the group.
It will then report how long the cycle is for each of these flex sequences.

The flexes it uses during the search are listed in the box following the `use flexes` text.
It defaults to the same set of flexes as the _explore_ option,
but you can type in any list of supported flexes (separated by spaces).

As noted earlier, when it searches for all states reachable with a set of flexes,
it considers any states that are simply rotated and/or flipped as equivalent,
which has some implications for how it finds cycles.
One, it doesn't consider flex sequences that only consist of `>`, `<`, and `^`,
since these all result in the same state number.
And two, for groups where the pat structure is symmetric in some way,
the number of states that you can cycle between may be greater than it appears
because intermediate states may be rotated or flipped versions of earlier states.
For example, the flexes `>>`, `^>`, and `^<` all preserve the
pat structure `[ -, [--], -, [--] ]`, rotating and flipping the flexagon.

## Pat rearrangements

Enter in a pat using [pat notation](pat-notation.md) and it will return all states
that have a pat that's a rearrangement of it, if any.
The smallest pat that can be rearranged has 5 leaves,
so this may not find any such states.
