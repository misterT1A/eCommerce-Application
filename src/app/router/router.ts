import { CATEGORIES, FILTERS, SORT, SUBCATEGORIES } from '@components/catalog/filters/constants-filters';
import { isPriceFilter } from '@components/catalog/filters/price-filter-helpers';
import { closeModals } from '@components/modal/modal';
import AuthService from '@services/auth-service';

import Pages from './pages';
import * as urlSeters from './router-helpers';

export default class Router {
  protected routes: IRoute[];

  protected savedPath = '';

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
    if (request.resource.length && [Pages.PRODUCT].includes(request.path)) {
      (route.callBack as (name: string) => void)(request.resource[0]);
    } else if (request.resource.length && [Pages.CATALOG].includes(request.path)) {
      if (!urlSeters.checkRightURL(url)) {
        this.navigate(Pages.ERROR, true);
        return;
      }
      (route.callBack as (name: string[]) => void)(request.resource);
    } else if (request.resource.length && ![Pages.PRODUCT, Pages.CATALOG].includes(request.path)) {
      this.navigate(Pages.ERROR, true);
    } else {
      (route.callBack as () => void)();
    }

    if (!popstate) {
      window.history.pushState(null, '', `/${url}`);
    }
    closeModals();
  }

  public setUrlCatalog(filter: string, cardsCount?: number) {
    const path = this.getCurrentPath();
    const parsePath = path.split('/').splice(1);

    if (!urlSeters.checkRightURL(path)) {
      this.navigate(Pages.ERROR, true);
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

    if (isPriceFilter(filter)) {
      urlSeters.setParseRange(parsePath, filter);
    }

    if (urlSeters.isCountCards(filter)) {
      if (cardsCount) {
        urlSeters.setCountCards(parsePath, filter, cardsCount);
      }
    }

    const catalogUrl = `/${Pages.CATALOG}`;
    const filtersUrl = `/${urlSeters.sortUrl(parsePath)}`;
    window.history.pushState(null, '', !parsePath.length ? catalogUrl : catalogUrl + filtersUrl);
  }

  public setEmptyUrlCatalog() {
    window.history.pushState(null, '', `/${Pages.CATALOG}`);
  }

  public setEmptyCardsCountURL() {
    const path = this.getCurrentPath();
    const parsePath = path.split('/').splice(1);
    const countUrl = parsePath.find((elem) => urlSeters.isCountCards(elem));
    if (countUrl) {
      this.setUrlCatalog(countUrl, 100);
    }
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

  public navigateToCatalogFromProduct() {
    const savedPath = this.getSavedPath();
    if (savedPath) {
      this.navigate(savedPath);
      this.clearSavedPath();
    } else {
      this.navigate(Pages.CATALOG);
    }
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

  public savePath() {
    this.savedPath = this.getCurrentPath();
  }

  public getSavedPath() {
    return this.savedPath;
  }

  public clearSavedPath() {
    this.savedPath = '';
  }
}
