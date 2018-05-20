import { Action } from 'redux';
import { PlayState, PlayStateError } from '../../lib/hbbtv/broadcast';

export const ON_PLAY_STATE_CHANGE = 'HBBTV/ON_PLAY_STATE_CHANGE';

export interface IOnPlayStateChangeAction extends Action<'HBBTV/ON_PLAY_STATE_CHANGE'> {
  state: PlayState,
  error?: PlayStateError,
}

export function onPlayStateChange(state: PlayState, error?: PlayStateError): IOnPlayStateChangeAction {
  return {
    type: ON_PLAY_STATE_CHANGE,
    state,
    error,
  }
}

export type IBroadcastActions = IOnPlayStateChangeAction;
