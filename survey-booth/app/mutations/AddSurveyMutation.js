import Relay from 'react-relay';

export default class AddSurveyMutation extends Relay.Mutation {
  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id,
        username,
      },
    `,
  };
  getMutation() {
    return Relay.QL` mutation { addSurvey } `;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on AddSurveyPayload {
        user {
          id,
          username,
          fullname,
          surveys {
            id,
            title,
          }
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
      title: this.props.data.title,
      options: this.props.data.options,
    }
  }
}
