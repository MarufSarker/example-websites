import React from 'react';
import Relay from 'react-relay';

import CJ from './cj';
import VoteSurveyMutation from '../mutations/VoteSurveyMutation';
import ShareSurveyMutation from '../mutations/ShareSurveyMutation';

class Survey extends React.Component {
  componentWillMount() {
    this.props.relay.setVariables({
      id: this.props.params.surveyID || 'default',
      username: this.props.username || 'default',
    });
  };
  handleVote = (voteData) => {
    let data = {
      id: voteData.id,
      optionTitle: voteData.optionTitle
    };
    Relay.Store.commitUpdate(
      new VoteSurveyMutation({
        user: this.props.viewer.user,
        survey: this.props.viewer.survey,
        data,
      })
    );
    // console.log(this)
    // console.log(voteData)
  };
  handleShare = (data) => {
    Relay.Store.commitUpdate(
      new ShareSurveyMutation({
        user: this.props.viewer.user,
        survey: this.props.viewer.survey,
        data,
      })
    );
  };
  render() {
    let isNotAuthor = true;
    let currentAuthor = this.props.viewer.survey ? this.props.viewer.survey.addedBy : 'default';
    if (currentAuthor !== this.props.username) {
      isNotAuthor = true;
    } else {
      isNotAuthor = false;
    }
    let survey = this.props.viewer.survey || {};
    return (
      <div className="container">
        {
          Object.keys(survey).length === 0 ? null : <CJ survey={survey} handleVote={this.handleVote} handleShare={this.handleShare} username={this.props.username} isNotAuthor={isNotAuthor} surveyID={this.props.params.surveyID} history={this.props.history}/>
        }
      </div>
    );
  }
}

export default Relay.createContainer(Survey, {
  initialVariables: {
    id: 'default',
    username: 'default',
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user (username: $username) {
          username,
          ${VoteSurveyMutation.getFragment('user')},
          ${ShareSurveyMutation.getFragment('user')},
        },
        survey (id: $id) {
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
          ${VoteSurveyMutation.getFragment('survey')},
          ${ShareSurveyMutation.getFragment('survey')},
        }
      }
    `,
  },
});
