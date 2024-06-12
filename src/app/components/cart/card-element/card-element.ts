import type { CartUpdateAction, LineItem } from '@commercetools/platform-sdk';

import { setPrice } from '@components/catalog/card-element/card-model';
import Modal from '@components/modal/modal';
import { actualizeCart } from '@services/cart-service/cart-actions';
import CartService from '@services/cart-service/cart-service';
import CurrentCart from '@services/cart-service/currentCart';
import BaseComponent from '@utils/base-component';
import { div, span, svg } from '@utils/elements';
import setLoader from '@utils/loader/loader-view';

import styles from './_styles.scss';
import type CartView from '../cart-view';

export default class Card extends BaseComponent {
  constructor(
    protected props: LineItem,
    protected cartView: CartView
  ) {
    super({ className: styles.card_element, data: { id: props.productId } });

    this.setContent();
  }

  private setContent() {
    this.appendChildren([
      this.setCardImg((this.props.variant.images as IImgCard[])[0].url),
      this.setDescription(),
      this.setRemoveButton(),
    ]);
  }

  private setCardImg(url: string) {
    const loader = setLoader();
    const imgWrapper = div([styles.img_wrapper], loader);

    const img = new BaseComponent<HTMLImageElement>({ tag: 'img', src: url });

    img.addListener('load', () => {
      if (img.getNode().width > img.getNode().height) {
        img.addClass(styles.img_Height);
      } else {
        img.addClass(styles.img_Width);
      }

      imgWrapper.getChildren[0]?.destroy();
      imgWrapper.append(img);
    });

    return imgWrapper;
  }

  public async remove() {
    await new Promise((res) => {
      this.addClass(styles.removed);
      setTimeout(() => {
        this.destroy();
        res(true);
      }, 500);
    });
  }

  private setDescription() {
    const title = span([styles.description_title], this.props.name.en);
    const price = span([styles.description_price], setPrice(this.props.price.value.centAmount));
    return div([styles.description_wrapper], title, price);
  }

  private setRemoveButton() {
    const removeButton = span([styles.removeButton], '', svg('/assets/img/cross.svg#cross', styles.svg__removeButton));
    const actionDescription: CartUpdateAction = {
      action: 'removeLineItem',
      lineItemId: CurrentCart.getLineItemIdByProductId(this.props.productId),
      quantity: this.props.quantity,
    };
    removeButton.addListener('click', async () => {
      const loader = new Modal({ loader: true, title: '', content: setLoader(), parent: this.cartView.getNode() });
      loader.open();
      const currentCart = await actualizeCart();
      if (currentCart.hasChanged) {
        await this.cartView.updateView();
      }
      await CartService.changeCartEntries([actionDescription]);
      loader.close();
      this.cartView.updateView();
    });
    return removeButton;
  }
}
