import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

import history from 'history';
import { RelayRouter } from 'react-router-relay';

import routes from './routes/routes';

// Render 
ReactDOM.render(
  <RelayRouter 
    history={history}
    routes={routes}
  />,
  document.getElementById('root')
);
