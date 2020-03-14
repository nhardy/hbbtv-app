import * as thunk from 'redux-thunk';
import { isEmpty } from 'lodash-es';
import qs from 'querystring';
import config from '../config';
import { IReduxStore } from '../redux/createStore';
import { AllActions, AllFetchActions } from '../actions';
import { Action } from 'redux';
import { checkStatus } from '../lib/fetch';


export const FETCH_ACTION_TYPE = 'FETCH';

export type IFetchAction<Request, Success, Failure, O extends object = {}> = Action<'FETCH'> & {
  types: [Request, Success, Failure];
  endpoint: {
    url: string;
    query?: {
      [key: string]: any;
    };
  } & RequestInit;
} & O;

export type IFetchRequest<Type, O extends object = {}> = Action<Type> & O;

export type IFetchSuccess<Type, Response, O extends object = {}> = Action<Type> & {
  response: Response;
} & O;

export type IFetchFailure<Type, O extends object = {}> = Action<Type> & {
  error: Error;
} & O;

export default function fetchMiddleware(): thunk.ThunkMiddleware {
  return (next: thunk.ThunkDispatch<IReduxStore, undefined, AllActions>) => (action: AllActions) => {
    const { type } = action;
    if (type !== FETCH_ACTION_TYPE) {
      return next(action);
    }
    const { endpoint, types, ...rest } = action as AllFetchActions;

    const { url: _url, query = {}, ...requestOptions } = endpoint;
    const [REQUEST, SUCCESS, FAILURE] = types;
    next({ ...rest, type: REQUEST } as AllActions);

    let url = _url;
    if (__SERVER__) {
      // Relative URLs don't work on the server, so we need to use a fully qualified URL
      if (_url.startsWith('/')) {
        url = `http://localhost:${config.port}`;
      }
    }
    const search = isEmpty(query) ? '' : `?${qs.stringify(query)}`;

    return fetch(`${url}${search}`, requestOptions)
      .then(checkStatus)
      .then((raw: Response) => raw.json())
      .then(
        (response) => next({
          ...rest,
          response,
          type: SUCCESS,
        } as AllActions),
        (error) => next({
          ...rest,
          error,
          type: FAILURE,
        } as AllActions),
      )
      .catch((error) => {
        console.error('ERROR IN MIDDLEWARE:', error.stack || error);
        next({
          ...rest,
          error,
          type: FAILURE,
        } as AllActions);
      });
  };
}
