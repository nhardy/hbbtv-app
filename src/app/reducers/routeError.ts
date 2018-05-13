import {
  SET_ROUTE_ERROR,
  CLEAR_ROUTE_ERROR,
} from '../actions/routeError';
import { AllActions } from '../actions';

export type IRouteErrorState = {
  route: {
    status: number;
  };
} | null;

const initialState: IRouteErrorState = null;

export default function routeError(state: IRouteErrorState = initialState, action: AllActions): IRouteErrorState {
  switch (action.type) {
    case SET_ROUTE_ERROR:
      return {
        route: {
          status: action.status,
        },
      };

    case CLEAR_ROUTE_ERROR:
      return null;

    default:
      return state;
  }
}
