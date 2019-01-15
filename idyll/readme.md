# Idyll and Flexagonator

[Idyll](https://idyll-lang.org/) is a system that allows you to build interactive web pages using
[Markdown](https://en.wikipedia.org/wiki/Markdown) and [React](https://reactjs.org/) components.
This subproject wraps Flexagonator in a React component so interactive explanations are easy to create.

To build:

* follow the directions at [getting started](https://idyll-lang.org/docs/getting-started) to install Idyll
* run `npm install` in the *flexagonator/idyll* directory
* make sure the `.idyll` file you're interested in is renamed to `index.idyll`
* at a command prompt, switch into the idyll subdirectory of flexagonator and type `idyll`

Note: Until Flexagonator is packaged as modules, you'll first need to build it and paste
the resulting build/out.js file into the bottom of idyll/components/flexagon.js file.
