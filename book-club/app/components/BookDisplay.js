import React from 'react';
import Relay from 'react-relay';
import ReactDOM from 'react-dom';

import BorrowBookMutation from '../mutations/BorrowBookMutation';

class BookDisplay extends React.Component {
  state = {
    errorMessage: ''
  };
  componentWillMount() {
    this.props.relay.setVariables({
      username: this.props.username || 'default',
      id: this.props.params.bookID || 'default',
    });
  };
  borrowSelectedBook = (book, availableOwners) => {
    let selectedOwner = availableOwners.filter(owner => {
      return ReactDOM.findDOMNode(this.refs[owner.username]).checked;
    });
    if (selectedOwner.length <= 0) {
      this.setState({errorMessage: 'Please Select An User'})
    } else {
      this.setState({errorMessage: ''});
      Relay.Store.update(
        new BorrowBookMutation({
          user: this.props.viewer.user,
          book: {
            id: book.id,
            bookOwner: selectedOwner[0].username,
          },
        })
      );
    }
  };
  renderBookList = (book) => {
    let fallbackImage = "no-image_400_x_600.png";
    let availableOwners = book.addedBy.filter(owner => {
      return owner.username !== this.props.viewer.user.username && owner.available === 'available';
    });
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
          <div className="h4">Borrow This Book From</div>
          <ul className="list-unstyled">
            { availableOwners.map(owner => {
                return (
                  <li key={owner.username}>
                    <input ref={owner.username} type="radio" name="radioOptions"/>
                    {` ${owner.username}`}
                  </li>
                )
              })
            }
          </ul>
        </div>
        {this.state.errorMessage}
        <div className="show">
          <div className="btn btn-default btn-lg btn-block btnDefaultCustom" onClick={this.borrowSelectedBook.bind(this, book, availableOwners)}>
            Borrow This Book
          </div>
        </div>
      </div>
    );
  };
  render() {
    // console.log(this.state)
    return (
      <div className="container">
        {
          this.props.viewer.book ? (
            <div key={this.props.viewer.book.id} className="col-sm-11 result">
              {this.renderBookList(this.props.viewer.book)}
            </div>
          ) : null
        }
      </div>
    );
  }
}

export default Relay.createContainer(BookDisplay, {
  initialVariables: {
    username: "default",
    id: 'default',
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        book (id: $id) {
          id,
          title,
          authors,
          categories,
          publisher,
          publishedDate,
          description,
          pageCount,
          averageRating,
          smallThumbnail,
          thumbnail,
          language,
          canonicalVolumeLink,
          addedBy {
            username,
            available,
          }
        },
        user (username: $username) {
          id,
          username,
          ${BorrowBookMutation.getFragment('user')},
        },
      }
    `,
  },
});
