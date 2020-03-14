import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Route } from 'react-router';
import { renderRoutes, RouteConfig } from 'react-router-config';
import VideoBroadcast from '../VideoBroadcast';
import { IReduxState } from '../../reducers';
import { IRouteErrorState } from '../../reducers/routeError';
import * as styles from './styles.styl';
import { ErrorPage } from '../../pages/ErrorPage';

interface IProps {
  route: { routes: RouteConfig[] };
  routeError: IRouteErrorState;
}

interface IState {}

class App extends Component<IProps, IState> {
  public render() {
    const { route, routeError } = this.props;
    return (
      <Route render={({ staticContext }) => {
        if (staticContext && routeError) {
          staticContext.statusCode = routeError.route.status;
        }
        return (
          <React.Fragment>
            <VideoBroadcast />
            <Helmet>
              <title>HbbTV App</title>
              <body className={styles.body} />
            </Helmet>
            {routeError ? (<ErrorPage status={routeError.route.status} />) : renderRoutes(route.routes)}
          </React.Fragment>
        );
      }} />
    );
  }
}

export default connect(({ routeError }: IReduxState) => ({
  routeError,
}))(App);
