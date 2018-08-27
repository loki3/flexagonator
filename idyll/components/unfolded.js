"use strict";
const React = require('react');

/**
 * Unfolded: displays an unfolded flexagon
 * props {
 *  numPats     number of pats in the flexagon, typically in the range [4, 12]
 *  generator   flex generating sequence for flexagon, e.g. 'Sh*>>T*^P*'
 *  width       width of canvas to draw in
 *  height      height of canvas to draw in
 * }
 */
class Unfolded extends React.Component {
  componentDidMount() {
    this.updateCanvas(this.props);
  }

  componentWillReceiveProps(props) {
    this.updateCanvas(props);
  }

  updateCanvas(props) {
    const { numPats, generator } = props;
    var pats = [];
    for (var i = 1; i <= numPats; i++) {
      pats.push(i);
    }
    const flexagon = Flexagonator.Flexagon.makeFromTree(pats);
    var fm = Flexagonator.FlexagonManager.make(flexagon);
    fm = Flexagonator.runScriptItem(fm, { flexes: generator });

    Flexagonator.drawUnfolded(this.refs.canvas, fm, { content: Flexagonator.StripContent.FoldingAndIds });
  }

  render() {
    const { width, height } = this.props;
    return (
      <canvas ref="canvas" width={width} height={height} />
    );
  }
};

module.exports = Unfolded;


/**
 * Until Flexagonator is packaged up into modules, paste the compiled .js here
 */
