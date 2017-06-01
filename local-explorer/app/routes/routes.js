// libraries
import React from 'react';
import {IndexRoute, Route} from 'react-router';

// Components 
import App from '../components/App';
import About from '../components/About';
import Home from '../components/Home';
import Login from '../components/Login';
import YourPlaces from '../components/YourPlaces';
import UnMatchedRoutes from '../components/UnMatchedRoutes';

// Queries 
var userQuery = { user: () => Relay.QL` query { user(username: $username) } `, };


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

let USERNAME = localStorage.user ? JSON.parse(localStorage.user).username : "defaultUser";
function setUSERNAME (user) {
  if (user) {
    USERNAME = user.username;
  } else {
    USERNAME = "defaultUser"
  }
}

// Routes 
var routes = (
  <Route
    path='/' 
    component={App} 
    queries={userQuery} 
    prepareParams={() => ({username: USERNAME})}
    setUSERNAME={setUSERNAME}>
    <IndexRoute
      component={Home}
      queries={userQuery} 
      prepareParams={() => ({username: USERNAME})}/>
    <Route name="login" path='login' component={Login} onEnter={isNotLoggedIn}/>
    <Route
      name="places" 
      path='places' 
      component={YourPlaces} 
      queries={userQuery} 
      prepareParams={() => ({username: USERNAME})} 
      onEnter={isLoggedIn}/>
    <Route name="about" path="about" component={About}/>
    <Route name="404" path="*" component={UnMatchedRoutes}/>
  </Route>
);

export default routes;
