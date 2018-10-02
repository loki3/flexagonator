"use strict";
const React = require('react');

/**
 * Slides: allows you to step through a series of images
 * props {
 *  pattern     file pattern, e.g. Something*.png
 *  start       starting number to place in pattern, e.g. 1 -> Something1.png
 *  end         ending number, so slideshow ranges from [start, end]
 *  width       [optional] width of image area
 *  height      [optional] height of image area
 * }
 * state {
 *  current     current image number
 * }
 */
class Slides extends React.Component {
  constructor(props) {
    super(props);
    this.state = { current: props.start };
    this.stepFirst = this.stepFirst.bind(this);
    this.stepPrevious = this.stepPrevious.bind(this);
    this.stepNext = this.stepNext.bind(this);
    this.stepLast = this.stepLast.bind(this);
  }

  stepFirst() {
    this.setState({ current: this.props.start });
  }

  stepPrevious() {
    if (this.state.current > this.props.start) {
      this.setState({ current: this.state.current - 1 });
    }
  }

  stepNext() {
    if (this.state.current < this.props.end) {
      this.setState({ current: this.state.current + 1 });
    }
  }

  stepLast() {
    this.setState({ current: this.props.end });
  }

  getCurrentFile(props, state) {
    return props.pattern.replace('*', state.current);
  }

  render() {
    const { width, height, pattern } = this.props;
    const file = pattern.replace('*', this.state.current);
    return (
      <div style={{ position: 'relative', width: width, height: height }}>
        <img src={file} width={width} height={height} />
        <div style={{ position: 'absolute', left: '0px', top: '0px' }}>
          <button onClick={this.stepFirst}>&lt;&lt;</button>
          <button onClick={this.stepPrevious}>&lt;</button>
          <button onClick={this.stepNext}>&gt;</button>
          <button onClick={this.stepLast}>&gt;&gt;</button>
        </div>
      </div >
    );
  }
};

module.exports = Slides;
