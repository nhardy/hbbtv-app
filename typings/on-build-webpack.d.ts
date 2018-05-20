declare module 'on-build-webpack' {
  import * as webpack from 'webpack';
  export default class OnBuildWebpackPlugin {
    constructor(callback: (stats: webpack.Stats) => void);
  }
}
