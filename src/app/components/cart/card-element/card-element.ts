import type { LineItem } from '@commercetools/platform-sdk';

import { setPrice } from '@components/catalog/card-element/card-model';
import Count from '@components/form-ui-elements/countInput';
import Modal from '@components/modal/modal';
import { updateCart } from '@services/cart-service/cart-actions';
import CurrentCart from '@services/cart-service/currentCart';
import BaseComponent from '@utils/base-component';
import debounce from '@utils/debounce';
import { div, p, span, svg } from '@utils/elements';
import setLoader from '@utils/loader/loader-view';

import styles from './_styles.scss';
import type CartView from '../cart-view';

export default class Card extends BaseComponent {
  private count = new Count();

  private totalPrice = 0;

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
      this.setTotalPriceBlock(),
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
    if (this.props.price.discounted) {
      price.addClass(styles.price_throgh);
      price.append(p([styles.price_discount], setPrice(this.props.price.discounted.value.centAmount)));
    } else {
      price.addClass(styles.price);
    }
    this.count.setValue(this.props.quantity);
    this.count.addClass(styles.count);
    this.setInputHandler();
    return div([styles.description_wrapper], title, price, this.count);
  }

  private setInputHandler() {
    const handler = async () => {
      const loader = new Modal({ loader: true, title: '', content: setLoader(), parent: this.cartView.getNode() });
      let hasChanged = false;
      const productQuantityInCart = CurrentCart.getProductCountByID(this.props.productId);
      loader.open();
      hasChanged = (
        await updateCart({
          productID: this.props.productId,
          count: this.count.getValue(),
          name: this.props.name.en ?? '',
        })
      ).success;
      if (!hasChanged) {
        this.count.setValue(productQuantityInCart || 1);
      }
      this.cartView.updateView();
      loader.close();
    };
    const debounced = debounce(handler, 600);
    this.addListener('input', debounced);
  }

  private setTotalPriceBlock() {
    this.totalPrice = this.props.totalPrice.centAmount;
    const title = span([styles.description_title], 'Total');
    const price = span([styles.price], setPrice(this.totalPrice));

    return div([styles.description_wrapper], title, price);
  }

  public get getTotalPrice() {
    return this.totalPrice;
  }

  public updateTotalPrice(price: number) {
    this.totalPrice = price;
    const priceBlock = this.children[2];
    priceBlock.getChildren[1].setTextContent(setPrice(this.totalPrice));
  }

  private setRemoveButton() {
    const removeButton = span([styles.removeButton], '', svg('/assets/img/cross.svg#cross', styles.svg__removeButton));
    removeButton.addListener('click', async () => {
      const loader = new Modal({ loader: true, title: '', content: setLoader(), parent: this.cartView.getNode() });
      let hasChanged = false;
      const productQuantityInCart = CurrentCart.getProductCountByID(this.props.productId);
      loader.open();
      hasChanged = (await updateCart({ productID: this.props.productId, count: 0, name: this.props.name.en ?? '' }))
        .success;
      if (!hasChanged) {
        this.count.setValue(productQuantityInCart || 1);
      }
      loader.close();
      this.cartView.updateView();
    });
    return removeButton;
  }
}
