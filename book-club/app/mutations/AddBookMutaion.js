import Relay from 'react-relay';

export default class AddBookMutation extends Relay.Mutation {
  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id,
        username,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation { addBook }`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on AddBookPayload {
        user {
          id,
          username,
          fullname,
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
            },
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
          pendings {
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
        }
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        user: this.props.user.id,
      }
    }];
  }
  getVariables() {
    return {
      username: this.props.user.username,
      id: this.props.book.id,
      title: this.props.book.title,
      authors: this.props.book.authors || '',
      averageRating: this.props.book.averageRating || '',
      canonicalVolumeLink: this.props.book.canonicalVolumeLink || '',
      categories: this.props.book.categories || '',
      description: this.props.book.description || '',
      language: this.props.book.language || '',
      pageCount: this.props.book.pageCount || '',
      publisher: this.props.book.publisher || '',
      publishedDate: this.props.book.publishedDate || '',
      smallThumbnail: this.props.book.smallThumbnail || '',
      thumbnail: this.props.book.thumbnail || '',
    }
  }
}
