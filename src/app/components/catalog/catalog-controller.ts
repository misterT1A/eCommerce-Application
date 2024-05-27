import type { ProductProjection } from '@commercetools/platform-sdk';

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
    this.view.getFilterBlockView.setValues(filtersParams || []);
    console.log(filtersParams);
  }

  private initContent() {
    ProductsService.getFilteredProducts()
      .then((data) => this.changeProducts(data))
      .catch(() => this.router.navigate(Pages.ERROR, true));
  }

  // the ResProducts type can be supplemented with your own responsive option
  private changeProducts(res: ResProducts) {
    const products: ProductProjection[] = res.body.results;
    // pass only the array of products
    this.view.getProductCardView.setProducts(products);
  }
}
