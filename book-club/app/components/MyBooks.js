import React from 'react';
import Relay from 'react-relay';
import {Link} from 'react-router';

import MyBooksList from './MyBooksList';
import AddBookMutation from '../mutations/AddBookMutaion';
import ResponseBorrowBookMutation from '../mutations/ResponseBorrowBookMutation';
import ReturnBorrowedBookMutation from '../mutations/ReturnBorrowedBookMutation';
import RemoveBorrowBookMutation from '../mutations/RemoveBorrowBookMutation';
import RemoveBookMutation from '../mutations/RemoveBookMutation';

class MyBooks extends React.Component {
  componentWillMount() {
    this.props.relay.setVariables({
      username: this.props.username || 'default',
    });
  };
  routeIsActive(pathname, query) {
    return this.props.location.pathname === pathname;
  };
  onAddBookSave = (book) => {
    Relay.Store.update(
      new AddBookMutation({
        user: this.props.viewer.user,
        book: book,
      })
    );
  };
  onAcceptBorrowRequest = (request) => {
    let book = {
      requestedBy: request.username,
      id: request.book.id,
      response: true,
    };
    Relay.Store.update(
      new ResponseBorrowBookMutation({
        user: this.props.viewer.user,
        book: book,
      })
    );
  };
  onRejectBorrowRequest = (request) => {
    let book = {
      requestedBy: request.username,
      id: request.book.id,
      response: false,
    };
    Relay.Store.update(
      new ResponseBorrowBookMutation({
        user: this.props.viewer.user,
        book: book,
      })
    );
  };
  onReturnBorrowedBook = (borrow) => {
    let book = {
      bookOwner: borrow.username,
      id: borrow.book.id,
    };
    Relay.Store.update(
      new ReturnBorrowedBookMutation({
        user: this.props.viewer.user,
        book: book,
      })
    );
  };
  onPendingCancel = (pending) => {
    let book = {
      bookOwner: pending.username,
      id: pending.book.id,
    };
    Relay.Store.update(
      new RemoveBorrowBookMutation({
        user: this.props.viewer.user,
        book: book,
      })
    );
  };
  onRemoveBook = (book) => {
    Relay.Store.update(
      new RemoveBookMutation({
        user: this.props.viewer.user,
        book: book,
      })
    );
  };
  render() {
    // console.log(this)
    let user = this.props.viewer.user;
    return (
      <div className="container">
        <ul className="nav nav-tabs nav-justified">
          <li role="presentation" className={this.routeIsActive('/mybooks') ? 'active' : ''}><Link to="mybooks">My Books</Link></li>
          <li role="presentation" className={this.routeIsActive('/mybooks/addbook') ? 'active' : ''}><Link to="mybooks/addbook">Add Book</Link></li>
          <li role="presentation" className={this.routeIsActive('/mybooks/borrowedbooks') ? 'active' : ''}><Link to="mybooks/borrowedbooks">Borrowed</Link></li>
          <li role="presentation" className={this.routeIsActive('/mybooks/lendbooks') ? 'active' : ''}><Link to="mybooks/lendbooks">Lend</Link></li>
          <li role="presentation" className={this.routeIsActive('/mybooks/borrowrequests') ? 'active' : ''}><Link to="mybooks/borrowrequests">Requests</Link></li>
          <li role="presentation" className={this.routeIsActive('/mybooks/pendingrequests') ? 'active' : ''}><Link to="mybooks/pendingrequests">Pending</Link></li>
        </ul>
        <div className="line-break-invisible"></div>
        {
          this.props.children &&
          React.cloneElement(this.props.children, {
            appProps: {
              user: this.props.viewer.user,
              onAddBookSave: this.onAddBookSave,
              onAcceptBorrowRequest: this.onAcceptBorrowRequest,
              onRejectBorrowRequest: this.onRejectBorrowRequest,
              onReturnBorrowedBook: this.onReturnBorrowedBook,
              onPendingCancel: this.onPendingCancel,
              onRemoveBook: this.onRemoveBook,
            }
          })
        }
      </div>
    );
  }
}

export default Relay.createContainer(MyBooks, {
  initialVariables: {
    username: "default"
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user (username: $username) {
          id,
          username,
          fullname,
          books {
            id,
            title,
            authors,
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
          requests {
            username,
            book {
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
              },
            },
          },
          pendings  {
            username,
            book {
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
              },
            },
          },
          borrows {
            username,
            book {
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
              },
            },
          },
          acceptedrequests {
            username,
            book {
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
              },
            },
          },
          ${AddBookMutation.getFragment('user')},
          ${ResponseBorrowBookMutation.getFragment('user')},
          ${ReturnBorrowedBookMutation.getFragment('user')},
          ${RemoveBorrowBookMutation.getFragment('user')},
          ${RemoveBookMutation.getFragment('user')},
        },
      }
    `,
  },
});
