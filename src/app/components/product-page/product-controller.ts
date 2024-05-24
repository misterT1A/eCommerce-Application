import Controller from '@components/controller';
import ProductsService from '@services/product_service/product_service';
import type Router from '@src/app/router/router';

import ProductView from './product-view';

export default class ProductController extends Controller<ProductView> {
  constructor(router: Router) {
    super(new ProductView(router));

    this.initContent();
  }

  private initContent() {
    ProductsService.getProductByName('rye-baguette').then((data) => this.getView.setContent(data.body));
  }
}
