require('@babel/register')({
  extensions: ['.js', '.ts', '.tsx'],
  ignore: [
    (filename) => {
      if (filename.includes('lodash-es')) return false;
      if (filename.includes('node_modules')) return true;
      return false;
    },
  ],
});
module.exports = require('./webpack.config.ts');
