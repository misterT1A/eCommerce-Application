import Controller from '@components/controller';
import type HeaderController from '@components/header/header_controller';
import ProductService from '@services/product_service/product_service';
import Pages from '@src/app/router/pages';
import type Router from '@src/app/router/router';

import CatalogView from './catalog-view';

export default class CatalogController extends Controller<CatalogView> {
  constructor(
    protected router: Router,
    protected filtersParams: string[],
    private headerController: HeaderController
  ) {
    super(new CatalogView(router, headerController));

    this.initContent();
  }

  private initContent() {
    ProductService.resetFilters();
    if (!this.filtersParams) {
      ProductService.getFilteredProducts()
        .then((data) => {
          this.view.getProductCardView.setProducts(data.body);
          this.view.getFilterBlock.updatePriceRange(data);
        })
        .catch(() => this.router.navigate(Pages.ERROR, true));
    } else {
      this.view.getFilterBlock.setValues(this.filtersParams);
    }
  }
}
