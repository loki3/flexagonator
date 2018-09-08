"use strict";
const React = require('react');

/**
 * An experiment
 * props {
 *  script      a flexagonator script to run
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

  componentWillReceiveProps(props) {
    if (props.script) {
      var fm = Flexagonator.runScript(this.state.fm, props.script);
      if (!Flexagonator.isFlexError(fm)) {
        Flexagonator.drawEntireFlexagon(this.refs.canvas, fm);

        this.props.updateProps({ script: null });
        this.setState({ fm: fm });
      }
    }
  }

  render() {
    const { width, height } = this.props;
    return (
      <canvas ref="canvas" width={width} height={height} />
    );
  }
}


module.exports = Try;

