"use strict";
const React = require('react');

/**
 * TextArea: editable textarea (since idyll's textarea has issues)
 * props {
 *  value         currently displayed value
 *  cols          number of columns in the input area
 *  rows          number of rows in the input area
 *  placeholder   placeholder text displayed till user enters a value
 *  spellCheck    whether it puts red squigglies under misspelled words
 * }
 */
class TextArea extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.props.updateProps({ value: e.currentTarget.value });
  }

  render() {
    const { value, cols, rows, placeholder, spellCheck } = this.props;
    return (
      <textarea onChange={this.onChange} value={value} cols={cols} rows={rows} placeholder={placeholder} spellCheck={spellCheck} />
    );
  }
};

module.exports = TextArea;
