import React from 'react';

class MyBooksList extends React.Component {
  removeSelectedBook = (book) => {
    this.props.appProps.onRemoveBook(book);
  };
  resultDisplay = (book) => {
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
            {book.title}
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
        <div className="show">
          <div className="btn btn-default btn-lg btn-block btnDefaultCustom" onClick={this.removeSelectedBook.bind(this, book)}>
            Remove This Book
          </div>
        </div>
      </div>
    );
  };
  render() {
    let {user} = this.props.appProps;
    return (
      <div className="container">
        {
          user.books ? user.books.map(book => {
            return (
              <div key={book.id} className="col-sm-11 result">
                {this.resultDisplay(book)}
              </div>
            )
          }) : null
        }
      </div>
    );
  }
}

export default MyBooksList;
