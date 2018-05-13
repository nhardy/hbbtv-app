import { NextFunction, Request, Response } from 'express';
import React from 'react';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router';
import { loadOnServer, ReduxAsyncConnect } from 'redux-connect';
import { renderToString } from 'react-dom/server';
import { setRouteError } from '../../app/actions/routeError';
import Html from '../../app/components/Html';
import createStore from '../../app/redux/createStore';
import getRoutes from '../../app/getRoutes';
import assetManifest from '../lib/assetManifest';

export default function errorMiddleware(error: Error, req: Request, res: Response, next: NextFunction) {
  const onUnrecoverableError = (error: Error) => {
    console.log('Unrecoverable Error:', error);
    res.status(500);
    res.send('Unrecoverable Error');
  };
  const { status = 500 } = error;
  const location = { pathname: status === 404 ? '/__404__' : '/__500__' };
  const store = createStore();
  store.dispatch(setRouteError({ status }));
  const routes = getRoutes(store);

  loadOnServer({ store, location, routes })
    .then(() => {
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
        res.status(status);
        res.set({ 'Cache-Control': 'public, maxage=300' });
        res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html>\n${html}`);
      }
    })
    .catch(onUnrecoverableError);
}
