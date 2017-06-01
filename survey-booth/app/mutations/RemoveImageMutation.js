import Relay from 'react-relay';

export default class RemoveImageMutation extends Relay.Mutation {
  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id,
        username,
      },
    `,
  };
  getMutation() {
    return Relay.QL` mutation { removeImage } `;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on RemoveImagePayload {
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
      id: this.props.id,
    }
  }
}
