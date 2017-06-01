import React from 'react';

class BorrowRequests extends React.Component {
  acceptBorrowRequest = (request) => {
    this.props.appProps.onAcceptBorrowRequest(request);
  };
  rejectBorrowRequest = (request) => {
    this.props.appProps.onRejectBorrowRequest(request);
  };
  requestDisplay = (request) => {
    let book = request.book;
    let requestedBy = request.username;
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
          <div>{requestedBy}</div>
        </div>
        <div className="show">
          <div className="btn btn-primary btn-lg btn-block btnDefaultCustom" onClick={this.acceptBorrowRequest.bind(this, request)}>
            Accept Borrow Request
          </div>
          <div className="btn btn-danger btn-lg btn-block btnDefaultCustom" onClick={this.rejectBorrowRequest.bind(this, request)}>
            Reject Borrow Request
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
          user.requests ? user.requests.map(request => {
            return (
              <div key={request.book.id} className="col-sm-11 result">
                {this.requestDisplay(request)}
              </div>
            )
          }) : null
        }
      </div>
    );
  }
}

export default BorrowRequests;
