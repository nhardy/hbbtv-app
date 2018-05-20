import React, { Component } from 'react';
import { connect } from 'react-redux';
import { renderRoutes, RouteConfig } from 'react-router-config';
import VideoBroadcast from '../VideoBroadcast';
import { IReduxState } from '../../reducers';
import { IRouteErrorState } from '../../reducers/routeError';
import { Route } from 'react-router';

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
            {renderRoutes(route.routes)}
          </React.Fragment>
        );
      }} />
    );
  }
}

export default connect(({ routeError }: IReduxState) => ({
  routeError,
}))(App);
