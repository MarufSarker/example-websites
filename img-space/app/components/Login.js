import React from 'react';
import ReactDOM from 'react-dom';
import * as API from '../API';

class Login extends React.Component {
  state ={
    loginMessage: '',
    signupMessage: ''
  };
  static contextTypes = {
    router: React.PropTypes.object
  };
  setUser = ({signedIn, user, loginMessage, signupMessage}) => {
    if (signedIn === 'signin') {
      localStorage.setItem('user', JSON.stringify(user));
      this.props.appProps.setAuthenticatedUser(user);
      this.context.router.push('/');
    } else if (signedIn === 'logout') {
      this.props.appProps.setAuthenticatedUser(null);
      localStorage.clear();
      this.setState({loginMessage: '', signupMessage: ''});
      this.context.router.push('/');
    } else {
      localStorage.clear();
      this.setState({loginMessage: loginMessage, signupMessage: signupMessage});
    }
  };
  signin = (evt) => {
    evt.preventDefault()
    var username = ReactDOM.findDOMNode(this.refs.usernameSignin).value;
    var password = ReactDOM.findDOMNode(this.refs.passwordSignin).value;
    if (username && password) {
      API.signin(username, password).then(data => {
        var signedIn = data.signedIn;
        var user = data.user;
        var loginMessage = data.message;
        return this.setUser({signedIn, user, loginMessage});
      });
    }
  };
  signup = (evt) => {
    evt.preventDefault()
    var username = ReactDOM.findDOMNode(this.refs.usernameSignup).value;
    var password = ReactDOM.findDOMNode(this.refs.passwordSignup).value;
    var fullname = ReactDOM.findDOMNode(this.refs.nameSignup).value;
    var email = ReactDOM.findDOMNode(this.refs.emailSignup).value;
    if (username && password && fullname && email) {
      API.signup(username, password, fullname, email).then(data => {
        var signedIn = data.signedIn;
        var user = data.user ? data.user : null;
        var message = data.message ? data.message : null;
        var signupMessage = data.message ? data.message : null;
        return this.setUser({signedIn, user, signupMessage});
      });
    }
  };
  render() {
    return (
      <div className='container'>
        <div className="row">
          <div className="col-md-offset-2 col-md-4">
            <form>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" className="form-control" ref="nameSignup" placeholder="Fullname"/>
                <label>User Name</label>
                <input type="text" className="form-control" ref="usernameSignup" placeholder="Username"/>
                <label>Email Address</label>
                <input type="email" className="form-control" ref="emailSignup" placeholder="Email"/>
                <label>Password</label>
                <input type="password" className="form-control" ref="passwordSignup" placeholder="Password"/>
              </div>
              <button className="btn btn-default" onClick={this.signup}>Signup</button>
              <div>{this.state.signupMessage}</div>
            </form>
          </div>
          <div className="col-md-4">
            <form>
              <div className="form-group">
                <label>User Name</label>
                <input type="text" className="form-control" ref="usernameSignin" placeholder="Username"/>
                <label>Password</label>
                <input type="password" className="form-control" ref="passwordSignin" placeholder="Password"/>
              </div>
              <button className="btn btn-default" onClick={this.signin}>SignIn</button>
              <div>{this.state.loginMessage}</div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
