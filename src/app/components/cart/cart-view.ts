import type { Cart } from '@commercetools/platform-sdk';

import { setPrice } from '@components/catalog/card-element/card-model';
import FormField from '@components/form-ui-elements/formField';
import CurrentCart from '@services/cart-service/currentCart';
import Pages from '@src/app/router/pages';
import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';
import { button, div, span } from '@utils/elements';

import styles from './_cart.scss';
import Card from './card-element/card-element';

export default class CartView extends BaseComponent {
  protected cart: Cart | null;

  constructor(protected router: Router) {
    super({ className: styles.wrapper });
    this.router = router;
    this.cart = CurrentCart.getCart;

    this.setContent();
  }

  private setContent() {
    const title = span([styles.title], 'Your Cart');

    const cardsBlock = new BaseComponent({ className: styles.cards_wrapper }, this.setCardsBlock());
    const totalSumBlock = this.setTotalSumBlock();
    const promoBlock = this.setPromoBlock();

    this.appendChildren([
      title,
      new BaseComponent({ className: styles.cart_inner }, cardsBlock, totalSumBlock, promoBlock),
    ]);
  }

  private setCardsBlock() {
    const products = this.cart?.lineItems;
    const wrapper = div([styles.cards_wrapper]);

    if (!products?.length) {
      return div(
        [styles.empty_wrapper],
        span([styles.empty_title], 'Your Cart is Empty'),
        button([styles.sum_checkoutBtn, styles.empty_button], 'BACK TO CATALOG', {
          onclick: () => this.router.navigate(Pages.CATALOG),
        })
      );
    }

    products?.forEach((product) => {
      const card = new Card(product, this);
      wrapper.append(card);
    });

    return wrapper;
  }

  public updateView() {
    this.destroyChildren();
    this.cart = CurrentCart.getCart;
    this.setContent();
  }

  private setTotalSumBlock() {
    const products = this.cart?.lineItems;
    const title = span([styles.sum_title], 'ORDER SUMMARY');
    const subTotal = div(
      [styles.sum_subTotal],
      span([styles.sum_subTotal_title], 'SUBTOTAL'),
      span([styles.sum_subTotal_price], 'Cart is empty')
    );

    const deliveryblock = new FormField('Select delivery date', 'date');

    const deliveryDesc = div(
      [styles.sum_deliveryDesc],
      span([styles.sum_deliveryDesc_item], 'FREE Monday-Saturday all-day delivery on orders over £40 with DHL.'),
      span([styles.sum_deliveryDesc_item], 'For orders under £40, delivery with DHL starts at £5.00'),
      span([styles.sum_deliveryDesc_item], 'Premium delivery starts at £9.95')
    );

    const totalsum = div(
      [styles.sum_total],
      span([styles.sum_total_title], 'TOTAL'),
      span([styles.sum_total_price], 'Cart is empty')
    );

    const chekoutBtn = button([styles.sum_checkoutBtn], 'PROCEED TO CHECKOUT');
    chekoutBtn.getNode().disabled = true;

    if (products) {
      subTotal.getChildren[1].setTextContent(setPrice(this.cart?.totalPrice.centAmount));
      totalsum.getChildren[1].setTextContent(setPrice(this.cart?.totalPrice.centAmount));
      chekoutBtn.getNode().disabled = false;
    }

    return div([styles.sum_block], title, subTotal, deliveryblock, deliveryDesc, totalsum, chekoutBtn);
  }

  private setPromoBlock() {
    return div([styles.promo_block]);
  }
}
