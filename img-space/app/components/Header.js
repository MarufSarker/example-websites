import React from 'react';
import {Link, IndexLink} from 'react-router';
import * as API from '../API';

class Header extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object
  };
  routeIsActive(pathname, query) {
    return this.props.pathname === pathname;
  };
  signout = (evt) => {
    API.signout().then(data => {
      if (data.signedIn === 'logout') {
        localStorage.clear();
        this.props.setAuthenticatedUser(null);
        this.context.router.push('/');
      } else {
        this.context.router.push('/');
      }
    });
  };
  render() {
    // console.log(this.props)
    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="#">ImgSpace</a>
          </div>


          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav navbar-right">
              <li
                className={this.routeIsActive('/') ? 'active' : ''}>
                <IndexLink to="/">
                  Home
                  <span className="sr-only">(current)</span>
                </IndexLink>
              </li>
              <li
                className={this.routeIsActive('/publicgallery') ? 'active' : ''}>
                <Link to="publicgallery">Public Photos</Link>
              </li>
              {
                this.props.user ?
                (
                  <li
                    className={this.routeIsActive('/usergallery') ? 'active' : ''}>
                    <Link to="usergallery">Your Photos</Link>
                  </li>
                ) : null
              }
              <li className={this.routeIsActive('/about') ? 'active' : ''}>
                <Link to="about">About</Link>
              </li>
              {
                this.props.user ?
                 (
                   <li>
                     <Link to="/" onClick={this.signout}>Logout</Link>
                   </li>
                 ) :
                 (
                   <li
                     className={this.routeIsActive('/login') ? 'active' : ''}>
                     <Link to="login">Register/Login</Link>
                   </li>
                 )
              }
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}


export default Header;
