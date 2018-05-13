// Adapted from https://gist.github.com/joshhunt/ed8ab8c757a77a2cf401

import * as fs from 'fs';
import { groupBy, noop, reduce } from 'lodash-es';
import mkdirp from 'mkdirp';
import * as path from 'path';
import * as webpack from 'webpack';


const ROOT = path.resolve(__dirname);

const getAssetsByChunk = (webpackData: any, publicPath: string) => {
  const chunkRenamer = (chunkName: string) => `${publicPath}${chunkName}`;
  const assetGrouper = (asset: string) => path.extname(asset).slice(1);

  return reduce(webpackData.assetsByChunkName, (acc, chunk, chunkName) => {
    const assets = (Array.isArray(chunk) ? chunk : [chunk]).map(chunkRenamer);
    return {
      ...acc,
      [chunkName]: groupBy(assets, assetGrouper),
    };
  }, {});
};

export default class WriteManifestPlugin {
  private compiler: webpack.Compiler;

  constructor(private client: boolean, private callback: () => void = noop) {}

  apply(compiler: webpack.Compiler) {
    this.compiler = compiler;
    compiler.plugin('done', this.onDone.bind(this));
  }

  writeFilesManifest(webpackData: any) {
    const { publicPath } = this.compiler.options.output as webpack.Output;
    const content = {
      publicPath,
      ...getAssetsByChunk(webpackData, publicPath as string),
    };

    const filepath = path.join(ROOT, 'dist/webpackStats.json');
    const folder = filepath.split('/').slice(0, -1).join('/');

    mkdirp.sync(folder);
    fs.writeFileSync(filepath, JSON.stringify(content, null, 2));
  }

  writeWebpackCache(webpackData: any) {
    const filepath = path.join(ROOT, `dist/webpack-dump-${this.client ? 'client' : 'server'}.json`);
    const folder = filepath.split('/').slice(0, -1).join('/');

    mkdirp.sync(folder);
    fs.writeFileSync(filepath, JSON.stringify(webpackData, null, 2));
  }

  onDone(rawWebpackStats: webpack.Stats) {
    const webpackData = rawWebpackStats.toJson();

    this.writeWebpackCache(webpackData);

    if (this.client) {
      this.writeFilesManifest(webpackData);
    }

    this.callback();
  }
}
