"use strict";
const React = require('react');

/**
 * Unfolded: displays an unfolded flexagon
 * props {
 *  numPats     number of pats in the flexagon, typically in the range [4, 12]
 *  angles      center angle and the angle clockwise from the center, e.g. [30, 60]
 *  generator   flex generating sequence for flexagon, e.g. 'Sh*>>T*^P*'
 *  autoLabel   automatically label the sides based on the generating sequence
 *  script      a flexagonator script to run to create the flexagon used for the unfolded strip
 *              used instead of numPats, angles, generator, & autoLabel
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
    const { numPats, generator, autoLabel, angles, script, endText } = props;
    if (!numPats && !script) {
      return;
    }
    let options = props.options;

    let fm;
    if (script) {
      fm = Flexagonator.runScriptString(fm, script);
    } else if (numPats) {
      // numPats, angles, generator, & autoLabel
      let pats = [];
      for (var i = 1; i <= numPats; i++) {
        pats.push(i);
      }
      const flexagon = Flexagonator.Flexagon.makeFromTree(pats);
      fm = Flexagonator.FlexagonManager.make(flexagon);

      if (angles && angles[0] && angles[1]) {
        fm.setAngles(angles[0], angles[1]);
      } else {
        fm.setIsosceles();
      }

      if (autoLabel) {
        fm = Flexagonator.runScriptItem(fm, { flexAndColor: { flexes: generator } });
        if (!options) {
          options = {}
        }
        options.content = Flexagonator.StripContent.LeafLabels;
      } else {
        fm = Flexagonator.runScriptItem(fm, { flexes: generator });
      }
    }

    if (endText) {
      if (!options) {
        options = {}
      } else {
        options = Object.create(options);
      }
      options.captions = [{ text: endText, which: 0 }, { text: endText, which: -1 }];
    }

    if (options && typeof options.content === 'string') {
      options.content = Number.parseInt(options.content);
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
