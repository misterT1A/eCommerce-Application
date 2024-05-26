import Controller from '@components/controller';
import ProductsService from '@services/product_service/product_service';
import Pages from '@src/app/router/pages';
import type Router from '@src/app/router/router';

import ProductView from './product-view';

export default class ProductController extends Controller<ProductView> {
  constructor(
    private router: Router,
    private productName: string
  ) {
    super(new ProductView(router));

    this.initContent();
  }

  private initContent() {
    ProductsService.getProductByName(this.productName)
      .then((data) => this.getView.setContent(data.body))
      .catch(() => this.router.navigate(Pages.ERROR, true));
  }
}
