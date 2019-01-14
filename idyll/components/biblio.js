"use strict";
const React = require('react');

/**
 * Biblio: display a bibliographic reference
 * props {
 *  title         title of paper or book
 *  author        [optional] list of article authors
 *  date          [optional] published date
 *  link          [optional] link to content
 * }
 */
class Biblio extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.props.updateProps({ value: e.currentTarget.value });
  }

  render() {
    const { author, title, date, link } = this.props;

    const fullAuthor = author
      ? <span>{author},&nbsp;</span>
      : null;
    const fullDate = date
      ? <span>({date}). &nbsp;</span>
      : null;
    const fullTitle = link
      ? <a href={link}><span className='biblio-title'>{title}</span></a>
      : <span className='biblio-title'>{title}</span>;

    return <div className='biblio'>{fullAuthor}{fullDate}{fullTitle}<br /><br /></div>;
  }
};

module.exports = Biblio;
