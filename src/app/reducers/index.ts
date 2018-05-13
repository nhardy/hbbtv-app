import { combineReducers } from 'redux';
import { reducer as reduxAsyncConnect } from 'redux-connect';
import routeError, { IRouteErrorState } from './routeError';

export interface IReduxState {
  routeError: IRouteErrorState,
  reduxAsyncConnect: any,
}

export default combineReducers({
  routeError,
  reduxAsyncConnect,
});
