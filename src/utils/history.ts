import { createBrowserHistory } from 'history';
import { isProd } from './env';

export const history = createBrowserHistory({
  basename: isProd() ? process.env.PUBLIC_URL : undefined
});
