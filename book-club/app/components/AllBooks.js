import React from 'react';
import Relay from 'react-relay';
import {Link} from 'react-router';

class AllBooks extends React.Component {
  componentWillMount() {
    this.props.relay.setVariables({
      username: this.props.username || 'default',
    });
  };
  routeIsActive(pathname, query) {
    return this.props.location.pathname === pathname;
  }
  pseudoRouteIsActive(pathname, query) {
    let currentPath = this.props.location.pathname.split('/');
    currentPath = currentPath.length > 2 ? currentPath[1] + '/' + currentPath[2] : '/';
    return currentPath === pathname;
  };
  setSearchTerm = (value) => {
    this.props.relay.setVariables({
      username: this.props.username || 'default',
      searchTerm: value || '',
    });
  };
  render() {
    // console.log(this)
    let books = this.props.viewer.books;
    return (
      <div className="container">
        <ul className="nav nav-tabs">
          <li role="presentation" className={this.routeIsActive('/allbooks') ? 'active' : ''}><Link to="allbooks">All Books</Link></li>
          <li role="presentation" className={this.routeIsActive('/allbooks/search') ? 'active' : ''}><Link to="allbooks/search">Search</Link></li>
          {
            this.pseudoRouteIsActive('allbooks/books') ? (
              <li role="presentation" className={this.pseudoRouteIsActive('allbooks/books') ? 'active' : ''}><a>Book</a></li>
            ) : null
          }
        </ul>
        <div className="line-break-invisible"></div>
        {
          this.props.children &&
          React.cloneElement(this.props.children, {
            appProps: {
              books: books,
              setSearchTerm: this.setSearchTerm,
              search: this.props.viewer.search,
            }
          })
        }
      </div>
    );
  }
}

export default Relay.createContainer(AllBooks, {
  initialVariables: {
    username: "default",
    searchTerm: '',
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        books {
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
        search (searchTerm: $searchTerm) {
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
            }
          }
        }
      }
    `,
  },
});
