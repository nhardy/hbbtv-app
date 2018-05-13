import { clearRouteError } from './actions/routeError';
import App from './components/App';
import Index from './pages/Index';
import { IReduxStore } from './redux/createStore';

export default function getRoutes(store: IReduxStore) {
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
