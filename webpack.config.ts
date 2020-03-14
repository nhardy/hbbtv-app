import autoprefixer from 'autoprefixer';
import del from 'del';
import * as fs from 'fs';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import nodemon from 'nodemon';
import OnBuildWebpackPlugin from 'on-build-webpack';
import * as path from 'path';
import selfsigned from 'selfsigned';
import hash from 'string-hash';
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

const postcssOptions = {
  ident: 'postcss',
  sourceMap: true,
  plugins() {
    return [
      autoprefixer({ browsers: ['last 2 versions'] }),
    ];
  },
};

const styleLoader = ({ production }: { production: boolean }) => {
  if (production) return MiniCssExtractPlugin.loader;
  return {
    loader: 'style-loader',
    options: { singleton: true },
  };
}

const stylusLoaders = ({ production, client }: { production: boolean, client: boolean }) => {
  const options = {
    importLoaders: 2,
    modules: true,
    localIdentName: production
      ? '[hash:base64:8]'
      : '[path][name]--[local]--[hash:base64:5]',
  };
  if (client) return [
    styleLoader({ production }),
    {
      loader: 'css-loader',
      options,
    },
    {
      loader: 'postcss-loader',
      options: postcssOptions,
    },
    {
      loader: 'stylus-loader',
    },
  ];
  return [
    {
      loader: 'css-loader/locals',
      options,
    },
    {
      loader: 'postcss-loader',
      options: postcssOptions,
    },
    {
      loader: 'stylus-loader',
    },
  ];
};

const cssLoaders = ({ production, client }: { production: boolean, client: boolean}) => {
  if (client) return [
    styleLoader({ production }),
    {
      loader: 'css-loader',
    },
  ];
  return [
    {
      loader: 'css-loader/locals',
    },
  ];
};

const svgoOptions = {
  plugins: [],
  floatPrecision: 2,
};

const svgoCleanupIdsPlugin = (resource: string) => ({
  cleanupIDs: {
    prefix: `svg-${hash(path.relative(__dirname, resource))}-`,
  },
});

const urlLoader = {
  loader: 'url-loader',
  options: {
    limit: 5120,
    name: '[name]-[hash:6].[ext]',
  },
};

export default function webpackConfig({ client = false, env, serve }: IWebpackEnv): webpack.Configuration {
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
          test: /\.styl$/,
          use: stylusLoaders({ production, client }),
        },
        {
          test: /\.css$/,
          use: cssLoaders({ production, client }),
        },
        {
          test: /\.(?:jpe?g|png|woff2?|ttf)(?:\?.*$|$)/,
          use: [
            urlLoader,
          ]
        },
        {
          test: /\.svg$/,
          use: [
            urlLoader,
            ({ resource }) => ({
              loader: 'svgo-loader',
              options: {
                ...svgoOptions,
                plugins: [
                  ...svgoOptions.plugins,
                  svgoCleanupIdsPlugin(resource),
                  { removeTitle: true },
                ],
              },
            }),
          ],
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

    externals: client ? [] : [
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
      new webpack.ProvidePlugin({
        fetch: 'isomorphic-fetch',
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
        path.join(__dirname, 'src'),
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
