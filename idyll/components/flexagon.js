"use strict";
const React = require('react');

/**
 * The `Flexagon` component displays a flexagon and buttons
 * for applying flexes at each corner
 */

/**
 * FlexButton: a button for applying a flex at a corner
 * props {
 *  onClick(flexes) callback to issue when button is clicked
 *  flex            flex to perform, e.g. Sh
 *  prefix          shifts to perform before flex, e.g. >>
 *  postfix         shifts to perform after flex e.g. <<
 * }
 */
const FlexButton = (props) => {
  const flexes = props.prefix + props.flex + props.postfix;
  return (
    <button onClick={() => props.onClick(flexes)}>{props.flex}</button>
  );
};

/**
 * FlexButtons: all the flexes that can be applied at a corner
 * props {
 *  onClick(flexes) callback to issue when button is clicked
 *  region          RegionForFlexes: { flexes, prefix, postfix, corner, isOnLeft, isOnTop }
 *  width           width of region to put buttons
 * }
 */
const FlexButtons = (props) => {
  if (!props.region) {
    return null;
  }
  const { flexes, prefix, postfix, corner, isOnLeft, isOnTop } = props.region;

  const x = isOnLeft ? props.width - corner.x : corner.x;
  const y = corner.y;
  const xpix = Math.round(x).toString() + 'px';
  const ypix = Math.round(y).toString() + 'px';
  var style = { padding: '8x', position: 'absolute' };
  isOnLeft ? style.right = xpix : style.left = xpix;
  style.top = ypix;

  return <div style={style}>
    {flexes.map(flex =>
      <FlexButton onClick={props.onClick} flex={flex} prefix={prefix} postfix={postfix} key={flex} />)}
  </div>
}

/**
 * Flexagon: displays a flexagon and flex buttons at each corner
 * props {
 *  numPats     number of pats in the flexagon, typically in the range [4, 12]
 * }
 * state {
 *  fm          current FlexagonManager encapsulating Flexagon, History, etc.
 *  regions     RegionForFlexes[] describing buttons for applying flexes
 * }
 */
class Flexagon extends React.Component {
  constructor(props) {
    super(props);
    this.state = { fm: null, regions: [] };
    this.state = this.checkForNewFlexagon(props);
    this.handleFlexes = this.handleFlexes.bind(this);
  }

  checkForNewFlexagon(props) {
    if (this.state.fm && this.state.fm.flexagon.getPatCount() === props.numPats) {
      return null; // not updated
    }
    var fm;
    if (props.numPats === 6) {
      var flexagon = Flexagonator.Flexagon.makeFromTree(Flexagonator.hexaHexaLeafTree);
      fm = Flexagonator.FlexagonManager.make(flexagon, Flexagonator.hexaHexaProperties);
    } else {
      var pats = [];
      for (var i = 1; i <= props.numPats; i++) {
        pats.push(i);
      }
      var flexagon = Flexagonator.Flexagon.makeFromTree(pats);
      fm = Flexagonator.FlexagonManager.make(flexagon);
      fm = Flexagonator.runScriptItem(fm, { flexes: "P*P*P*" });
    }
    return { fm: fm, regions: [] }; // updated
  }

  updateCanvas(fm, shouldUpdateState) {
    const ctx = this.refs.canvas.getContext('2d');
    var regions = Flexagonator.drawEntireFlexagon(this.refs.canvas, fm, { stats: true, structure: true });
    if (shouldUpdateState) {
      this.setState({ fm: fm, regions: regions });
    }
  }

  handleFlexes(flexes) {
    var result = Flexagonator.runScriptItem(this.state.fm, { flexes: flexes });
    if (!Flexagonator.isError(result)) {
      this.updateCanvas(result, true);

      const history = this.state.fm.getFlexHistory().join('');
      this.props.updateProps({ value: history });
    }
  }

  componentWillReceiveProps(props) {
    var state = this.checkForNewFlexagon(props);
    if (state !== null) {
      this.updateCanvas(state.fm, true);
    }
  }

  componentDidMount() {
    this.updateCanvas(this.state.fm, false);
  }

  render() {
    const { width, height } = this.props;
    return (
      <div style={{ position: 'relative' }}>
        <canvas ref="canvas" width={width} height={height} />
        {this.state.regions.map(region =>
          <FlexButtons onClick={this.handleFlexes} region={region} width={width} key={region.corner} />)}
      </div>
    );
  }
}

module.exports = Flexagon;


/**
 * Until Flexagonator is packaged up into modules, paste the compiled .js here
 */
