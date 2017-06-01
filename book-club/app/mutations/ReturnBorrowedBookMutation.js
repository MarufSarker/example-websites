import Relay from 'react-relay';

export default class ReturnBorrowedBookMutation extends Relay.Mutation {
  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id,
        username,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation { returnBook }`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on ReturnBookPayload {
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
      bookOwner: this.props.book.bookOwner,
    }
  }
}
