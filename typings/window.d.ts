import * as React from 'react';
import { compose } from 'redux';
import { IReduxState } from '../src/app/reducers';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    __data: IReduxState;
    React?: typeof React;
  }
}
