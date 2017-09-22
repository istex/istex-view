import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { reducer } from './reducer.js';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas.js';

import ViewDoc       from './components/view-doc.jsx';
import ViewOpenUrl   from './components/view-openurl.jsx';
import Home          from './components/home.jsx';
import IVConfigModel from './models/config-model.js';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

//var ivConfigModel = new IVConfigModel();

const sagaMiddleware = createSagaMiddleware();
// const store = createStore(reducer, applyMiddleware(sagaMiddleware));

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, /* preloadedState, */ composeEnhancers(
  applyMiddleware(sagaMiddleware)
));
sagaMiddleware.run(rootSaga);

function render() {
  ReactDOM.render((
    <Provider store={store}>
      <Router>
        <div>
          <Route exact path="/"
                component={(props) => (<Home location={props.location} />)} />

          <Route path="/document/openurl*"
                component={(props) => (<ViewOpenUrl location={props.location} />)} />
          <Route path="/openurl*"
                component={(props) => (<ViewOpenUrl location={props.location} />)} />

          <Route path="/([0-9A-Z]{40})"
                component={(props) => (<ViewDoc location={props.location} match={props.match} />)} />
          <Route path="/document/([0-9A-Z]{40})"
                component={(props) => (<ViewDoc location={props.location} match={props.match} />)} />
        </div>
      </Router>
    </Provider>
  ), document.getElementById('root'));
}

//ivConfigModel.subscribe(render);
render();