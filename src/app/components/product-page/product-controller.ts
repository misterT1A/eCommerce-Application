import type { ProductProjection } from '@commercetools/platform-sdk';

import Controller from '@components/controller';
import type HeaderController from '@components/header/header_controller';
import Modal from '@components/modal/modal';
import notificationEmitter from '@components/notifications/notifications-controller';
import { actualizeCart, getMessage, updateCart, updateProductsInCart } from '@services/cart-service/cart-actions';
import CurrentCart from '@services/cart-service/currentCart';
import ProductsService from '@services/product_service/product_service';
import Pages from '@src/app/router/pages';
import type Router from '@src/app/router/router';
import type BaseComponent from '@utils/base-component';
import debounce from '@utils/debounce';
import setLoader from '@utils/loader/loader-view';

import ProductView from './product-view';

export default class ProductController extends Controller<ProductView> {
  constructor(
    private router: Router,
    private productName: string,
    private headerController: HeaderController
  ) {
    super(new ProductView(router, headerController));

    this.initContent();
  }

  private initContent() {
    ProductsService.getProductByName(this.productName)
      .then((data) => {
        this.getView.setContent(data.body);
        const handler = async () => {
          await this.handleInput(data.body);
        };
        const debounced = debounce(handler, 600);
        this.getView.addListener('input', debounced);
        this.getView.removeFromCartButton?.addListener('click', async () => {
          const loader = new Modal({
            title: '',
            content: setLoader(),
            loader: true,
            parent: this.getView.getNode(),
          });
          await this.removeFromCart(loader, data.body);
          this.getView.count.setValue(1);
          this.headerController.setCartCount(CurrentCart.totalCount);
          this.getView.setButtonsActive(this.getView.addBtn.getValue());
        });
      })
      .catch(() => {
        this.router.navigate(Pages.ERROR, true);
      });
  }

  private async removeFromCart(loader: Modal<BaseComponent>, data: ProductProjection) {
    this.getView.addBtn.unselect();
    loader.open();
    await actualizeCart();
    const resp = await updateProductsInCart({ productID: data.id, count: 0 });
    if (resp.success && resp.actions?.length) {
      notificationEmitter.showMessage({
        messageType: 'success',
        ...getMessage(resp.actions[0], data.name.en ?? ''),
      });
    }
    loader.close();
    return resp;
  }

  private async handleInput(data: ProductProjection) {
    let result = { success: false };
    const loader = new Modal({
      title: '',
      content: setLoader(),
      loader: true,
      parent: this.getView.getNode(),
    });
    const productQuantityInCart = CurrentCart.getProductCountByID(data.id);
    let hasChanged = false;
    if (!this.getView.count.getValue() || this.getView.count.getValue() <= 0) {
      if (this.getView.addBtn.getValue()) {
        const resp = await this.removeFromCart(loader, data);
        result = { success: resp.success };
      }
      this.getView.count.setValue(1);
    } else if (this.getView.addBtn.getValue()) {
      loader.open();
      await actualizeCart();
      hasChanged = (
        await updateCart({ productID: data.id, count: this.getView.count.getValue(), name: data.name.en ?? '' })
      ).success;
      if (!hasChanged) {
        this.getView.resetControls(productQuantityInCart);
      }
      loader.close();
    }
    this.headerController.setCartCount(CurrentCart.totalCount);
    this.getView.setButtonsActive(this.getView.addBtn.getValue());
    return result;
  }
}
