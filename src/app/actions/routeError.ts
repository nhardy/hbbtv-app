import { Action } from 'redux';

export const SET_ROUTE_ERROR = 'SET_ROUTE_ERROR';
export const CLEAR_ROUTE_ERROR = 'CLEAR_ROUTE_ERROR';

export interface ISetRouteErrorAction extends Action<'SET_ROUTE_ERROR'> {
  status: number;
}

export type IClearRouteErrorAction = Action<'CLEAR_ROUTE_ERROR'>;

export type IRouteErrorAction = ISetRouteErrorAction | IClearRouteErrorAction;

export function setRouteError({ status = 500 }: { status?: number } = {}): ISetRouteErrorAction {
  return {
    type: SET_ROUTE_ERROR,
    status,
  };
}

export function clearRouteError(): IClearRouteErrorAction {
  return {
    type: CLEAR_ROUTE_ERROR,
  };
}
