import './App.css';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import {
  Container,
  Header,
  Segment,
} from 'semantic-ui-react';

import AppMenu from './components/menu/AppMenu';
import routes from './configurations/routes';
import { stats } from './services/storage';
export default class App extends Component {
  render() {
    return (
      <div>
        <Container style={{ marginTop: '2em', marginBottom: '2em' }}>
          <Header as='h1'>Solution Architect Code Tracker</Header>
          <p>One place to track your projects.</p>
        </Container>
        <AppMenu />
        <Container>
            <Switch>
              <Route exact path={routes.DASHBOARD.path} component={routes.DASHBOARD.component} />
              <Route exact path={routes.PULL_REQUESTS.path} component={routes.PULL_REQUESTS.component} />
              <Route exact path={routes.WIKI.path} component={routes.WIKI.component} />
              <Route exact path={routes.TICKETS.path} component={routes.TICKETS.component} />
              <Route exact path={routes.SETTINGS.path} component={routes.SETTINGS.component} />
            </Switch>
        </Container>

        <Container className='app-footer-buffer' />
        <Segment className='app-footer'>
          NB Links: {stats().nbLinks} | NB Pull Requests: {stats().nbPullRequests}
        </Segment>
      </div>
    );
  }
}
