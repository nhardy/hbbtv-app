import { AllActions } from "../../actions";
import { ON_PLAY_STATE_CHANGE } from "../../actions/hbbtv/broadcast";
import { PlayState, PlayStateError } from "../../lib/hbbtv/broadcast";

export interface IBroadcastState {
  state: PlayState;
  error?: PlayStateError;
}

const initialState: IBroadcastState = {
  state: PlayState.UNREALIZED,
  error: undefined,
};

export default function broadcast(state: IBroadcastState = initialState, action: AllActions): IBroadcastState {
  switch (action.type) {
    case ON_PLAY_STATE_CHANGE:
      return {
        state: action.state,
        error: action.error,
      };

    default:
      return state;
  }
}
