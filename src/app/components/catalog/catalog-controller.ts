// import type { ProductProjection } from '@commercetools/platform-sdk';

import Controller from '@components/controller';
import ProductsService from '@services/product_service/product_service';
import Pages from '@src/app/router/pages';
import type Router from '@src/app/router/router';

import CatalogView from './catalog-view';

export default class CatalogController extends Controller<CatalogView> {
  constructor(
    protected router: Router,
    protected filtersParams: string[]
  ) {
    super(new CatalogView(router));

    this.initContent();
  }

  private initContent() {
    ProductsService.resetFilters();
    if (!this.filtersParams) {
      ProductsService.getFilteredProducts()
        .then((data) => this.view.getProductCardView.setProducts(data.body.results))
        .catch(() => this.router.navigate(Pages.ERROR, true));
    } else {
      this.view.getFilterBlockView.setValues(this.filtersParams);
    }
  }
}
