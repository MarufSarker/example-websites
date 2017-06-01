import React from 'react';
import Relay from 'react-relay';
import {Link} from 'react-router';

import AddSurveyMutation from '../mutations/AddSurveyMutation';

class UserProfile extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object
  };
  componentWillMount() {
    this.props.relay.setVariables({
      username: this.props.username || 'default',
    });
  };
  handleClickAddSurvey = (evt) => {
    evt.preventDefault();
    this.context.router.push('/usersurveys');
  };
  handleClickMySurveys = (evt) => {
    evt.preventDefault();
    this.context.router.push('/usersurveys/mysurveys');
  };
  handleSurveySubmit = (data) => {
    Relay.Store.commitUpdate(
      new AddSurveyMutation({
        user: this.props.viewer.user,
        data,
      })
    );
  };
  render() {
    let user = this.props.viewer.user;
    return (
      <div className="container text-center">
        <div className="h4"><strong>{user.fullname}</strong></div>
        <div className="btn-group btn-group-lg" role="group">
          <button onClick={this.handleClickAddSurvey} type="button" className="btn btn-default">
            Add Survey
          </button>
          <button onClick={this.handleClickMySurveys} type="button" className="btn btn-default">
            My Surveys
          </button>
        </div>
        <div className="line-break-invisible"></div>
        {
          this.props.children &&
          React.cloneElement(this.props.children, {
            appProps: {
              handleSurveySubmit: this.handleSurveySubmit,
            },
          })
        }
      </div>
    );
  }
}

export default Relay.createContainer(UserProfile, {
  initialVariables: {
    username: 'default'
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user (username: $username) {
          id,
          username,
          fullname,
          ${AddSurveyMutation.getFragment('user')},
        }
      }
    `,
  },
});
