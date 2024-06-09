import type { Price } from '@commercetools/platform-sdk';

import AddToCart from '@components/form-ui-elements/addToCartToggler';
import Count from '@components/form-ui-elements/countInput';
import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';
import { button, div, h2, p } from '@utils/elements';
import setLoader from '@utils/loader/loader-view';

import styles from './_card-style.scss';
import { setPrice, setShortDescription } from './card-model';

export default class Card extends BaseComponent {
  private addBtn = new AddToCart();

  private count = new Count();

  constructor(
    protected props: ICardProps,
    protected router: Router
  ) {
    super({ className: styles.wrapper });

    this.setContent(props);
  }

  private setContent(props: ICardProps) {
    this.appendChildren([
      this.createImg(props.img[0].url),
      ...this.cteateTextandBtn(props),
      this.createPayBlock(props),
    ]);
    this.addListener('click', (e: Event) => this.handler(e));
    this.setInputHandlers();
    this.count.setValue(props.count || 1);
    if (this.props.isSelected) {
      this.addBtn.select();
    }
  }

  private createImg(url: string): BaseComponent {
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

  private cteateTextandBtn(props: ICardProps): BaseComponent[] {
    const title = h2([styles.title], props.title);
    const description = p([styles.description], setShortDescription(props.description));
    const readMoreBtn = button([styles.read_more_btn], 'READ MORE');
    readMoreBtn.getNode().setAttribute('data-name', 'read-more-button');

    return [title, description, readMoreBtn];
  }

  private createPayBlock(props: ICardProps): BaseComponent {
    const priceObj = props.price as Price;

    const price = new BaseComponent({ textContent: setPrice(priceObj.value.centAmount) });

    if (priceObj.discounted) {
      price.addClass(styles.price_throgh);
      price.append(p([styles.price_discount], setPrice(priceObj.discounted.value.centAmount)));
    } else {
      price.addClass(styles.price);
    }

    return div([styles.pay_block], price, div([styles.pay_block_controls], this.count, this.addBtn));
  }

  private setInputHandlers() {
    this.addListener('input', (e) => {
      const isAddInput = (e.target as HTMLInputElement)?.dataset.name === 'add-to-cart-input';
      if (!this.count.getValue() || this.count.getValue() <= 0) {
        if (this.addBtn.getValue()) {
          this.addBtn.unselect();
          // TODO: remove elected product from cart
        }
        this.count.setValue(1);
      } else if (this.addBtn.getValue()) {
        if (isAddInput) {
          // TODO: add to cart with specified count
        } else {
          // TODO: change count of selected product in cart
        }
      }
    });
  }

  public setAnimDelay(index: number) {
    const delay = 0.2 + index / 20;
    this.getNode().style.animationDelay = `${delay}s`;
  }

  private handler(e: Event) {
    const target = (e.target as HTMLInputElement)?.dataset.name;
    switch (target) {
      case 'read-more-button':
        this.router.savePath();
        this.router.navigateToProduct(this.props.key);
        break;
      // case 'add-to-cart':
      //   if (this.addBtn.getValue()) {
      //     this.router.savePath();
      //     this.router.navigate(Pages.CART);
      //   }
      //   break;
      default:
        break;
    }
  }
}
