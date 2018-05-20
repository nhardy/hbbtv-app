declare module 'redux-connect' {
  import * as redux from 'redux';

  const ReduxAsyncConnect: React.ComponentClass<{ routes: any[] }>;
  const asyncConnect: ClassDecorator;
  const loadOnServer: (params: {
    location: { pathname?: string },
    routes: any[],
    store?: redux.Store,
    helpers?: any,
  }) => Promise<void>;
  const reducer: (state: any, action: any) => any;
  export { ReduxAsyncConnect, asyncConnect, loadOnServer, reducer };
}
