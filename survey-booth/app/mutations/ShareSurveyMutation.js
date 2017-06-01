import Relay from 'react-relay';

export default class ShareSurveyMutation extends Relay.Mutation {
  static fragments = {
    survey: () => Relay.QL`
      fragment on Survey {
        id,
        title,
      },
    `,
    user: () => Relay.QL`
      fragment on User {
        id,
        username,
      },
    `,
  };
  getMutation() {
    return Relay.QL` mutation { shareSurvey } `;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on ShareSurveyPayload {
        survey {
          id,
          title,
          addedBy,
          shares,
          options {
            optionTitle,
            optionVotes,
          },
          allVoters {
            username,
          }
        },
        user {
          username
        }
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        survey: this.props.survey.id,
        user: this.props.user.id,
      }
    }];
  }
  getVariables() {
    // console.log(this.props.text, this.props.user.username);
    return {
      username: this.props.user.username,
      id: this.props.data.id,
    }
  }
}
