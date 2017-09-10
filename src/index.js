import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

import    React      from 'react';
import ReactDOM      from 'react-dom';
import ViewDoc       from './components/view-doc.jsx';
import ViewOpenUrl   from './components/view-openurl.jsx';
import Home          from './components/home.jsx';
import IVConfigModel from './models/config-model.js';

// import { Router, Route, Link, browserHistory } from 'react-router';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

var ivConfigModel = new IVConfigModel();

function render() {
  ReactDOM.render((
    <Router>
      <div>
        <Route exact path="/"
               component={(props) => (<Home config={ivConfigModel.data} location={props.location} />)} />

        <Route path="/document/openurl*"
               component={(props) => (<ViewOpenUrl config={ivConfigModel.data} location={props.location} />)} />
        <Route path="/openurl*"
               component={(props) => (<ViewOpenUrl config={ivConfigModel.data} location={props.location} />)} />

        <Route path="/([0-9A-Z]{40})"
               component={(props) => (<ViewDoc config={ivConfigModel.data} location={props.location} match={props.match} />)} />
        <Route path="/document/([0-9A-Z]{40})"
               component={(props) => (<ViewDoc config={ivConfigModel.data} location={props.location} match={props.match} />)} />
      </div>
    </Router>
  ), document.getElementById('root'));
}

ivConfigModel.subscribe(render);
render();