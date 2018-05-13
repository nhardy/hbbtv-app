import Express from 'express';
import mainMiddleware from './middleware/main';
import errorMiddleware from './middleware/error';

const app = Express();

app.get('/favicon.ico', (req, res) => {
  res.set('Content-Type', 'image/vnd.microsoft.icon');
  res.send();
});

app.get('/robots.txt', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send('');
});

app.use('/static', (req, res, next) => {
  if (['server.js'].map(file => `/static/${file}`).includes(req.originalUrl)) {
    const error = new Error('File not found');
    error.status = 404;
    next(error);
  } else {
    next();
  }
}, Express.static('dist', { maxAge: '1y' }));

app.use(mainMiddleware);
app.use(errorMiddleware);

export default app;
