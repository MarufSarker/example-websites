// libraries
import React from 'react';
import {IndexRoute, Route} from 'react-router';

// Components
import App from '../components/App';
import About from '../components/About';
import Home from '../components/Home';
import Login from '../components/Login';
import UserProfile from '../components/UserProfile';
import AddSurvey from '../components/AddSurvey';
import MySurveys from '../components/MySurveys';
import Survey from '../components/Survey';
import PublicSurveys from '../components/PublicSurveys';
import UnMatchedRoutes from '../components/UnMatchedRoutes';


// Queries
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

function prepareParams(params, route) {
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
      name="usersurveys" 
      path='usersurveys' 
      component={UserProfile}
      onEnter={isLoggedIn}
      prepareParams={prepareParams}
      queries={viewerQuery}>
      <IndexRoute
        name='addsurvey'
        onEnter={isLoggedIn}
        component={AddSurvey}/>
      <Route
        name='mysurveys'
        path='mysurveys'
        component={MySurveys}
        onEnter={isLoggedIn}
        prepareParams={prepareParams}
        queries={viewerQuery}/>
    </Route>
    <Route
      name='publicsurveys'
      path='publicsurveys'
      isLoggedIn={localStorage.user ? true : false}
      component={PublicSurveys}
      prepareParams={prepareParams}
      queries={viewerQuery}/>
    <Route
      name='survey'
      path='survey/:surveyID'
      onEnter={isLoggedIn}
      component={Survey}
      queries={viewerQuery}
      prepareParams={prepareParams}/>
    <Route name="about" path="about" component={About}/>
    <Route name="404" path="*" component={UnMatchedRoutes}/>
  </Route>
);

export default routes;
