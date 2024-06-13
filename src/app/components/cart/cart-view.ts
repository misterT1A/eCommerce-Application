import type { Cart } from '@commercetools/platform-sdk';

import { setPrice } from '@components/catalog/card-element/card-model';
import FormField from '@components/form-ui-elements/formField';
import type HeaderController from '@components/header/header_controller';
import Modal from '@components/modal/modal';
import notificationEmitter from '@components/notifications/notifications-controller';
import { actualizeCart, clearCart } from '@services/cart-service/cart-actions';
import CartService from '@services/cart-service/cart-service';
import CurrentCart from '@services/cart-service/currentCart';
import Pages from '@src/app/router/pages';
import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';
import { button, div, span, svg } from '@utils/elements';
import setLoader from '@utils/loader/loader-view';

import styles from './_cart.scss';
import Card from './card-element/card-element';
import general_styles from '../../_app_style.scss';

export default class CartView extends BaseComponent {
  protected cart: Cart | null;

  private totalSum: BaseComponent | null = null;

  private cards: Map<string, Card> = new Map();

  private cardsBlock: BaseComponent | null = null;

  private discountBlock: BaseComponent = div([styles.sum_discountCodes]);

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
    const checkoutBlock = this.setCheckoutBlock();
    const promoBlock = this.setPromoBlock();
    const buttonsBlock = this.setButtonsBlock();

    this.appendChildren([
      title,
      new BaseComponent(
        { className: styles.cart_inner },
        cardsBlockWrapper,
        checkoutBlock,
        div([styles.cart_buttons_block], promoBlock, buttonsBlock)
      ),
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
    this.cart = CurrentCart.getCart;
    await this.updateCards();
    await this.updateDiscountCodes();
    this.calculateTotalSum();
    this.headerController.setCartCount(CurrentCart.totalCount);
  }

  private async updateDiscountCodes() {
    // if any discount code is applied
    if (CurrentCart.discountCodes?.length) {
      this.discountBlock.setTextContent('Applied promo codes:');
      CurrentCart.discountCodes.forEach((code) => {
        const removeCodeBtn = span([styles.s], '', svg('assets/img/cross.svg#cross', styles.sum_discountCodes_svg));
        removeCodeBtn.addListener('click', async () => {
          const response = await CartService.changeCartEntries([
            {
              action: 'removeDiscountCode',
              discountCode: {
                typeId: 'discount-code',
                id: code.discountCode.id,
              },
            },
          ]);
          if (response.success) {
            notificationEmitter.showMessage({ messageType: 'info', text: 'Promo Code removed.' });
            this.updateView();
          }
        });
        this.discountBlock.append(
          div(
            [styles.sum_discountCodes_wrapper],
            span([styles.s], CartService.getDiscountCodeNameById(code.discountCode.id)),
            removeCodeBtn
          )
        );
      });
    } else {
      this.discountBlock.destroyChildren();
      this.discountBlock.setTextContent('');
    }
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

  private setCheckoutBlock() {
    const products = this.cart?.lineItems;
    const title = span([styles.sum_title], 'ORDER SUMMARY');
    const deliveryBlock = new FormField('Select delivery date', 'date');
    const deliveryDesc = div(
      [styles.sum_deliveryDesc],
      span([styles.sum_deliveryDesc_item], 'FREE Monday-Saturday all-day delivery on orders over £40 with DHL.'),
      span([styles.sum_deliveryDesc_item], 'For orders under £40, delivery with DHL starts at £5.00'),
      span([styles.sum_deliveryDesc_item], 'Premium delivery starts at £9.95')
    );

    this.totalSum = div([styles.sum_total], span([styles.sum_total_title], 'TOTAL'), div([styles.sum_total_price]));
    const checkoutBtn = button([styles.sum_checkoutBtn], 'PROCEED TO CHECKOUT');

    if (products) {
      this.calculateTotalSum();
    }

    return div(
      [styles.sum_block],
      title,
      deliveryBlock,
      deliveryDesc,
      this.setDiscountBlock(),
      this.totalSum,
      checkoutBtn
    );
  }

  private setDiscountBlock() {
    this.updateDiscountCodes();

    return this.discountBlock;
  }

  private calculateTotalSum() {
    this.totalSum?.getChildren[1].setTextContent(setPrice(this.cart?.totalPrice.centAmount, '0€'));
    if (CurrentCart.getCart?.discountCodes.length) {
      let fullPrice;
      const resultPrice = this.cart?.totalPrice.centAmount;
      const discountedPrice = this.cart?.discountOnTotalPrice?.discountedAmount.centAmount;
      if (resultPrice && discountedPrice) {
        fullPrice = resultPrice + discountedPrice;
        this.totalSum?.getChildren[1].setTextContent('');
        this.totalSum?.getChildren[1].appendChildren([
          span([styles.full_price], setPrice(fullPrice)),
          span([styles.discounted_price], setPrice(resultPrice)),
        ]);
      } else if (CartService.isClassicCroissantInCart() && CartService.isDOUBLECodeApplied()) {
        this.totalSum?.getChildren[1].setTextContent('');
        this.totalSum?.getChildren[1].appendChildren([
          span([styles.full_price], setPrice((resultPrice as number) * 2)),
          span([styles.discounted_price], setPrice(resultPrice)),
        ]);
      }
    }
  }

  private setPromoBlock() {
    const promoCodeInput = new FormField('Promo Code', 'text');
    promoCodeInput.addClass(styles.promo__input);
    const promoBtn = button([general_styles.btn, styles.promo__btn], 'APPLY PROMO CODE');
    promoBtn.addListener('click', async () => {
      const response = await CartService.changeCartEntries([
        {
          action: 'addDiscountCode',
          code: promoCodeInput.getValue().trim(),
        },
      ]);
      if (response.success) {
        promoCodeInput.reset();
        notificationEmitter.showMessage({ messageType: 'info', text: 'Promo Code is applied!' });
        this.updateView();
      }
    });
    return div([styles.promo_block], promoCodeInput, promoBtn);
  }

  private setButtonsBlock() {
    const clearCartButton = button([styles.sum_checkoutBtn, styles.clear_button], 'CLEAR CART');
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
    };
    clearCartButton.addListener('click', async () => clearCartHandler());

    return div([styles.buttons_block], clearCartButton);
  }
}
