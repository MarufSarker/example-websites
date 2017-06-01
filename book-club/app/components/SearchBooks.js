import React from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router';

class SearchBooks extends React.Component {
  searchTerm = (evt) => {
    evt.preventDefault();
    let searchTerm = ReactDOM.findDOMNode(this.refs.searchTerm).value;
    if (searchTerm.length > 0) {
      this.props.appProps.setSearchTerm(searchTerm);
    }
  };
  renderBookList = (book) => {
    let fallbackImage = "no-image_400_x_600.png";
    return (
      <div>
        <div className="pull-left">
          <a href={book.canonicalVolumeLink} target="_blank">
            <img
              src={book.smallThumbnail.length > 0 ? book.smallThumbnail : fallbackImage}
              alt={book.title}
              className="img-thumbnail resultedBookImage"/>
          </a>
        </div>
        <div
          className="clearfix">
          <div className="h4">
            <Link to={`allbooks/books/${book.id}`}>{book.title}</Link>
          </div>
          <div className="h5">
            <em>{book.authors}</em>
            <span>{" (" + book.averageRating + ")"}</span>
            <br/>
            {book.categories}
            <br/>
            <em>{book.publisher}</em>
            <span>
              {` ${book.publishedDate}`}
            </span>
          </div>
          <div>
            {book.description.length > 250 ? book.description.substr(0,250) + '...' : book.description}
          </div>
        </div>
      </div>
    );
  };
  render() {
    // console.log(this)
    return (
      <div className="container">
        <form role="search">
          <div className="form-group input-group">
            <input ref="searchTerm" type="text" className="form-control" placeholder="Search"/>
            <span className="input-group-btn">
              <button onClick={this.searchTerm} type="submit" className="btn btn-default">Search</button>
            </span>
          </div>
        </form>
        <div className="line-break-invisible"></div>
        {
          this.props.appProps.search ? this.props.appProps.search.map(result => {
            return (
              <div key={result.book.id} className="col-sm-11 result">
                {this.renderBookList(result.book)}
              </div>
            )
          }) : null
        }
      </div>
    );
  }
}

export default SearchBooks;
