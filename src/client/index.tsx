import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import createStore from '../app/redux/createStore';
import Root from './Root';

const store = createStore(window.__data);
const mountPoint = document.getElementById('root');

function render(Component: typeof Root = Root) {
  ReactDOM.hydrate(
    <AppContainer>
      <Component store={store} />
    </AppContainer>,
    mountPoint,
  )
}

render();

if (module.hot) {
  module.hot.accept('./Root', () => {
    render(require('./Root').default);
  });
}

if (__DEVELOPMENT__) {
  window.React = React;
}
