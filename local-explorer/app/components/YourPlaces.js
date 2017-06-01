import React from 'react';
import Relay from 'react-relay';

import UserLocationsDisplay from './UserLocationsDisplay';
import RemoveLocationMutation from '../mutations/RemoveLocationMutation';

class YourPlaces extends React.Component {
  handleRemovePlace = (data) => {
    Relay.Store.update(
      new RemoveLocationMutation({
        data,
        user: this.props.user,
      })
    );
  };
  render() {
    let {user} = this.props;
    return (
      <div className="container">
        <div className="h4 text-center">{user.fullname}</div>
        <div className="h5 text-center">Your Selected Locations</div>
        <div className="container">
          <div className="row">
            {
              user.attendingLocations ?
                user.attendingLocations.map(loc => {
                  return (
                    <div key={loc.id} className="result col-sm-11">
                      <UserLocationsDisplay loc={loc} handleRemovePlace={this.handleRemovePlace}/>
                    </div>
                  )
                })
              : null
            }
            </div>
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(YourPlaces, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        id,
        username,
        email,
        fullname,
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
        },
        ${RemoveLocationMutation.getFragment('user')},
      }
    `,
  },
});
