import React from 'react';
import Relay from 'react-relay';

import Header from './Header';
import Footer from './Footer';

class App extends React.Component {
  state = {
    location: '',
    user:  localStorage.user ? JSON.parse(localStorage.user) : null,
  };
  setAuthenticatedUser = (user) => {
    this.props.route.setUSERNAME(user);
    this.setState({user: user});
  };
  render() {
    // console.log(this.state.user)
    return (
      <div>
        <Header
          isActive={this.props.history.isActive} 
          pathname={this.props.location.pathname}
          user={this.state.user}
          history={this.props.history}
          setAuthenticatedUser={this.setAuthenticatedUser}/>
        { 
          this.props.children && 
          React.cloneElement(this.props.children, {
            appProps: {
              user: this.state.user,
              setAuthenticatedUser: this.setAuthenticatedUser,
              history: this.props.history,
            }
          }) 
        }
        <Footer/>
      </div>
    );
  }
}

export default Relay.createContainer(App, {
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
        }
      }
    `,
  },
});
