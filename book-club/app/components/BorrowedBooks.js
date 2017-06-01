import React from 'react';

class BorrowedBooks extends React.Component {
  returnBook = (borrow) => {
    this.props.appProps.onReturnBorrowedBook(borrow);
  };
  borrowedBooksDisplay = (borrow) => {
    let book = borrow.book;
    let borrowedFrom = borrow.username;
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
        <div className="well">
          <div className="h4">Requested By</div>
          <div>{borrowedFrom}</div>
        </div>
        <div className="show">
          <div className="btn btn-primary btn-lg btn-block btnDefaultCustom" onClick={this.returnBook.bind(this, borrow)}>
            Return Borrowed Book
          </div>
        </div>
      </div>
    );
  };
  render() {
    let user = this.props.appProps.user;
    return (
      <div>
        {
          user.borrows ? user.borrows.map(borrow => {
            return (
              <div key={borrow.book.id} className="col-sm-11 result">
                {this.borrowedBooksDisplay(borrow)}
              </div>
            )
          }) : null
        }
      </div>
    );
  }
}

export default BorrowedBooks;
