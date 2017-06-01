import Relay from 'react-relay';

export default class AddLocationMutation extends Relay.Mutation {
  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id,
        username,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{addLocation}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on AddLocationPayload {
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
      name: this.props.data.name, 
      rating: this.props.data.rating, 
      rating_img_url_small: this.props.data.rating_img_url_small, 
      review_count: this.props.data.review_count, 
      url: this.props.data.url, 
      category: this.props.data.category, 
      snippet_text: this.props.data.snippet_text, 
      image_url: this.props.data.image_url, 
      snippet_image_url: this.props.data.snippet_image_url, 
      is_closed: this.props.data.is_closed, 
      location: this.props.data.location, 
      display_phone: this.props.data.display_phone,
    }
  }
}
