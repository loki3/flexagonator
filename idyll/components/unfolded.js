"use strict";
const React = require('react');

/**
 * Unfolded: displays an unfolded flexagon
 * props {
 *  numPats     number of pats in the flexagon, typically in the range [4, 12]
 *  generator   flex generating sequence for flexagon, e.g. 'Sh*>>T*^P*'
 *  autoLabel   automatically label the sides based on the generating sequence
 *  options     options used when drawing (passed to drawUnfolded)
 *  width       width of canvas to draw in
 *  height      height of canvas to draw in
 *  changeHeight change the height after creation
 * }
 */
class Unfolded extends React.Component {
  componentDidMount() {
    this.updateCanvas(this.props);
  }

  componentWillReceiveProps(props) {
    if (props.changeHeight && this.refs.canvas) {
      this.refs.canvas.height = props.changeHeight;
      this.props.updateProps({ changeHeight: null });
    }

    this.updateCanvas(props);
  }

  updateCanvas(props) {
    const { numPats, generator, autoLabel } = props;
    if (!numPats) {
      return;
    }
    var pats = [];
    for (var i = 1; i <= numPats; i++) {
      pats.push(i);
    }
    const flexagon = Flexagonator.Flexagon.makeFromTree(pats);
    var fm = Flexagonator.FlexagonManager.make(flexagon);

    var options = props.options;
    if (autoLabel) {
      fm = Flexagonator.runScriptItem(fm, { flexAndColor: { flexes: generator } });
      if (!options) {
        options = {}
      }
      options.content = Flexagonator.StripContent.LeafLabels;
    } else {
      fm = Flexagonator.runScriptItem(fm, { flexes: generator });
    }

    Flexagonator.drawUnfolded(this.refs.canvas, fm, options);
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
