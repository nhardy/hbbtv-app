import { Request, Response, NextFunction } from 'express';
import React from 'react';
import { renderToString} from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router';
import { ReduxAsyncConnect, loadOnServer } from 'redux-connect';
import { parse as parseUrl } from 'url';
import createStore from '../../app/redux/createStore';
import Html from '../../app/components/Html';
import getRoutes from '../../app/getRoutes';
import assetManifest from '../lib/assetManifest';

export default function main(req: Request, res: Response, next: NextFunction) {
  const location = parseUrl(req.originalUrl || req.url);
  const store = createStore();
  const routes = getRoutes(store);

  loadOnServer({ store, location, routes })
    .then(() => {
      const { routeError } = store.getState();
      if (routeError) {
        const error = new Error('Route Error present in store');
        error.status = routeError.route.status;
        throw error;
      }

      const context: { url?: string } = {};

      const innerHTML = renderToString(
        <Provider store={store} key="provider">
          <StaticRouter location={location} context={context}>
            <ReduxAsyncConnect routes={routes} />
          </StaticRouter>
        </Provider>
      );

      if (context.url) {
        res.redirect(302, context.url);
      } else {
        const html = renderToString(<Html assets={assetManifest()} innerHTML={innerHTML} store={store} />);
        res.set('Cache-Control', 'public, maxage=300');
        res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html>\n${html}`);
      }
    })
    .catch((error: Error) => {
      console.log('problem', error);
      next(error);
    });
}
