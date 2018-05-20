import { combineReducers } from 'redux';
import broadcast, { IBroadcastState } from './broadcast';

export interface IHbbtvState {
  broadcast: IBroadcastState;
}

export default combineReducers({
  broadcast,
});
