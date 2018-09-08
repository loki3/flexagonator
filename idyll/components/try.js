"use strict";
const React = require('react');

/**
 * An experiment
 * props {
 *  width       width of canvas to draw in
 *  height      height of canvas to draw in
 * }
 * state {
 *  fm          current FlexagonManager encapsulating Flexagon, History, etc.
 * }
 */

class Try extends React.Component {
  constructor(props) {
    super(props);

    var fm = Flexagonator.runScriptItem(null, { numPats: 7 });
    this.state = { fm: fm };
  }

  componentDidMount() {
    Flexagonator.drawEntireFlexagon(this.refs.canvas, this.state.fm);
  }

  render() {
    const { width, height } = this.props;
    return (
      <canvas ref="canvas" width={width} height={height} />
    );
  }
}


module.exports = Try;

