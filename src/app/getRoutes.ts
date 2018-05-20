import { RouteConfig } from 'react-router-config';
import { clearRouteError } from './actions/routeError';
import App from './components/App';
import { IReduxStore } from './redux/createStore';
import Index from './pages/Index';

export default function getRoutes(store: IReduxStore): RouteConfig[] {
  const onChange = () => {
    store.dispatch(clearRouteError());
  };
  return [
    {
      component: App,
      routes: [
        {
          path: '/',
          exact: true,
          component: Index,
        },
      ],
    },
  ];
}
