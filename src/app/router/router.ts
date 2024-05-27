import { CATEGORIES, FILTERS, SORT, SUBCATEGORIES } from '@components/catalog/filters/constants-filters';
import AuthService from '@services/auth-service';

import Pages from './pages';
import * as urlSeters from './router-model';

export default class Router {
  protected routes: IRoute[];

  protected filters: Set<string>;

  protected sorts: Set<string>;

  constructor(routes: IRoute[]) {
    this.routes = routes;

    this.filters = new Set();
    this.sorts = new Set();

    window.addEventListener('popstate', this.changeBrowser.bind(this));

    setTimeout(() => {
      window.history.pushState(null, '', `/catalog/BREAD/CIABATTAS`);
      this.setUrlCatalog('IS_VEGAN');
      this.setUrlCatalog('IS_SALE');
      // this.setUrlCatalog('IS_VEGAN');
      this.setUrlCatalog('PRICE_DESC');
      // this.setUrlCatalog('PRICE_DESC');
      this.setUrlCatalog('PRICE_ASC');
      this.setUrlCatalog('clear');
    }, 2000);
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

    if (request.resource.length && [Pages.PRODUCT].includes(request.path)) {
      (route.callBack as (name: string) => void)(request.resource[0]);
    } else if (request.resource.length && [Pages.CATALOG].includes(request.path)) {
      (route.callBack as (name: string[]) => void)(request.resource);
    } else if (request.resource.length && ![Pages.PRODUCT, Pages.CATALOG].includes(request.path)) {
      this.navigate(Pages.ERROR, true);
    } else {
      (route.callBack as () => void)();
    }

    if (!popstate) {
      window.history.pushState(null, '', `/${url}`);
    }
  }

  public setUrlCatalog(filter: string) {
    const path = this.getCurrentPath();
    const parsePath = path.split('/').splice(1);

    if (filter === 'clear') {
      window.history.pushState(null, '', `/${Pages.CATALOG}`);
      return;
    }

    if (filter in SORT) {
      urlSeters.setSort(parsePath, filter);
    }

    if (filter in CATEGORIES) {
      urlSeters.setCategoties(parsePath, filter);
    }

    if (filter in SUBCATEGORIES) {
      urlSeters.setSubCategories(parsePath, filter);
    }

    if (filter in FILTERS) {
      urlSeters.setFilters(parsePath, filter);
    }

    window.history.pushState(null, '', `/${Pages.CATALOG}/${parsePath.join('/')}`);
  }

  public navigateToLastPoint() {
    const path = this.getCurrentPath();

    this.navigate(path);
  }

  public navigateToProduct(name: string) {
    const route = this.routes.find((routeItem) => routeItem.path === Pages.PRODUCT);
    (route?.callBack as (name: string) => void)(name);
    window.history.pushState(null, '', `/product/${name}`);
  }

  private parseUrl(url: string) {
    const pathParse = url.split('/');
    const [path, ...resource] = pathParse;

    const result: { path: string; resource: string[] } = {
      path: path || '',
      resource: resource || [''],
    };

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
