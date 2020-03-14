
declare module 'redux-connect' {
  import { MapStateToProps, MapDispatchToProps } from 'react-redux';
  import { RouteConfig } from 'react-router-config';
  import * as redux from 'redux';

  const ReduxAsyncConnect: React.ComponentClass<{ routes: any[] }>;
  interface AsyncProp<S> {
    promise: (arg: { store: S }) => Promise<void>;
  }
  type AsyncConnect = <Store = redux.Store, State = {}, OwnProps = {}, TStateProps = {}>(
    asyncProps: AsyncProp<Store>[],
    mapStateToProps?: (state: State, ownProps: OwnProps) => TStateProps,
    mapDispatchToProps?: { [prop: string]: redux.ActionCreator<redux.AnyAction> },
    mergeProps?: any,
    options?: any,
  ) => <T>(component: T) => T;
  const asyncConnect: AsyncConnect;
  const loadOnServer: (params: {
    location: { pathname?: string },
    routes: RouteConfig[],
    store?: redux.Store,
    helpers?: any,
  }) => Promise<void>;
  const reducer: (state: any, action: any) => any;
  export { ReduxAsyncConnect, asyncConnect, loadOnServer, reducer };
}
