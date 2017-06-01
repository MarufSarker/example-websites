import React from 'react';

import Header from './Header';
import Footer from './Footer';

class App extends React.Component {
  state = {
    location: '',
    user:  localStorage.user ? JSON.parse(localStorage.user) : null,
  };
  setAuthenticatedUser = (user) => {
    this.props.route.setUsername(user);
    this.setState({user: user});
  };
  render() {
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

export default App;
