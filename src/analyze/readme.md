# Analyze

Various routines for analyzing flexes on flexagons.

* [CheckEqual.ts](CheckEqual.ts) - check if two flex sequences have the same effect on a given flexagon
* [CountFlexes.ts](CountFlexes.ts) - count the number of states that support each flex
* [Explore.ts](Explore.ts) - explore all the states of flexagon starting from an initial state and applying any of a given set of flexes
* [FindEqualFlexes.ts](FindEqualFlexes.ts) - check if a flex can be expressed as a sequence of other flexes. If so, get the shortest sequence.
* [FindShortest.ts](FindShortest.ts) - search for the shortest flex sequence from a starting state to an ending state using a given set of sequences
* [FindSubgraphs.ts](FindSubgraphs.ts) - given a graph of flexes and states, break it into the subgraphs that can be fully accessed by a list of flexes
* [FlexGraph.ts](FlexGraph.ts) - information about a graph of flexagons (nodes) and flexes (edges)
* [FlexToGraph.ts](FlexToGraph.ts) - take a description of all the flexes that can be performed from each state and create a graph of flexagons (nodes) and flexes (edges)
* [GraphToDot.ts](GraphToDot.ts) - create a [DOT](https://en.wikipedia.org/wiki/DOT_(graph_description_language)) graph of the state-to-state transitions
* [GroupFromSequences.ts](GroupFromSequences.ts) - given a set of flex sequences on a flexagon, check if they form a group; if so, return info about the group; if not, give a reason why not
* [PinchGraph.ts](PinchGraph.ts) - build up the graph traversed by the given sequence of flexes, where flexes must be one of {P, P', ^, <, >}
* [RelativeFlex.ts](RelativeFlex.ts) - describes a flex relative to the current hinge, possibly rotating & turning over, and what state it leads to
* [TrackerStructure.ts](TrackerStructure.ts) - categorize a list of flexagons by their structure (ignoring leaf ids) and return the collected flexagon indices
* [TuckermanTraverse.ts](TuckermanTraverse.ts) - find the Tuckerman traverse for a given flexagon, which is a flex sequence of pinches and rotates that visits every state and returns to the beginning
