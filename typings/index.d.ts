/// <reference types="node" />
/// <reference path="../node_modules/hbbtv-typings/index.d.ts" />
/// <reference path="./nodemon.d.ts" />
/// <reference path="./on-build-webpack.d.ts" />
/// <reference path="./redux-connect.d.ts" />
/// <reference path="./window.d.ts" />

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

interface Error {
  status?: number;
}
