import React from 'react';
import {Link, IndexLink} from 'react-router';
import * as API from '../API';

class Header extends React.Component {
  routeIsActive(pathname, query) {
    let currentPath = this.props.pathname.split('/');
    currentPath = currentPath[1] ? '/' + currentPath[1] : '/' + currentPath[0];
    return currentPath === pathname;
  };
  signout = (evt) => {
    API.signout().then(data => {
      if (data.signedIn === 'logout') {
        localStorage.clear();
        this.props.setAuthenticatedUser(null);
        this.props.history.pushState(null, '/');
      } else {
        this.props.history.pushState(null, '/');
      }
    });
  };
  render() {
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
            <Link className="navbar-brand" to="/">BookClub</Link>
          </div>

          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav navbar-right">
              <li className={this.routeIsActive('/') ? 'active' : ''}>
                <IndexLink to="/">
                  Home
                  <span className="sr-only">(current)</span>
                </IndexLink>
              </li>
              {
                this.props.user ?
                  <li className={this.routeIsActive('/allbooks') ? 'active' : ''}>
                    <Link to="allbooks">All Books</Link>
                  </li>
                : null
              }
              {
                this.props.user ?
                  <li className={this.routeIsActive('/mybooks') ? 'active' : ''}>
                    <Link to="mybooks">My Books</Link>
                  </li>
                : null
              }
              {
                this.props.user ?
                  <li className="dropdown">
                    <Link to="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><span className="caret"></span></Link>
                    <ul className="dropdown-menu">
                      <li className={this.routeIsActive('/settings') ? 'active' : ''}>
                        <Link to="settings">Settings</Link>
                      </li>
                      <li className={this.routeIsActive('/about') ? 'active' : ''}>
                        <Link to='/about'>
                          About
                        </Link>
                      </li>
                      <li>
                        <Link to='/' onClick={this.signout}>
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </li>
                : null
              }
              {
                !this.props.user ?
                  <li className={this.routeIsActive('/about') ? 'active' : ''}>
                    <Link to="about">About</Link>
                  </li>
                : null
              }
              {
                !this.props.user ?
                  <li className={this.routeIsActive('/login') ? 'active' : ''}>
                    <Link to="login">Register/Login</Link>
                  </li>
                : null
              }
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}


export default Header;
