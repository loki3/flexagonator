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
  const prefix = props.prefix ? props.prefix : '';
  const postfix = props.postfix ? props.postfix : '';
  const flexes = prefix + props.flex + postfix;
  return (
    <button onClick={() => props.onClick(flexes)}>{props.flex}</button>
  );
};

/**
 * OverButton: a button for turning over the flexagon
 * props {
 *  onClick(flexes) callback to issue when button is clicked
 *  display         true to display the button, false otherwise
 * }
 */
const OverButton = (props) => {
  if (!props.display) {
    return null;
  }
  return <div style={{ position: 'absolute', left: '10px', bottom: '40px' }}>
    <FlexButton onClick={props.onClick} flex={'^'} key={'^'} />
  </div>
}

/**
 * FlexButtons: all the flexes that can be applied at a corner
 * props {
 *  onClick(flexes) callback to issue when button is clicked
 *  region          RegionForFlexes: { flexes, prefix, postfix, corner, isOnLeft, isOnTop }
 *  width           width of parent region
 *  height          height of parent region
 * }
 */
const FlexButtons = (props) => {
  if (!props.region) {
    return null;
  }
  const { flexes, prefix, postfix, corner, isOnLeft, isOnTop } = props.region;

  const x = isOnLeft ? props.width - corner.x : corner.x;
  const y = isOnTop ? props.height - corner.y : corner.y;
  const xpix = Math.round(x).toString() + 'px';
  const ypix = Math.round(y).toString() + 'px';
  var style = { position: 'absolute' };
  isOnLeft ? style.right = xpix : style.left = xpix;
  isOnTop ? style.bottom = ypix : style.top = ypix;

  return <div style={style}>
    {flexes.map(flex =>
      <FlexButton onClick={props.onClick} flex={flex} prefix={prefix} postfix={postfix} key={flex} />)}
  </div>
}

/**
 * Flexagon: displays a flexagon and flex buttons at each corner
 * props {
 *  numPats     number of pats in the flexagon, typically in the range [4, 12]
 *  generator   flex generating sequence for flexagon, e.g. 'Sh*>>T*^P*'
 *  script      a flexagonator script to run
 *  options     options used when drawing (passed to drawEntireFlexagon)
 *  overButton  true to include a button for turning over the flexagon
 *  width       width of canvas to draw in
 *  height      height of canvas to draw in
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
    var pats = [];
    for (var i = 1; i <= props.numPats; i++) {
      pats.push(i);
    }
    const flexagon = Flexagonator.Flexagon.makeFromTree(pats);
    var fm = Flexagonator.FlexagonManager.make(flexagon);
    if (this.props.generator) {
      fm = Flexagonator.runScriptItem(fm, { flexes: this.props.generator });
    }
    if (this.props.script) {
      fm = Flexagonator.runScript(fm, this.props.script);
    }
    this.updateHistoryProps();
    return { fm: fm, regions: [] }; // updated
  }

  updateCanvas(fm, shouldUpdateState) {
    var regions = Flexagonator.drawEntireFlexagon(this.refs.canvas, fm, this.props.options);
    if (shouldUpdateState) {
      this.setState({ fm: fm, regions: regions });
    }
  }

  handleFlexes(flexes) {
    var result = Flexagonator.runScriptItem(this.state.fm, { flexes: flexes });
    if (!Flexagonator.isError(result)) {
      this.updateCanvas(result, true);
      this.updateHistoryProps();
    }
  }

  updateHistoryProps() {
    var history = '';
    if (this.state.fm) {
      history = this.state.fm.getFlexHistory().join('');
      // subtract out the generating sequence at the start
      history = history.substring(this.props.generator.length);
    }
    this.props.updateProps({ value: history });
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
      <div style={{ position: 'relative', width: width, height: height }}>
        <canvas ref="canvas" width={width} height={height} />
        {this.state.regions.map(region =>
          <FlexButtons onClick={this.handleFlexes} region={region} width={width} height={height} key={region.corner} />)}
        <OverButton onClick={this.handleFlexes} display={this.props.overButton} />
      </div>
    );
  }
}

module.exports = Flexagon;


/**
 * Until Flexagonator is packaged up into modules, paste the compiled .js here
 */
