import http, { Server } from 'http';
import config from '../app/config';
import app from './app';

let server: Server;
if (process.env.DUAL_ORIGIN) {
  const cert = require('../../.tmp/server.pem');
  server = require('httpolyglot')
    .createServer({ key: cert, cert }, app);
} else {
  server = http.createServer(app);
}

let { port } = config;
if (__DEVELOPMENT__) port = parseInt(`${port}`, 10) + 1;

server.listen(port);
