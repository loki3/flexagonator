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
  }

  getCurrentFile(props, state) {
    return props.pattern.replace('*', state.current);
  }

  render() {
    const { width, height, pattern } = this.props;
    const file = pattern.replace('*', this.state.current);
    return (
      <img src={file} width={width} height={height} />
    );
  }
};

module.exports = Slides;
