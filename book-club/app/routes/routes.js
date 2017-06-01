// libraries
import React from 'react';
import {IndexRoute, Route} from 'react-router';


// Components 
import App             from '../components/App';
import About           from '../components/About';
import Body            from '../components/Body';
import Login           from '../components/Login';
import AllBooks        from '../components/AllBooks';
import AllBooksDisplay from '../components/AllBooksDisplay';
import SearchBooks     from '../components/SearchBooks';
import BookDisplay     from '../components/BookDisplay';
import MyBooks         from '../components/MyBooks';
import MyBooksList     from '../components/MyBooksList';
import AddBook         from '../components/AddBook';
import BorrowedBooks   from '../components/BorrowedBooks';
import LendBooks       from '../components/LendBooks';
import PendingRequests from '../components/PendingRequests';
import BorrowRequests  from '../components/BorrowRequests';
import UnMatchedRoutes from '../components/UnMatchedRoutes';

// Queries 
var viewerQuery = { viewer: () => Relay.QL` query { viewer } `, };


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
function setUsername (user) {
  if (user) {
    USERNAME = user.username;
  } else {
    USERNAME = "defaultUser"
  }
}

// Routes 
var routes = (
  <Route
    name="home" 
    path='/' 
    component={App}
    setUsername={setUsername}>
    <IndexRoute
      component={Body}/>
    <Route
      name="login" 
      path='login' 
      component={Login} 
      onEnter={isNotLoggedIn}/>
    <Route
      name="allbooks" 
      path='allbooks' 
      component={AllBooks}
      onEnter={isLoggedIn}
      prepareParams={() => ({username: USERNAME})}
      queries={viewerQuery}>
      <IndexRoute
        name="indexRouteAllBooks" 
        component={AllBooksDisplay}/>
      <Route
        name="search" 
        path="search" 
        component={SearchBooks}/>
      <Route
        name="bookdisplay" 
        path="books/:bookID" 
        component={BookDisplay}
        prepareParams={() => ({username: USERNAME})}
        queries={viewerQuery}/>
    </Route>
    <Route
      name="mybooks" 
      path='mybooks' 
      component={MyBooks}
      prepareParams={() => ({username: USERNAME})}
      queries={viewerQuery} 
      onEnter={isLoggedIn}>
      <IndexRoute
        name="indexRouteMyBooks" 
        component={MyBooksList}/>
      <Route
        name="addbook" 
        path="addbook" 
        component={AddBook}/>
      <Route 
        name="borrowedbooks" 
        path="borrowedbooks" 
        component={BorrowedBooks}/>
      <Route
        name="lendbooks" 
        path="lendbooks" 
        component={LendBooks}/>
      <Route
        name="borrowrequests" 
        path="borrowrequests" 
        component={BorrowRequests}/>
      <Route
        name="pendingrequests" 
        path="pendingrequests" 
        component={PendingRequests}/>
    </Route>
    <Route name="about" path="about" component={About}/>
    <Route name="404" path="*" component={UnMatchedRoutes}/>
  </Route>
);

export default routes;
