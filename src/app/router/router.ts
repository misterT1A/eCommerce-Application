import AuthService from '@services/auth-service';

import Pages from './pages';

export default class Router {
  protected routes: IRoute[];

  constructor(routes: IRoute[]) {
    this.routes = routes;

    window.addEventListener('popstate', this.changeBrowser.bind(this));
    document.addEventListener('DOMContentLoaded', () => {
      AuthService.sessionStateHandler();
      this.navigateToLastPoint();
    });
  }

  public navigate(url: string, popstate = false) {
    // to do / for products path
    // const request = this.parseUrl(url);
    // const pathForFind = request.resource === '' ? request.path : `${request.path}/${id}`;

    if (AuthService.isAuthorized() && [Pages.LOGIN, Pages.REG].includes(url)) {
      this.navigate(Pages.MAIN);
    }

    const route = this.routes.find((routeItem) => routeItem.path === url);
    if (!route) {
      this.navigate(Pages.ERROR);
      return;
    }

    route.callBack();
    if (!popstate) {
      window.history.pushState(null, '', `/${url}`);
    }
  }

  public navigateToLastPoint() {
    const path = this.getCurrentPath();
    this.navigate(path);
  }

  // to do / for products path
  // private parseUrl(url: string) {
  //   const result = {
  //     path: '',
  //   };

  //   const path = url.split('/');
  //   [result.path = '', result.resource = ''] = path;

  //   return result;
  // }

  private changeBrowser(): void {
    const path = this.getCurrentPath();
    this.navigate(path, true);
  }

  private getCurrentPath() {
    return window.location.pathname.slice(1);
  }
}
