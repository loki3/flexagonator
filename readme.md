# Flexagonator

*Flexagonator* is a flexagon simulator.
Flexagons are origami-like puzzles folded from strips of paper, which can then be "flexed" into a variety of kaleidoscopic arrangements.
At their simplest, you can easily cycle through various states.
At their most complex, it can be more challenging than a Rubik's Cube(tm) to get them back to their original state.

Some of its features:

* Supports a wide variety of triangle flexagons, from 4 triangles per face to 12 per face or more, made up of any shape of traingle
* Displays the flexagon, the visible leaves, and information about the internal structure
* Figures out which flexes are possible and allows you to interactively pick flexes to perform
* Creates new flexagons using "flex generating sequences" for generating the structure necessary to perform the given flexes
* Displays the unfolded strip of paper corresponding to the current flexagon
* Searches for all the states accessible given a specified set of flexes
* Can figure out the series of flexes needed to get from one state to another


## Building and running

* Prerequisites: [Visual Studio Code](https://code.visualstudio.com/Download) and [npm](https://www.npmjs.com/get-npm)
* Clone the repository, e.g. `git clone https://github.com/loki3/flexagonator.git`
* Install dependencies, e.g. `npm install`
* Build the Typescript project, e.g. use Visual Studio Code and choose *Terminal > Run Build Task*
* Load one of the sample HTML files, e.g. index.html


## Directories

* *.vscode:* files that support working on Flexagonator using Visual Studio Code
* *custom:* sample HTML files that use the Flexagonator API to create interactive flexagon tools
* *docs:* documentation for the Flexagonator API and the notation used to describe flexagons and flexes
* *idyll:* the source for [Explorable Flexagons](http://loki3.com/flex/explore/),
  an interactive book built using [Idyll](https://idyll-lang.org/) and Flexagonator
* *src:* the source for Flexagonator
* *test:* tests for validating Flexagonator


## For more information

* [Flexagonator documentation](docs/readme.md)
* [The Secret World of Flexagons](https://loki3.github.io/flex/secret.html)
  A book that covers a wide variety of flexagons and flexes,
  discusses how to use them in art and puzzles,
  and delves into the mathematics behind them so you can design your own.
* [Flexagon Theory](http://loki3.com/flex/g4g10/Flex-Theory.pdf):
  Background on the flex and pat notations used in the program
* [Main flexagon page](http://loki3.com/flex/)
  A large variety of different flexes, flexagon templates, and flexagon theory
