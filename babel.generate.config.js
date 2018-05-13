module.exports = function(isBrowser, isProduction, isWebpack) {
  const envOptions = {
    modules: isWebpack ? false : 'commonjs',
    targets: isBrowser ? { browsers: ['last 2 versions'] } : { node: 'current' },
  };
  const config = {
    presets: [
      [
        '@babel/preset-env',
        envOptions,
      ],
      '@babel/preset-react',
      '@babel/preset-stage-3',
      '@babel/preset-typescript',
    ],
    plugins: [],
  };
  if (!isProduction) {
    config.plugins.push('react-hot-loader/babel');
  }
  if (isWebpack) config.babelrc = false;
  return config;
}
