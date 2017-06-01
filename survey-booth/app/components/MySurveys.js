import React from 'react';
import Relay from 'react-relay';

import CJ from './cj';

class MySurveys extends React.Component {
  componentWillMount() {
    this.props.relay.setVariables({
      username: this.props.username || 'default',
    });
  };
  render() {
    // console.log(this)
    let user = this.props.viewer.user;
    return (
      <div className="container">
        <div className="graphHolder">
        {user.surveys ?
          user.surveys.map(survey => <CJ key={survey.id} survey={survey} history={this.props.history}/>)
          : null
        }
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(MySurveys, {
  initialVariables: {
    username: 'default'
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user (username: $username) {
          username,
          fullname,
          surveys {
            id,
            title,
            addedBy,
            shares,
            options {
              optionTitle,
              optionVotes,
            }
          }
        }
      }
    `,
  },
});
