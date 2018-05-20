import { combineReducers } from 'redux';
import { reducer as reduxAsyncConnect } from 'redux-connect';
import hbbtv, { IHbbtvState } from './hbbtv';
import routeError, { IRouteErrorState } from './routeError';

export interface IReduxState {
  hbbtv: IHbbtvState;
  routeError: IRouteErrorState;
  reduxAsyncConnect: any;
}

export default combineReducers({
  hbbtv,
  routeError,
  reduxAsyncConnect,
});
