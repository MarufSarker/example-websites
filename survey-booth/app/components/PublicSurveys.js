import React from 'react';
import Relay from 'react-relay';

import CJ from './cj';

class PublicSurveys extends React.Component {
  render() {
    let surveys = this.props.viewer.surveys || [];
    return (
      <div className="container">
        {
          surveys.map(survey => <CJ key={survey.id} survey={survey} history={this.props.history}/>)
        }
      </div>
    );
  }
}

export default Relay.createContainer(PublicSurveys, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
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
    `,
  },
});
