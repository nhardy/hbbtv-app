import {
  applyMiddleware,
  compose,
  createStore as reduxCreateStore,
  Store,
} from 'redux';
import thunk from 'redux-thunk';
import reducer, { IReduxState } from '../reducers';
import { AllActions } from '../actions';

export type IReduxStore = Store<IReduxState, AllActions>;

export default function createStore(initialState: any = {}): IReduxStore {
  const composeEnhancers = (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ as typeof compose) || compose;
  const store = reduxCreateStore(
    reducer,
    initialState,
    composeEnhancers(
      applyMiddleware(
        thunk,
      ),
    ),
  );

  if (__DEVELOPMENT__) {
    if (module.hot) { // `module.hot` is injected by Webpack
      // Enable hot module reducer replacement
      module.hot.accept('../reducers', () => {
        store.replaceReducer(require('../reducers').default); // eslint-disable-line global-require
      });
    }
  }

  return store;
}
