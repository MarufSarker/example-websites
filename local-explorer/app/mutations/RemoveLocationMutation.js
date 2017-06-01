import Relay from 'react-relay';

export default class RemoveLocationMutation extends Relay.Mutation {
  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id,
        username,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{removeLocation}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on RemoveLocationPayload {
        user {
          id,
          username,
          attendingLocations {
            id,
            name,
            rating,
            rating_img_url_small,
            review_count,
            url,
            category,
            snippet_text,
            image_url,
            snippet_image_url,
            is_closed,
            location,
            display_phone,
            attendees {
              id,
              fullname,
            }
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
    return {
      username: this.props.user.username,
      id: this.props.data.id,
    }
  }
}
