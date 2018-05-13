/// <reference types="node" />
/// <reference types="react" />
/// <reference types="webpack" />
/// <reference path="../node_modules/hbbtv-typings/index.d.ts" />

declare module 'redux-connect' {
  const ReduxAsyncConnect: React.ComponentClass<{ routes: any[] }>;
  const asyncConnect: ClassDecorator;
  const loadOnServer: (params: {
    location: { pathname?: string },
    routes: any[],
    store?: { dispatch: (action: any) => any, getState: () => any },
    helpers?: any,
  }) => Promise<void>;
  const reducer: (state: any, action: any) => any;
  export { ReduxAsyncConnect, asyncConnect, loadOnServer, reducer };
}

declare var __CLIENT__: boolean;
declare var __SERVER__: boolean;
declare var __DEVELOPMENT__: boolean;

interface NodeModule {
  /**
   * Webpack HMR API
   */
  hot?: {
    accept(dependencies: string | string[], callback: () => void): void;
  };
}

interface Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any;
  __data: { [key: string]: any | undefined };
  React?: typeof React;
}

interface Error {
  status?: number;
}
