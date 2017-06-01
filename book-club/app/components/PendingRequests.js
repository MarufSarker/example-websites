import React from 'react';

class PendingRequests extends React.Component {
  removeBorrowRequest = (pending) => {
    this.props.appProps.onPendingCancel(pending)
  };
  pendingBookDisplay = (pending) => {
    let book = pending.book;
    let requestedFrom = pending.username;
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
          <div className="h4">Requested From</div>
          <div>{requestedFrom}</div>
        </div>
        <div className="show">
          <div className="btn btn-danger btn-lg btn-block btnDefaultCustom" onClick={this.removeBorrowRequest.bind(this, pending)}>
            Remove Borrow Request
          </div>
        </div>
      </div>
    );
  };
  render() {
    // console.log(this)
    let user = this.props.appProps.user;
    return (
      <div className="container">
        {
          user.pendings ? user.pendings.map(pending => {
            return (
              <div key={pending.book.id} className="col-sm-11 result">
                {this.pendingBookDisplay(pending)}
              </div>
            )
          }) : null
        }
      </div>
    );
  }
}

export default PendingRequests;
