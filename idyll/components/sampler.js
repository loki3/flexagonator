"use strict";
const React = require('react');
const Flexagon = require('./flexagon');
const Unfolded = require('./unfolded');

/**
 * Sampler: show a flexagon, controls, and an unfolded version
 * props {
 *  numPats     number of pats in the flexagon, typically in the range [4, 12]
 *  angles      center angle and the angle clockwise from the center, e.g. [30, 60]
 *  generator   flex generating sequence for flexagon, e.g. 'Sh*>>T*^P*'
 * }
 * state {
 *  numPats     number of pats in the flexagon, typically in the range [4, 12]
 *  patOptions  array of different numbers of pats
 *  history     contains all the flexes applied to the current flexagon
 *  initial     passed to <Flexagon/>
 *  doNext      used to trigger a single command that will be reset next time
 * }
 */
class Sampler extends React.Component {
  constructor(props) {
    super(props);
    this.updateProps = this.updateProps.bind(this);
    this.handleNumPats = this.handleNumPats.bind(this);
    this.state = {
      numPats: props.numPats,
      initial: this.buildInitial(props.numPats, props),
      history: '',
      doNext: {}
    };
  }

  buildInitial(numPats, props) {
    const { generator } = props;
    const colors = [0x2E4172, 0x2B803E, 0xAA4439, 0x622870, 0xffff00, 0x553900, 0xdddddd, 0x999999];
    const initial = [
      { numPats },
      { flexAndColor: { flexes: generator, colors: colors } },
      { reverseFlexes: generator },
      { history: 'clear' }
    ];
    return initial;
  }

  updateProps(newprops) {
    this.props.updateProps(newprops);
    if (newprops.history) {
      this.setState({ history: newprops.history, doNext: {} });
    }
  }

  handleNumPats(e) {
    const numPats = e.target.value;
    this.setState({
      numPats,
      initial: this.buildInitial(numPats, this.props),
      history: '',
      doNext: { runInitial: true }
    });
  }

  handleHistory(doHistory) {
    if (doHistory === 'reset') {
      this.setState({ history: '' });
    }
    this.setState({ doNext: { doHistory } });
  }

  getNumPatsText(n) {
    switch (n) {
      case 4: return "4: tetraflexagon";
      case 5: return "5: pentaflexagon";
      case 6: return "6: hexaflexagon";
      case 7: return "7: heptaflexagon";
      case 8: return "8: octaflexagon";
      case 9: return "9: enneaflexagon";
      case 10: return "10: decaflexagon";
      case 11: return "11: undecaflexagon";
      case 12: return "12: decaflexagon";
    }
    return n.toString();
  }

  renderSelectNumPats() {
    const { patOptions } = this.props;
    const { numPats } = this.state;
    return (
      <select value={numPats} onChange={this.handleNumPats}>
        {patOptions.map(n => <option value={n} key={n}>{this.getNumPatsText(n)}</option>)}
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
    const { numPats, initial, doNext } = this.state;
    const { runInitial, doHistory } = doNext;
    const flexagonOptions = { structure: true, showIds: false, both: true, stats: true };

    return (
      <div>
        number of pats: {this.renderSelectNumPats()}

        <Flexagon updateProps={this.updateProps} width={700} height={400} numPats={numPats}
          initialScript={initial} runInitial={runInitial} options={flexagonOptions}
          doHistory={doHistory} overButton={true} />
        {this.renderHistory()}

        <Unfolded width={1000} height={500} numPats={numPats} generator={generator} />
      </div>
    );
  }
};

module.exports = Sampler;
