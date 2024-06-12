import type { CartUpdateAction, LineItem } from '@commercetools/platform-sdk';

import { setPrice } from '@components/catalog/card-element/card-model';
import CartService from '@services/cart-service/cart-service';
import CurrentCart from '@services/cart-service/currentCart';
import BaseComponent from '@utils/base-component';
import { div, p, span, svg } from '@utils/elements';
import setLoader from '@utils/loader/loader-view';

import styles from './_styles.scss';
import type CartView from '../cart-view';

export default class Card extends BaseComponent {
  constructor(
    protected props: LineItem,
    protected cartView: CartView
  ) {
    super({ className: styles.card_element /* data: { id: props.productId } */ });

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

  private setDescription() {
    const title = span([styles.description_title], this.props.name.en);

    const price = span([styles.description_price], setPrice(this.props.price.value.centAmount));
    if (this.props.price.discounted) {
      price.addClass(styles.price_throgh);
      price.append(p([styles.price_discount], setPrice(this.props.price.discounted.value.centAmount)));
    } else {
      price.addClass(styles.price);
    }
    console.log(this.props);

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
      await CartService.changeCartEntries([actionDescription]);
      this.cartView.updateView();
    });
    return removeButton;
  }
}
