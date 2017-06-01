// libraries
import React from 'react';
import {IndexRoute, Route} from 'react-router';


// Components
import App from '../components/App';
import About           from '../components/About';
import Home from '../components/Home';
import Login from '../components/Login';
import Profile from '../components/Profile';
import UserGallery from '../components/UserGallery';
import PublicGallery from '../components/PublicGallery';
import UnMatchedRoutes from '../components/UnMatchedRoutes';


// Queries
const userQuery = { user: () => Relay.QL` query { user (username: $username) } `, };
const viewerQuery = { viewer: () => Relay.QL` query { viewer } `, };

// Route Control
function isNotLoggedIn(nextState, replace) {
  if (localStorage.user) {
    replace({pathname: '/'})
  }
}
function isLoggedIn(nextState, replace) {
  if (!localStorage.user) {
    replace({pathname: '/login'})
  }
}

// Username Control
let USERNAME = localStorage.user ? JSON.parse(localStorage.user).username : "defaultUser";
function setUsername (user) {
  if (user) {
    USERNAME = user.username;
  } else {
    USERNAME = "defaultUser"
  }
}

function prepareUserGalleryParams(params, route) {
  // console.log(params,route)
  return {
    ...params,
    username: USERNAME,
  };
};

// Routes 
var routes = (
  <Route
    path='/'
    component={App}
    setUsername={setUsername}>
    <IndexRoute
      component={Home}/>
    <Route name="login" path='login' component={Login} onEnter={isNotLoggedIn}/>
    <Route
      name="usergallery" 
      path='usergallery' 
      component={UserGallery} 
      prepareParams={prepareUserGalleryParams}
      queries={userQuery}
      onEnter={isLoggedIn}/>
    <Route
      name="publicgallery" 
      path='publicgallery' 
      component={PublicGallery} 
      queries={viewerQuery}/>
    <Route
      name="profile" 
      path='profile/:username' 
      component={Profile} 
      queries={viewerQuery}/>
    <Route name="about" path="about" component={About}/>
    <Route name="404" path="*" component={UnMatchedRoutes}/>
  </Route>
);

export default routes;
