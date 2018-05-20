import React from 'react';
import { Helmet } from "react-helmet";
import { Store } from 'redux';
import { IAssetManifest } from '../../../server/lib/assetManifest';

interface IProps {
  assets: IAssetManifest;
  innerHTML: string;
  store: Store;
}

const Html = ({ assets, innerHTML, store }: IProps) => {
  const helmet = Helmet.renderStatic();

  return (
    <html lang="en" {...helmet.htmlAttributes.toComponent()}>
      <head>
        <meta httpEquiv="Content-Type" content="application/vnd.hbbtv.xhtml+xml; charset=UTF-8" />
        {helmet.title.toComponent()}
        {helmet.meta.toComponent()}
        {helmet.link.toComponent()}
        {helmet.base.toComponent()}
        {__DEVELOPMENT__ && (<script type="text/javascript" src="/webpack-dev-server.js" />)}
        {assets.runtime.js.map(path => (
          <script key={path} type="text/javascript" src={path} async defer />
        ))}
        {assets['vendors~bundle'].js.map(path => (
          <script key={path} type="text/javascript" src={path} async defer />
        ))}
        {assets.bundle.js.map(path => (
          <script key={path} type="text/javascript" src={path} async defer />
        ))}
      </head>
      <body {...helmet.bodyAttributes.toComponent()}>
        <div id="root" dangerouslySetInnerHTML={{
          __html: innerHTML,
        }} />
        <script dangerouslySetInnerHTML={{
          __html: `window.__data=${JSON.stringify(store.getState())};`,
        }} />
      </body>
    </html>
  );
};

export default Html;
