import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { isForceRefreshRequired } from '../app/lib/device';
import { IReduxStore } from '../app/redux/createStore';
import { ReduxAsyncConnect } from 'redux-connect';
import getRoutes from '../app/getRoutes';

interface IProps {
  store: IReduxStore;
}

const Root = ({ store }: IProps) => (
  <Provider store={store} key="provider">
    <BrowserRouter basename="/" forceRefresh={isForceRefreshRequired()}>
      <ReduxAsyncConnect routes={getRoutes(store)} />
    </BrowserRouter>
  </Provider>
);

export default Root;
