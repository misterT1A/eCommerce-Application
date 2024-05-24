import type { ProductProjection } from '@commercetools/platform-sdk';

import Controller from '@components/controller';
import ProductsService from '@services/product_service/product_service';
import type Router from '@src/app/router/router';

import CatalogView from './catalog-view';

export default class CatalogController extends Controller<CatalogView> {
  constructor(router: Router) {
    super(new CatalogView(router));

    this.initContent();
  }

  private initContent() {
    ProductsService.getAllProduct().then((data) => this.changeProducts(data));
  }

  // the ResProducts type can be supplemented with your own responsive option
  private changeProducts(res: ResProducts) {
    const products: ProductProjection[] = res.body.results;
    // pass only the array of products
    this.view.getProductCardView.setProducts(products);
  }
}
