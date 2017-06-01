import Relay from 'react-relay';

export default class AddImageMutation extends Relay.Mutation {
  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id,
        username,
      },
    `,
  };
  getMutation() {
    return Relay.QL` mutation { addImage } `;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on AddImagePayload {
        user {
          images {
            id,
            title,
            imageLink,
            dateAdded,
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
    // console.log(this.props.text, this.props.user.username);
    return {
      username: this.props.user.username,
      title: this.props.title,
      imageLink: this.props.imageLink,
    }
  }
}
