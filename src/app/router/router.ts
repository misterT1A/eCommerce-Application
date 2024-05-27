import AuthService from '@services/auth-service';

import Pages from './pages';

export default class Router {
  protected routes: IRoute[];

  constructor(routes: IRoute[]) {
    this.routes = routes;

    window.addEventListener('popstate', this.changeBrowser.bind(this));
  }

  public navigate(url: string, popstate = false) {
    const request = this.parseUrl(url);

    if (AuthService.isAuthorized() && [Pages.LOGIN].includes(request.path)) {
      this.navigate(Pages.MAIN);
      return;
    }

    if (!AuthService.isAuthorized() && [Pages.ACCOUNT].includes(request.path)) {
      this.navigate(Pages.LOGIN);
      return;
    }

    const route = this.routes.find((routeItem) => routeItem.path === request.path);
    if (!route) {
      this.navigate(Pages.ERROR, true);
      return;
    }

    if (request.resource && request.path === Pages.PRODUCT) {
      route.callBack(request.resource);
    } else if (request.resource && request.path !== Pages.PRODUCT) {
      this.navigate(Pages.ERROR, true);
    } else {
      (route.callBack as () => void)();
    }

    if (!popstate) {
      window.history.pushState(null, '', `/${url}`);
    }
  }

  public navigateToLastPoint() {
    const path = this.getCurrentPath();

    this.navigate(path);
  }

  public navigateToProduct(name: string) {
    const route = this.routes.find((routeItem) => routeItem.path === Pages.PRODUCT);
    route?.callBack(name);
    window.history.pushState(null, '', `/product/${name}`);
  }

  private parseUrl(url: string) {
    const result = {
      path: '',
      resource: '',
    };

    const path = url.split('/');
    [result.path = '', result.resource = ''] = path;

    return result;
  }

  private changeBrowser(): void {
    const path = this.getCurrentPath();
    this.navigate(path, true);
  }

  public getCurrentPath() {
    return window.location.pathname.slice(1);
  }
}
