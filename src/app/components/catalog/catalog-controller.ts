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
    ProductsService.getAllProduct().then((data) => this.view.getProductCardView.setContent(data));
  }
}
