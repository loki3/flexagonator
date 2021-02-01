"use strict";
const React = require('react');
const Flexagon = require('./flexagon');
const Unfolded = require('./unfolded');

/**
 * Sampler: show a flexagon, controls, and an unfolded version
 * props {
 *  generator   flex generating sequence for flexagon, e.g. 'S*>>T*^P*'
 *  patType     default number of pats in the flexagon, typically in the range [4, 12], plus optional angleType
 *              'i': isosceles, 'r': right #1, 'R': right #2, 's': star #1, or 'S': star #2, 'e': equilateral
 *  patOptions  array of different patTypes that can be switched between
 *  split       [optional] draw the unfolded strip in 2 pieces, split at the given leaf; could be a number or array
 *  scale       [optional] use the given scale for both strips; could be a number or array
 * }
 * state {
 *  numPats     number of pats in the flexagon, typically in the range [4, 12]
 *  angleType   'i': isosceles, 'r': right #1, 'R': right #2, 's': star #1, or 'S': star #2, 'e': equilateral
 *  angles      [center angle, clockwise angle]
 *  actualAngles the angles may get rotated as a result of various flexes - use these for the unfolded flexagon
 *  selected    which of the patOptions is currently selected
 *  history     contains all the flexes applied to the current flexagon
 *  initial     passed to <Flexagon/>
 *  currentState which state the flexagon is currently in
 *  totalStates how many total states have been found in the flexagon
 *  doNext      used to trigger a single command that will be reset next time
 * }
 */
class Sampler extends React.Component {
  constructor(props) {
    super(props);
    this.updateFromFlexagon = this.updateFromFlexagon.bind(this);
    this.handleFlexagonType = this.handleFlexagonType.bind(this);

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
    let searchFlexes = "F L3 Lh Lh' Lk Lbf Lbf' Lbb Lbb' Ltf Ltb Ltb' P P44 P333 P334 P55 P3333 P444 P66 S T T' T1 T1' T2 T2' T3 T3' T4 T4' Ttf Ttf' Tk Tk' Tw V";
    if (numPats !== 5) {
      searchFlexes += " St";
    }
    if (generator === 'Tf+') {
      searchFlexes += " Tf";
    }
    const flexes = generator === 'T1+' && numPats === 6 ? 'T+' : generator;

    const initial = [
      { numPats },
      { angles },
      { flexAndColor: { flexes: flexes, colors: colors } },
      { reverseFlexes: flexes },
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
    if (newprops.currentScript) {
      const actualAngles = JSON.parse(newprops.currentScript).filter(n => n.angles !== undefined)[0].angles;

      if (this.state.actualAngles === undefined ||
        actualAngles[0] !== this.state.actualAngles[0] || actualAngles[1] !== this.state.actualAngles[1]) {
        this.setState({ actualAngles });
      }
    }
  }

  handleHistory(doHistory) {
    if (doHistory === 'reset') {
      this.setState({ history: '' });
    }
    this.setState({ doNext: { doHistory } });
  }

  handleFlexagonType(e) {
    const value = e.target.value;
    const [numPats, angleType] = valueToNumberAndType(value);
    const angles = typeToAngles(numPats, angleType);

    this.setState({
      numPats,
      angleType,
      angles,
      selected: e.target.selectedIndex,
      initial: this.buildInitial(numPats, angles, this.props),
      history: '',
      currentState: 1,
      totalStates: 1,
      doNext: { runInitial: true }
    });
  }

  renderFlexagonType() {
    const { patOptions } = this.props;
    const { numPats, angleType } = this.state;
    const patType = angleType === 'i' ? numPats : numPats.toString() + angleType;
    return (
      <select value={patType} onChange={this.handleFlexagonType}>
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

  renderUnfolded() {
    const { generator, split, scale } = this.props;
    const { numPats, actualAngles, selected } = this.state;
    const flexes = generator === 'T1+' && numPats === 6 ? 'T+' : generator;
    if (split === undefined || scale === undefined) {
      return <Unfolded width={1000} height={500} numPats={numPats} angles={actualAngles} generator={flexes} endText={flexes} />;
    }

    const where = typeof (split) === 'number' ? split : selected === undefined ? split[0] : split[selected];
    const theScale = typeof (scale) === 'number' ? scale : selected === undefined ? scale[0] : scale[selected];
    if (where === undefined) {
      return <Unfolded width={1000} height={500} numPats={numPats} angles={actualAngles} generator={flexes} endText={flexes} />;
    }

    const options1 = { scale: theScale, end: where, captions: [{ text: flexes, which: 0 }, { text: 'a', which: -1 }] };
    const options2 = { scale: theScale, start: where + 1, captions: [{ text: flexes, which: -1 }, { text: 'a', which: 0 }] };
    return (<div>
      <Unfolded width={1000} height={500} numPats={numPats} angles={actualAngles} generator={flexes} options={options1} />
      <Unfolded width={1000} height={500} numPats={numPats} angles={actualAngles} generator={flexes} options={options2} />
    </div>);
  }

  render() {
    const { numPats, initial, currentState, totalStates, doNext } = this.state;
    const { runInitial, doHistory } = doNext;
    const flexagonOptions = { structure: true, showIds: false, both: true, stats: true };

    return (
      <div>
        Select flexagon type: {this.renderFlexagonType()}

        <Flexagon updateProps={this.updateFromFlexagon} width={700} height={400} numPats={numPats}
          initialScript={initial} runInitial={runInitial} options={flexagonOptions}
          doHistory={doHistory} overButton={true} />
        Currently in state {currentState} of {totalStates}<br />
        {this.renderHistory()}
        {this.renderUnfolded()}
      </div>
    );
  }
};

// input: a number or a string that consists of a number followed by 'r' or 'R' for right triangles
//    or 's' or 'S' for stars - an upper case letter rotates the flexagon by one hinge
// output: [number, 'i' | 'r' | 'R' | 's' | 'S' | 'e']
function valueToNumberAndType(value) {
  let numPats = 6;
  let angleType = 'i';  // isosceles

  if (typeof (value) === "number") {
    numPats = value;
  } else if (typeof (value) === "string") {
    numPats = parseInt(value);

    const which = value[value.length - 1];
    if (which === 'r' || which === 'R' || which === 's' || which === 'S' || which === 'e') {
      // right triangle or star
      angleType = which;
    }
  }
  return [numPats, angleType];
}

function typeToAngles(numPats, angleType) {
  if (angleType === 'e') {
    return [60, 60];
  }
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
    case '4e': return "4: tetraflexagon";
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
