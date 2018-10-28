"use strict";
import React from 'react';

/**
 * Explorer: tool for exploring all the states of a flexagon,
 *           displays a <textarea> for entering in a script describing a flexagon
 * props {
 *  value         contents of the <textarea>
 *  doFull        set to true to start exploring based on the script contents of the component
 *  doOneSide     same as doFull, but without ^, i.e. without turning over the flexagon
 *  doCancel      set to true to cancel the current computation
 *  getResults    set to 'getStates', 'getFlexes', 'dotSimple', 'dotFlexes', 'dotDirected'
 *                when set, it updates 'results'
 *  results       a read-only property filled with content based on 'getResults'
 *  done          a read-only property set to true when computation is done
 *  explored      a read-only property set to the number of states explored
 *  found         a read-only property set to the number of states found
 *  counts        a read-only property set to a list of flexes & their counts
 *  error         a read-only property set if there's an error
 *  cols          number of columns in the input area
 *  rows          number of rows in the input area
 * }
 * state {
 *  script        script to run for setting up the FlexagonManager
 *  fm            current FlexagonManager encapsulating Flexagon, History, etc.
 *  explorer      current Flexagonator.Explore encapsulating the search & its results
 * }
 */
class Explorer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { script: '' };
    this.onChange = this.onChange.bind(this);
    this.explore = this.explore.bind(this);
  }

  onChange(e) {
    const script = e.currentTarget.value;
    this.setState({ script: script });
    this.props.updateProps({ value: script });
  }

  componentWillReceiveProps(props) {
    if (props.doFull) {
      this.start(true);
    }
    if (props.doOneSide) {
      this.start(false);
    }
    if (props.getResults) {
      this.getResults(props);
    }
  }

  // start exploration using this.state.script and optionally including ^
  start(includeOver) {
    const fm = Flexagonator.runScriptString(null, this.state.script);
    if (Flexagonator.isError(fm)) {
      const str = Flexagonator.errorToString(fm);
      this.props.updateProps({ error: str, fm: null, explorer: null });
      return;
    }

    const over = includeOver ? fm.allFlexes['^'] : undefined;
    const explorer = new Flexagonator.Explore(fm.flexagon, fm.flexesToSearch, fm.allFlexes['>'], over);

    this.setState({ fm: fm, explorer: explorer });
    this.props.updateProps({ doFull: null, doOneSide: null, doCancel: null, explored: 0, found: 0, error: '' });

    this.explore(explorer);
  }

  // incrementally do more searching, chaining calls till done or cancelled
  explore(explorer) {
    if (this.props.doCancel) {
      this.props.updateProps({ doCancel: null });
      return;
    }

    while (explorer.checkNext()) {
      if (explorer.getExploredStates() % 50 == 0) {
        this.props.updateProps({ explored: explorer.getExploredStates(), found: explorer.getTotalStates() });
        setTimeout(this.explore, 0, explorer);
        return;
      }
    }

    const counts = this.getCounts(explorer.getFoundFlexes());
    this.props.updateProps({ done: true, explored: explorer.getExploredStates(), found: explorer.getTotalStates(), counts: counts });
  }

  getCounts(found) {
    const flexCounts = Flexagonator.countStatesThatSupportFlexes(found);
    const entries = Object.entries(flexCounts);
    let str = '';
    for (let i = 0; i < entries.length; i++) {
      const line = entries[i][0] + '\t' + entries[i][1] + '\n';
      str += line;
    }
    return str;
  }

  getResults(props) {
    let results = '';
    const explorer = this.state.explorer;
    if (!explorer) {
      results = 'first you need to enter a script and successfully explore';
    } else if (props.getResults == 'getStates') {
      results = this.getStates(explorer.getFlexagons());
    } else if (props.getResults == 'getFlexes') {
      results = this.getFlexes(explorer.getFoundFlexes());
    } else if (props.getResults == 'dotSimple') {
      results = Flexagonator.dotSimple(explorer.getFoundFlexes());
    } else if (props.getResults == 'dotFlexes') {
      results = Flexagonator.dotWithFlexes(explorer.getFoundFlexes(), true);
    } else if (props.getResults == 'dotDirected') {
      results = Flexagonator.dotWithFlexes(explorer.getFoundFlexes(), false);
    }
    this.props.updateProps({ getResults: null, results: results });
  }

  getStates(flexagons) {
    let str = "";
    for (let i = 0; i < flexagons.length; i++) {
      const tree = flexagons[i].getAsLeafTrees();
      str += i.toString() + ": " + JSON.stringify(tree) + '\n';
    }
    return str;
  }

  getFlexes(found) {
    let str = "";
    for (let i = 0; i < found.length; i++) {
      const s = i.toString() + ": " + Flexagonator.relativeFlexesToString(found[i]) + '\n';
      str += s;
    }
    return str;
  }

  render() {
    let { value, cols, rows } = this.props;
    cols = cols ? cols : 80;
    rows = rows ? rows : 10;

    return <textarea placeholder={'enter script'} onChange={this.onChange}
      value={value} cols={cols} rows={rows} spellCheck={false} />;
  }
}

module.exports = Explorer;


/**
 * Until Flexagonator is packaged up into modules, paste the compiled .js here
 */
