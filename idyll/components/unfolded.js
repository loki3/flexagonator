"use strict";
const React = require('react');

/**
 * Unfolded: displays an unfolded flexagon
 * props {
 *  numPats     number of pats in the flexagon, typically in the range [4, 12]
 *  angles      center angle and the angle clockwise from the center, e.g. [30, 60]
 *  generator   flex generating sequence for flexagon, e.g. 'Sh*>>T*^P*'
 *  autoLabel   automatically label the sides based on the generating sequence
 *  endText     text to put at the start & end of the strip
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
    const { numPats, generator, autoLabel, angles, endText } = props;
    if (!numPats) {
      return;
    }
    var pats = [];
    for (var i = 1; i <= numPats; i++) {
      pats.push(i);
    }
    const flexagon = Flexagonator.Flexagon.makeFromTree(pats);
    var fm = Flexagonator.FlexagonManager.make(flexagon);

    if (angles) {
      fm.setAngles(angles[0], angles[1]);
    } else {
      fm.setIsosceles();
    }

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

    if (endText) {
      if (!options) {
        options = {}
      } else {
        options = Object.create(options);
      }
      options.captions = [{ text: endText, which: 0 }, { text: endText, which: -1 }];
    }

    if (!Flexagonator.isError(fm)) {
      Flexagonator.drawUnfolded(this.refs.canvas, fm, options);
    }
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
