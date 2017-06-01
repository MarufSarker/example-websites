import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import {hashHistory} from 'react-router';
import {RelayRouter} from 'react-router-relay';

import routes from './routes/routes';

// Render 
ReactDOM.render(
  <RelayRouter 
    history={hashHistory}
    routes={routes}
  />,
  document.getElementById('root')
);
