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
  return <div style={{ position: 'absolute', right: '46px', bottom: '50px' }}>
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
 *  numPats       create a new flexagon with the given number of pats, typically in [4, 12]
 *  initialScript script to run when numPats is changed or 'runInitial' is set to true
 *  runInitial    set to true to rerun the inital script
 *  flexes        flexes to apply to the current flexagon, e.g. 'Sh*>>T*^P*'
 *  runScript     set to true when the 'script' property should be run
 *  script        a flexagonator script to run on the current flexagon
 *  options       options used when drawing (passed to drawEntireFlexagon)
 *  overButton    true to include a button for turning over the flexagon
 *  width         width of canvas to draw in
 *  height        height of canvas to draw in
 *  history       a read-only property reflecting all the flexes applied to the flexagon
 *  error         a read-only property indicating an error when processing a script
 * }
 * state {
 *  fm            current FlexagonManager encapsulating Flexagon, History, etc.
 *  regions       RegionForFlexes[] describing buttons for applying flexes
 * }
 */
class Flexagon extends React.Component {
  constructor(props) {
    super(props);
    this.handleFlexes = this.handleFlexes.bind(this);

    var script = this.buildScript(props);
    var fm = Flexagonator.runScript(null, script);
    this.updateHistoryProps(fm);
    const regions = Flexagonator.getButtonRegions(fm, props.width, props.height, true);
    this.state = { fm: fm, regions: regions };
  }

  buildScript(props) {
    var script = [];

    if (props.numPats && (!this.state || !this.state.fm || this.state.fm.flexagon.getPatCount() != props.numPats)) {
      script = script.concat({ numPats: props.numPats });
      if (props.initialScript) {
        script = script.concat(props.initialScript);
      }
    }
    if (props.runInitial && props.initialScript) {
      if (props.numPats) {
        script = script.concat({ numPats: props.numPats });
      }
      script = script.concat(props.initialScript);
      this.props.updateProps({ runInitial: null });
    }
    if (props.flexes) {
      script = script.concat({ flexes: props.flexes });
      this.props.updateProps({ flexes: null });
    }
    if (props.runScript && props.script) {
      script = script.concat(props.script);
      this.props.updateProps({ runScript: null });
    }

    return script;
  }

  applyScript(script) {
    var fm = Flexagonator.runScript(this.state.fm, script);
    if (Flexagonator.isFlexError(fm)) {
      this.props.updateProps({ error: 'error in flex sequence' });
      return null;
    } else {
      this.props.updateProps({ error: undefined });
    }
    Flexagonator.drawEntireFlexagon(this.refs.canvas, fm, this.props.options);
    this.updateHistoryProps(fm);
    const regions = Flexagonator.getButtonRegions(fm, this.props.width, this.props.height, true);
    this.setState({ fm: fm, regions: regions });
  }

  handleFlexes(flexes) {
    this.applyScript([{ flexes: flexes }]);
  }

  updateHistoryProps(fm) {
    var history = fm.getFlexHistory().join('');
    this.props.updateProps({ history: history });
  }

  componentWillReceiveProps(props) {
    var script = this.buildScript(props);
    if (script.length) {
      this.applyScript(script);
    }
  }

  componentDidMount() {
    Flexagonator.drawEntireFlexagon(this.refs.canvas, this.state.fm, this.props.options);
  }

  render() {
    const { width, height } = this.props;
    return (
      <div style={{ position: 'relative', width: width, height: height }}>
        <canvas ref="canvas" width={width} height={height} />
        {this.state.regions.map((region, i) =>
          <FlexButtons onClick={this.handleFlexes} region={region} width={width} height={height} key={i} />)}
        <OverButton onClick={this.handleFlexes} display={this.props.overButton} />
      </div>
    );
  }
}

module.exports = Flexagon;


/**
 * Until Flexagonator is packaged up into modules, paste the compiled .js here
 */
