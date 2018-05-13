import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as path from 'path';
import * as webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';
import generateBabelConfig from './babel.generate.config';
import { identity } from 'lodash-es';
import WriteManifestPlugin from './WriteManifest.weback.plugin';

interface IWebpackEnv {
  client: boolean;
  env: 'development' | 'production';
}

export default function webpackConfig({ client, env }: IWebpackEnv): webpack.Configuration {
  const production = env !== 'development';
  const mode = production ? 'production' : 'development';
  return {
    mode,

    entry: client
      ? { bundle: ['@babel/polyfill', './src/client'] }
      : { server: ['@babel/polyfill', './src/server'] },

    output: {
      filename: client
        ? `[name]-[${production ? 'chunkhash' : 'hash'}:6].js`
        : '[name].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/static/',
    },

    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          include: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'node_modules', 'lodash-es'),
          ],
          use: [
            !production && {
              loader: 'cache-loader',
            },
            {
              loader: 'thread-loader',
            },
            {
              loader: 'babel-loader',
              options: generateBabelConfig(client, production, true),
            },
          ].filter(identity) as webpack.RuleSetUseItem[],
        }
      ],
    },

    optimization: {
      noEmitOnErrors: true,
      concatenateModules: true,
      nodeEnv: production ? 'production' : 'development',
      minimize: client && production,
      runtimeChunk: client ? 'single' : false,
      splitChunks: client ? { chunks: 'all' } : false,
    },

    devtool: !production || !client ? 'inline-source-map' : 'hidden-source-map',

    target: client ? 'web' : 'node',

    externals: client? [] : [
      nodeExternals({
        whitelist: [
          /lodash-es/,
        ],
      }),
    ],

    plugins: [
      new webpack.DefinePlugin({
        __CLIENT__: client,
        __DEVELOPMENT__: !production,
        __SERVER__: !client,
      }),
      !production && new webpack.HotModuleReplacementPlugin(),
      client && production && new MiniCssExtractPlugin({
        filename: '[name]-[chunkhash:6].css',
      }),
      !client && !production && new webpack.BannerPlugin({
        banner: 'require("source-map-support").install();',
        raw: true,
        entryOnly: false,
      }),
      production && new webpack.LoaderOptionsPlugin({
        minimize: true,
      }),
      client && new WriteManifestPlugin(client),
    ].filter(identity) as webpack.Plugin[],

    bail: process.env.CI ? JSON.parse(process.env.CI) : false,

    resolve: {
      modules: [
        'node_modules',
      ],
      extensions: ['.ts', '.tsx', '.js', '.json'],
    },
  };
}
