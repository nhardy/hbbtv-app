import { combineReducers } from 'redux';
import { reducer as reduxAsyncConnect } from 'redux-connect';
import epg, { IEpgState } from './epg';
import hbbtv, { IHbbtvState } from './hbbtv';
import routeError, { IRouteErrorState } from './routeError';

export interface IReduxState {
  epg: IEpgState;
  hbbtv: IHbbtvState;
  reduxAsyncConnect: any;
  routeError: IRouteErrorState;
}

export default combineReducers({
  epg,
  hbbtv,
  reduxAsyncConnect,
  routeError,
});
