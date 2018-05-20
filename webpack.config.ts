import del from 'del';
import * as fs from 'fs';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import nodemon from 'nodemon';
import OnBuildWebpackPlugin from 'on-build-webpack';
import * as path from 'path';
import selfsigned from 'selfsigned';
import * as webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';
import generateBabelConfig from './babel.generate.config';
import { identity } from 'lodash-es';
import WriteManifestPlugin from './WriteManifest.weback.plugin';
import config from './src/app/config';

interface IWebpackEnv {
  client?: boolean;
  env: 'development' | 'production';
  serve?: boolean;
}

function ensureCertificate() {
  const certPath = path.resolve(__dirname, '.tmp', 'server.pem');
  let certExists = fs.existsSync(certPath);

  if (certExists) {
    const certStat = fs.statSync(certPath);
    const ONE_DAY = 1000 * 60 * 60 * 24;
    const now = Date.now();

    // If the certificate is more than 30 days old, remove it
    if (now - certStat.ctime.getTime() > 30 * ONE_DAY) {
      // eslint-disable-next-line no-console
      console.log('SSL Certificate is more than 30 days old. Removing.');
      del.sync([certPath], { force: true });
      certExists = false;
    }
  }

  if (!certExists) {
    // eslint-disable-next-line no-console
    console.log('Generating SSL Certificate');
    const attrs = [{ name: 'commonName', value: 'localhost' }];
    const pems = selfsigned.generate(attrs, {
      algorithm: 'sha256',
      days: 30,
      keySize: 2048,
    });

    fs.writeFileSync(certPath, pems.private + pems.cert, { encoding: 'utf-8' });
  }
}

let monitor: Nodemon.Monitor | null = null;

export default function webpackConfig({ client, env, serve }: IWebpackEnv): webpack.Configuration {
  const production = env !== 'development';
  const mode = production ? 'production' : 'development';

  if (!client) {
    ensureCertificate();
  }

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
        },
        {
          test: /\.txt$/,
          use: [
            {
              loader: 'text-loader',
            },
          ],
        },
        {
          test: /\.pem$/,
          use: [
            {
              loader: 'raw-loader',
            },
          ],
        },
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
          /react-loadable/,
          /is-webpack-bundle/,
          /webpack-require-weak/,
        ],
      }),
    ],

    plugins: [
      new webpack.DefinePlugin({
        __CLIENT__: client,
        __DEVELOPMENT__: !production,
        __SERVER__: !client,
      }),
      client && !production && new webpack.HotModuleReplacementPlugin(),
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
      !client && serve && new OnBuildWebpackPlugin(() => {
        if (!monitor) {
          monitor = nodemon({
            script: path.join(__dirname, 'dist', 'server.js'),
          });

          process.once('SIGINT', () => {
            monitor!.once('exit', () => {
              process.exit();
            });
          });
        } else {
          monitor!.restart();
        }
      }),
    ].filter(identity) as webpack.Plugin[],

    bail: process.env.CI ? JSON.parse(process.env.CI) : false,

    resolve: {
      modules: [
        'node_modules',
      ],
      extensions: ['.ts', '.tsx', '.js', '.json'],
    },

    devServer: client && !production ? {
      compress: true,
      contentBase: '/',
      disableHostCheck: true,
      historyApiFallback: true,
      host: '0.0.0.0',
      hot: true,
      https: true,
      lazy: false,
      noInfo: false,
      port: config.port,
      proxy: {
        '**': `http://localhost:${parseInt(`${config.port}`, 10) + 1}/`,
      },
      publicPath: '/static/',
      quiet: false,
      staticOptions: {},
      stats: {
        chunkModules: false,
        colors: true,
      },
      watchOptions: {
        aggregateTimeout: 300,
        poll: true,
      },
    } : undefined,
  };
}
