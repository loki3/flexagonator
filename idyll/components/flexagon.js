"use strict";
const React = require('react');

/**
 * The `Flexagon` component displays a flexagon and buttons
 * for applying flexes at each hinge
 */

/**
 * FlexButton: a button for applying a flex at a hinge
 * props {
 *  onClick(flexes) callback to issue when button is clicked
 *  flex            flex to perform, e.g. S
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
 * FlexButtons: all the flexes that can be applied at a hinge (or "corner")
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
 * Flexagon: displays a flexagon and flex buttons at each hinge
 * props {
 *  numPats       create a new flexagon with the given number of pats, typically in [4, 12]
 *  initialScript script to run when numPats is changed or 'runInitial' is set to true
 *  runInitial    set to true to rerun the inital script
 *  flexes        flexes to apply to the current flexagon, e.g. 'S*>>T*^P*'
 *  doHistory     'undo' | 'redo' | 'clear' | 'reset'
 *  runScript     set to true when the 'script' property should be run
 *  script        a flexagonator script to run on the current flexagon (either objects or a string)
 *  options       options used when drawing (passed to drawEntireFlexagon)
 *  overButton    true to include a button for turning over the flexagon
 *  interpolate   undefined | 'never' | 'justColor' | 'colorAndLabel' - interpolate new leaf properties - default: undefined
 *  width         width of canvas to draw in
 *  height        height of canvas to draw in
 *  history       a read-only property reflecting all the flexes applied to the flexagon
 *  error         a read-only property indicating an error when processing a script
 *  currentScript a read-only property containing a script describing the current state
 *  currentState  a read-only property listing which of the states we've visited we're currently in
 *  totalStates   a read-only property listing the total number of states we've visited
 *  updateProps   a function to call when the component updates its properties
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

    const script = this.buildScript(props);
    const fm = Flexagonator.runScript(null, script);
    if (props.interpolate !== undefined) {
      fm.interpolateNewLeaves = props.interpolateNewLeaves;
    }
    this.updateHistoryProps(fm);
    const generate = this.props.options ? this.props.options.generate : false;
    const regions = Flexagonator.getButtonRegions(fm, props.width, props.height, true, generate);
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
    if (props.doHistory) {
      script = script.concat({ history: props.doHistory });
      this.props.updateProps({ doHistory: null });
    }
    if (props.runScript && props.script) {
      const actual = this.getAsScript(props.script);
      if (actual === '') {
        return actual;
      }
      script = script.concat(actual);
      this.props.updateProps({ runScript: null });
    }

    return script;
  }

  getAsScript(script) {
    if (typeof script !== 'string') {
      return script;
    }

    try {
      return JSON.parse(script);
    } catch (error) {
      this.props.updateProps({ error: 'error reading script' });
      return '';
    }
  }

  applyScript(script) {
    const fm = Flexagonator.runScript(this.state.fm, script);
    if (this.props.interpolate !== undefined) {
      fm.interpolateNewLeaves = this.props.interpolateNewLeaves;
    }
    if (Flexagonator.isFlexError(fm)) {
      this.props.updateProps({ error: 'error in flex sequence' });
      return null;
    } else {
      this.props.updateProps({ error: undefined });
    }
    Flexagonator.drawEntireFlexagon(this.refs.canvas, fm, this.props.options);
    this.updateHistoryProps(fm);
    const generate = this.props.options ? this.props.options.generate : false;
    const regions = Flexagonator.getButtonRegions(fm, this.props.width, this.props.height, true, generate);
    this.setState({ fm: fm, regions: regions });
  }

  handleFlexes(flexes) {
    this.applyScript([{ flexes: flexes }]);
  }

  updateHistoryProps(fm) {
    const history = fm.getFlexHistory().join('');
    const currentScript = this.stringify(Flexagonator.makeScript(fm));
    const currentState = fm.getCurrentState() + 1;
    const totalStates = fm.getTotalStates();
    this.props.updateProps({ history, currentScript, currentState, totalStates });
  }

  stringify(script) {
    const pieces = script.map(item => '  ' + JSON.stringify(item));
    return '[\n' + pieces.join(',\n') + '\n]';
  }

  componentWillReceiveProps(props) {
    const script = this.buildScript(props);
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
