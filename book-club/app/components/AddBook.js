import React from 'react';
import ReactDOM from 'react-dom';

import * as API from '../API';

class AddBook extends React.Component {
  state = {
    books: [],
    query: '',
    errorMessage: '',
    bookAdded: ''
  };
  fetchData = (evt) => {
    evt.preventDefault();
    let query = ReactDOM.findDOMNode(this.refs.searchterm).value;
    API.searchBooks(query).then(data => {
      if (!data.message) {
        this.setState({books: data.books, errorMessage: ''});
      } else {
        this.setState({errorMessage: data.message});
      }
    });
  };
  addSelectedBook = (book) => {
    this.props.appProps.onAddBookSave(book);
    this.setState({bookAdded: 'Book Added'});
    setTimeout(() => {this.setState({bookAdded: ''});}, 3000);
  };
  resultDisplay = (book) => {
    let fallbackImage = "dist/img/no-image_400_x_600.png";
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
        <div className="clearfix">
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
          <div className="btn btn-default btn-lg btn-block btnDefaultCustom" onClick={this.addSelectedBook.bind(this, book)}>
            Add This Book
          </div>
        </div>
      </div>
    );
  };
  render() {
    return (
      <div className="container">
        <form role="search">
          <div className="form-group input-group">
            <input type="text" className="form-control" placeholder="Enter Book Name" ref="searchterm"/>
            <span className="input-group-btn">
              <button onClick={this.fetchData} type="submit" className="btn btn-default">Search</button>
            </span>
          </div>
        </form>
        {this.state.errorMessage}
        {this.state.bookAdded}
        <div className="line-break-invisible"></div>
        <div className="row">
          {this.state.books.map(book => {
            return (
              <div key={book.id} className="col-sm-11 result">{this.resultDisplay(book)}</div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default AddBook;
