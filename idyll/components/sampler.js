"use strict";
const React = require('react');
const Flexagon = require('./flexagon');
const Unfolded = require('./unfolded');

/**
 * Sampler: show a flexagon, controls, and an unfolded version
 * props {
 *  generator   flex generating sequence for flexagon, e.g. 'Sh*>>T*^P*'
 *  patType     number of pats in the flexagon, typically in the range [4, 12], plus optional angleType
 *              'i': isosceles, 'r': right #1, 'R': right #2, 's': star #1, or 'S': star #2
 *  patOptions  array of different patType
 * }
 * state {
 *  numPats     number of pats in the flexagon, typically in the range [4, 12]
 *  angleType   'i': isosceles, 'r': right #1, 'R': right #2, 's': star #1, or 'S': star #2
 *  history     contains all the flexes applied to the current flexagon
 *  initial     passed to <Flexagon/>
 *  doNext      used to trigger a single command that will be reset next time
 * }
 */
class Sampler extends React.Component {
  constructor(props) {
    super(props);
    this.updateFromFlexagon = this.updateFromFlexagon.bind(this);
    this.handleNumPats = this.handleNumPats.bind(this);

    const [numPats, angleType] = valueToNumberAndType(props.patType);
    const angles = typeToAngles(numPats, angleType);
    this.state = {
      numPats,
      angleType,
      angles,
      initial: this.buildInitial(numPats, angles, props),
      history: '',
      currentState: 1,
      totalStates: 1,
      doNext: {}
    };
  }

  buildInitial(numPats, angles, props) {
    const { generator } = props;
    const colors = [0x2E4172, 0x2B803E, 0xAA4439, 0x622870, 0xffff00, 0x553900, 0xdddddd, 0x999999];
    const searchFlexes = "F L3 Lh Lk Lbf Lbb Ltf Ltb Ltb' P P44 P333 P334 P55 P3333 P444 P66 Sh St T T' T1 T1' T2 T2' T3 T3' T4 T4' Tt Tk Tw V";
    const initial = [
      { numPats },
      { angles },
      { flexAndColor: { flexes: generator, colors: colors } },
      { reverseFlexes: generator },
      { searchFlexes },
      { history: 'clear' }
    ];
    return initial;
  }

  updateFromFlexagon(newprops) {
    if (newprops.history) {
      this.setState({
        history: newprops.history,
        currentState: newprops.currentState,
        totalStates: newprops.totalStates,
        doNext: {}
      });
    }
  }

  handleHistory(doHistory) {
    if (doHistory === 'reset') {
      this.setState({ history: '' });
    }
    this.setState({ doNext: { doHistory } });
  }

  handleNumPats(e) {
    const value = e.target.value;
    const [numPats, angleType] = valueToNumberAndType(value);
    const angles = typeToAngles(numPats, angleType);

    this.setState({
      numPats,
      angleType,
      angles,
      initial: this.buildInitial(numPats, angles, this.props),
      history: '',
      currentState: 1,
      totalStates: 1,
      doNext: { runInitial: true }
    });
  }

  renderSelectNumPats() {
    const { patOptions } = this.props;
    const { numPats, angleType } = this.state;
    const patType = angleType === 'i' ? numPats : numPats.toString() + angleType;
    return (
      <select value={patType} onChange={this.handleNumPats}>
        {patOptions.map(n => <option value={n} key={n}>{getNumPatsText(n)}</option>)}
      </select>
    );
  }

  renderHistory() {
    const { history } = this.state;
    return (<div>
      <button onClick={e => this.handleHistory('undo')}>Undo</button>
      &nbsp;
      <button onClick={e => this.handleHistory('redo')}>Redo</button>
      &nbsp;
      <button onClick={e => this.handleHistory('reset')}>Reset</button>
      &nbsp;
      {history}
    </div>);
  }

  render() {
    const { generator } = this.props;
    const { numPats, angles, initial, currentState, totalStates, doNext } = this.state;
    const { runInitial, doHistory } = doNext;
    const flexagonOptions = { structure: true, showIds: false, both: true, stats: true };

    return (
      <div>
        Select flexagon type: {this.renderSelectNumPats()}

        <Flexagon updateProps={this.updateFromFlexagon} width={700} height={400} numPats={numPats}
          initialScript={initial} runInitial={runInitial} options={flexagonOptions}
          doHistory={doHistory} overButton={true} />
        Currently in state {currentState} of {totalStates}<br />
        {this.renderHistory()}

        <Unfolded width={1000} height={500} numPats={numPats} angles={angles} generator={generator} />
      </div>
    );
  }
};

// input: a number or a string that consists of a number followed by 'r' or 'R' for right triangles
//    or 's' or 'S' for stars - an upper case letter rotates the flexagon by one vertex
// output: [number, 'i' | 'r' | 'R' | 's' | 'S']
function valueToNumberAndType(value) {
  let numPats = 6;
  let angleType = 'i';  // isosceles

  if (typeof (value) === "number") {
    numPats = value;
  } else if (typeof (value) === "string") {
    numPats = parseInt(value);

    const which = value[value.length - 1];
    if (which === 'r' || which === 'R' || which === 's' || which === 'S') {
      // right triangle or star
      angleType = which;
    }
  }
  return [numPats, angleType];
}

function typeToAngles(numPats, angleType) {
  switch (numPats) {
    case 4: return angleType === 'r' ? [90, 45] : undefined;
    case 5: return undefined;
    case 6: return angleType === 'r' ? [60, 30] : angleType === 'R' ? [60, 90] : undefined;
    case 7: return undefined;
    case 8: return angleType === 'r' ? [45, 45] : angleType === 'R' ? [45, 90] : undefined;
    case 9: return undefined;
    case 10: return angleType === 'r' ? [36, 54] : angleType === 'R' ? [36, 90] : angleType === 's' ? [36, 36] : angleType === 'S' ? [36, 108] : undefined;
    case 11: return undefined;
    case 12: return angleType === 'r' ? [30, 60] : angleType === 'R' ? [30, 90] : angleType === 's' ? [30, 30] : angleType === 'S' ? [30, 120] : undefined;
  }
}

function getNumPatsText(n) {
  switch (n) {
    case 4: return "4: tetraflexagon";
    case '4r': return "4: silver tetraflexagon #1";
    case '4R': return "4: silver tetraflexagon #2";
    case 5: return "5: pentaflexagon";
    case 6: return "6: hexaflexagon";
    case '6r': return "6: bronze hexaflexagon #1";
    case '6R': return "6: bronze hexaflexagon #2";
    case 7: return "7: heptaflexagon";
    case 8: return "8: octaflexagon";
    case '8r': return "8: silver octaflexagon #1";
    case '8R': return "8: silver octaflexagon #2";
    case 9: return "9: enneaflexagon";
    case 10: return "10: decaflexagon";
    case '10r': return "10: right decaflexagon #1";
    case '10R': return "10: right decaflexagon #2";
    case '10s': return "10: star decaflexagon #1";
    case '10S': return "10: star decaflexagon #2";
    case 11: return "11: undecaflexagon";
    case 12: return "12: decaflexagon";
    case '12r': return "12: right decaflexagon #1";
    case '12R': return "12: right decaflexagon #2";
    case '12s': return "12: star decaflexagon #1";
    case '12S': return "12: star decaflexagon #2";
  }
  return n.toString();
}

module.exports = Sampler;
