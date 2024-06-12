import type { Cart } from '@commercetools/platform-sdk';

import { setPrice } from '@components/catalog/card-element/card-model';
import FormField from '@components/form-ui-elements/formField';
import type HeaderController from '@components/header/header_controller';
import Modal from '@components/modal/modal';
import notificationEmitter from '@components/notifications/notifications-controller';
import { actualizeCart, clearCart } from '@services/cart-service/cart-actions';
import CurrentCart from '@services/cart-service/currentCart';
import Pages from '@src/app/router/pages';
import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';
import { button, div, span } from '@utils/elements';
import setLoader from '@utils/loader/loader-view';

import styles from './_cart.scss';
import Card from './card-element/card-element';

export default class CartView extends BaseComponent {
  protected cart: Cart | null;

  private subTotal: BaseComponent | null = null;

  private totalSum: BaseComponent | null = null;

  private cards: Map<string, Card> = new Map();

  private cardsBlock: BaseComponent | null = null;

  constructor(
    protected router: Router,
    protected headerController: HeaderController
  ) {
    super({ className: styles.wrapper });
    this.router = router;
    this.cart = CurrentCart.getCart;

    this.setContent();
  }

  private setContent() {
    this.headerController.setCartCount(CurrentCart.totalCount);

    const title = span([styles.title], 'Your Cart');

    const cardsBlockWrapper = new BaseComponent({ className: styles.cards_wrapper }, this.setCardsBlock());
    const totalSumBlock = this.setTotalSumBlock();
    const promoBlock = this.setPromoBlock();
    const buttonsBlock = this.setButtonsBlock();

    this.appendChildren([
      title,
      new BaseComponent({ className: styles.cart_inner }, cardsBlockWrapper, totalSumBlock, promoBlock, buttonsBlock),
    ]);
  }

  private setCardsBlock() {
    const products = this.cart?.lineItems;
    this.cardsBlock = div([styles.cards_wrapper]);

    if (!products?.length) {
      this.setEmptyCardsBlockContent();
    }

    this.updateCards();
    return this.cardsBlock;
  }

  public async updateView() {
    // this.destroyChildren();
    // this.cart = CurrentCart.getCart;
    // this.setContent();
    this.cart = CurrentCart.getCart;
    await this.updateCards();
    this.updatePrice();
    this.headerController.setCartCount(CurrentCart.totalCount);
  }

  public async updateCards() {
    const { products } = CurrentCart;
    products.forEach((product) => {
      if (!this.cards.has(product.productId)) {
        const card = new Card(product, this);
        this.cards.set(product.productId, card);
        this.cardsBlock?.append(card);
      }
    });
    const cardsRemove: Promise<void>[] = [];
    this.cards.forEach((card, key) => {
      if (!CurrentCart.getProductCountByID(key)) {
        cardsRemove.push(card.remove());
      }
    });
    await Promise.all(cardsRemove);
    if (!products.length) {
      this.setEmptyCardsBlockContent();
    }
  }

  private setEmptyCardsBlockContent() {
    this.cardsBlock?.destroyChildren();
    this.cardsBlock?.append(
      div(
        [styles.empty_wrapper],
        span([styles.empty_title], 'Your Cart is Empty'),
        button([styles.sum_checkoutBtn, styles.empty_button], 'BACK TO CATALOG', {
          onclick: () => this.router.navigate(Pages.CATALOG),
        })
      )
    );
  }

  public updatePrice() {
    const { products } = CurrentCart;
    if (products) {
      const price = this.cart?.totalPrice.centAmount;
      this.subTotal?.getChildren[1].setTextContent(price ? setPrice(price) : `0`);
      this.totalSum?.getChildren[1].setTextContent(price ? setPrice(price) : `0`);
    }
  }

  private setTotalSumBlock() {
    const products = this.cart?.lineItems;
    const title = span([styles.sum_title], 'ORDER SUMMARY');
    this.subTotal = div(
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

    this.totalSum = div(
      [styles.sum_total],
      span([styles.sum_total_title], 'TOTAL'),
      span([styles.sum_total_price], 'Cart is empty')
    );

    const chekoutBtn = button([styles.sum_checkoutBtn], 'PROCEED TO CHECKOUT');
    chekoutBtn.getNode().disabled = true;

    if (products) {
      chekoutBtn.getNode().disabled = false;
    }

    this.updatePrice();

    return div([styles.sum_block], title, this.subTotal, deliveryblock, deliveryDesc, this.totalSum, chekoutBtn);
  }

  private setPromoBlock() {
    return div([styles.promo_block]);
  }

  private setButtonsBlock() {
    const clearCartButton = button([styles.sum_checkoutBtn, styles.empty_button], 'CLEAR CART');
    const clearCartHandler = async () => {
      const loader = new Modal({ loader: true, title: '', content: setLoader(), parent: this.getNode() });
      loader.open();
      const currentCart = await actualizeCart();
      if (currentCart.hasChanged) {
        await this.updateView();
      }
      const clearCartResp = await clearCart();
      loader.close();
      if (clearCartResp.success) {
        notificationEmitter.showMessage({
          messageType: 'success',
          title: 'Cart was cleared!',
          text: 'Your cart was cleared! Back to catalog to continue shopping.',
        });
        this.updateView();
      }
      // } else if (clearCartResp.reason === 409) {
      //     const currentCart = await actualizeCart();
      //     if (currentCart.hasChanged) {
      //       await this.updateView();
      //     }
      //     await clearCartHandler()
      //   }
    };
    clearCartButton.addListener('click', async () => clearCartHandler());

    return div([styles.buttons_block], clearCartButton);
  }
}
