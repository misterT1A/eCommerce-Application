import type { Cart } from '@commercetools/platform-sdk';

import CartService from '@services/cart-service/cart-service';
import CurrentCart from '@services/cart-service/currentCart';
import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';
import { div, span } from '@utils/elements';

import styles from './_cart.scss';
import Card from './card-element/card-element';

export default class CartView extends BaseComponent {
  protected cart: Cart | null;

  constructor(protected router: Router) {
    super({ className: styles.wrapper });
    this.router = router;
    this.cart = CurrentCart.getCart;
    // CartService.createCart().then(() => console.log(CurrentCart.getCart));

    // setTimeout(() => {
    //   CartService.addToCart('103ab460-284b-4046-a8a8-df061ff1fb14');
    //   // CartService.addToCart('f2d03d06-a5a2-45eb-b14d-92e355398b5c');
    // }, 3000);

    // setTimeout(() => {
    //   // CartService.addToCart('103ab460-284b-4046-a8a8-df061ff1fb14');
    //   CartService.addToCart('f2d03d06-a5a2-45eb-b14d-92e355398b5c');
    // }, 6000);

    console.log(this.cart);
    CartService.showLP();
    this.setContent();
  }

  private setContent() {
    const title = span([styles.title], 'Your Cart');

    const cardsBlock = new BaseComponent({ className: styles.cards_wrapper }, this.setCardsBlock());
    const totalSumBlock = this.setTotalSumBlock();

    this.appendChildren([title, new BaseComponent({ className: styles.cart_inner }, cardsBlock, totalSumBlock)]);
  }

  private setCardsBlock() {
    const products = this.cart?.lineItems;
    const wrapper = div([styles.cards_wrapper]);

    products?.forEach((product) => {
      const card = new Card(product);
      wrapper.append(card);
    });

    return wrapper;
  }

  private setTotalSumBlock() {
    return div([styles.sum_block]);
  }
}
