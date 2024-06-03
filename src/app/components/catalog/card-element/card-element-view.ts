import type { Price } from '@commercetools/platform-sdk';

import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';
import { button, div, h2, p } from '@utils/elements';
import setLoader from '@utils/loader/loader-view';

import styles from './_card-style.scss';
import { changeCount, setPrice, setShortDescription } from './card-model';

export default class Card extends BaseComponent {
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

    const countMinus = p([styles.count_minus], '-');
    const countPlus = p([styles.count_plus], '+');
    const countNum = p([styles.count_Num], '1');
    const countWrapper = div([styles.count_wrapper], countMinus, countNum, countPlus);

    // const buyBtn = button([styles.buy_btn], 'Buy');

    return div([styles.pay_block], price, countWrapper);
  }

  private handler(e: Event) {
    const target = (e.target as HTMLElement)?.textContent;
    switch (target) {
      case '+':
        changeCount((e.target as HTMLElement).parentElement, true);
        break;
      case '-':
        changeCount((e.target as HTMLElement).parentElement, false);
        break;
      case 'READ MORE':
        this.router.savePath();
        this.router.navigateToProduct(this.props.key);
        break;
      // case 'Buy':
      // this.router.navigate(Pages.);
      // break;
      default:
        break;
    }
  }
}
