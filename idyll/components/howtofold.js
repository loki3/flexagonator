"use strict";
const React = require('react');

/**
 * HowToFold: provides directions for folding a flexagon
 * props {
 *  hasBoth   true: big numbers are labels, smaller grey numbers are folding
 *            false: numbers are both labels & folding
 *  result    e.g. 'a hexagon consisting of 6 regular triangles'
 * }
 */
class HowToFold extends React.Component {
  render() {
    const { hasBoth, result } = this.props;

    const toNumber = hasBoth ?
      "The dark pair of numbers represent the numbers you see on the corresponding flexagon."
      + " The grey pair below those numbers describe the order that you should fold the leaves in."
      + " For both the dark and light numbers, the large number applies to the front of the leaf while the small number applies to the back."
      + " Copy the smaller of each pair to the back of the flexagon."
      :
      "The large number on each triangle represents the number on the front of the triangle,"
      + " while the small number represents the number on the back."
      + " Copy the small number from each triangle onto its backside.";
    const toFold = hasBoth ?
      "Use the light grey numbers as guides for folding the flexagon. "
      :
      "";

    const youNowHave = result || "a completed polygon";

    return (
      <div>
        <p>
          You might want to start by right-clicking on the image and picking 'Save Image' in order to view the template separately from the rest of the page.
        </p>
        <p>
          <b>Cut:</b> Start by printing out the template and cutting along the outside edges.
        </p>
        <p>
          <b>Prefold:</b> After you've cut out the shape, fold and unfold along every dashed line to prepare it.
          Note that the first and last triangle in the template have dashed lines to indicate where to tape the edges after everything is folded.
        </p>
        <p>
          <b>Number:</b> {toNumber}
        </p>
        <p>
          <b>Fold:</b> {toFold}
          Find the largest pairs of adjacent numbers and fold those numbers together.
          Then find the next largest pairs of adjacent numbers and fold them together.
          Continue in this way until the only numbers still visible are the 1's and the 2's.
        </p>
        <p>
          <b>Tape:</b> You should now have {youNowHave}.
          Tape the edges of the first and last triangles together to complete the flexagon.
        </p>
      </div >
    );
  }
};

module.exports = HowToFold;
