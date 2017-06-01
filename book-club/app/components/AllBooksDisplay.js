import React from 'react';
import {Link} from 'react-router';

class AllBooksDisplay extends React.Component {
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
        {
          this.props.appProps.books ? this.props.appProps.books.map(book => {
            return (
              <div key={book.id} className="col-sm-11 result">
                {this.renderBookList(book)}
              </div>
            )
          }) : null
        }
      </div>
    );
  }
}

export default AllBooksDisplay;
