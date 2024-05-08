// import Pages from './pages';
// import { SessionStorageService } from '../services/session-storage';

interface IRoute {
  path: string;
  callBack: () => void;
}

export default class Router {
  protected routes: IRoute[];

  constructor(routes: IRoute[]) {
    this.routes = routes;

    window.addEventListener('popstate', this.changeBrowser.bind(this));
    document.addEventListener('DOMContentLoaded', this.navigateToLastPoint.bind(this));
  }

  public navigate(url: string) {
    const request = this.parseUrl(url);

    const route = this.routes.find((routeItem) => routeItem.path === request.path);
    if (!route) {
      return;
    }
    route?.callBack();

    window.history.pushState(null, '', `#${url}`);
  }

  public navigateToLastPoint() {}

  private parseUrl(url: string) {
    const result = {
      path: '',
    };

    const path = url.split('/');
    [result.path = ''] = path;

    return result;
  }

  private changeBrowser() {}

  // private isLogin() {
  //   return SessionStorageService.getData('login');
  // }

  private getCurrentPath() {
    if (window.location.hash) {
      return window.location.hash.slice(1);
    }
    return window.location.pathname.slice(1);
  }
}
