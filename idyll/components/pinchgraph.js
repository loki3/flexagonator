"use strict";
const React = require('react');

/**
 * PinchGraph: displays a graph of a flexagon's pinch flexes
 * props {
 *  generator   flex generating sequence for flexagon, e.g. "P*>P*"
 *  flexes      sequence of flexes in {P,P',^,>,<}, e.g. "P^>P"
 *  width       width of canvas to draw in
 *  height      height of canvas to draw in
 * }
 */
class PinchGraph extends React.Component {
  componentDidMount() {
    this.updateCanvas(this.props);
  }

  componentWillReceiveProps(props) {
    this.updateCanvas(props);
  }

  updateCanvas(props) {
    const { generator, flexes } = props;

    const flexagon = Flexagonator.Flexagon.makeFromTree([1, 2, 3, 4, 5, 6]);
    var fm = Flexagonator.FlexagonManager.make(flexagon);
    if (generator) {
      fm = Flexagonator.runScript(fm, [{ flexes: generator }, { reverseFlexes: generator }]);
    }

    if (!Flexagonator.isError(fm)) {
      const traverse = Flexagonator.findTuckermanTraverse(fm.flexagon);
      Flexagonator.drawPinchGraph(this.refs.canvas, { traverse: traverse, flexes: flexes, drawEnds: true });
    }
  }

  showError() {
  }

  render() {
    const { width, height } = this.props;
    return (
      <canvas ref="canvas" width={width} height={height} />
    );
  }
};

module.exports = PinchGraph;


/**
 * Until Flexagonator is packaged up into modules, paste the compiled .js here
 */
