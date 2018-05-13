import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from '../app/components/App';
import { isForceRefreshRequired } from '../app/lib/device';
import { IReduxStore } from '../app/redux/createStore';

interface IProps {
  store: IReduxStore;
}

const Root = ({ store }: IProps) => (
  <Provider store={store} key="provider">
    <BrowserRouter basename="/" forceRefresh={isForceRefreshRequired()}>
      <App />
    </BrowserRouter>
  </Provider>
);

export default Root;
