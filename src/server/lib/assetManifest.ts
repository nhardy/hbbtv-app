import * as fs from 'fs';

export interface IAssetManifest {
  publicPath: '/static/',
  bundle: {
    js: string;
  };
  runtime: {
    js: string;
  };
  ['vendors~bundle']: {
    js: string;
  };
}

let manifest: IAssetManifest | null = null;

export default function assetManifest(): IAssetManifest {
  if (!manifest || __DEVELOPMENT__) {
    manifest = JSON.parse(fs.readFileSync('./dist/webpackStats.json', 'utf-8')) as IAssetManifest;
  }
  return manifest;
}
