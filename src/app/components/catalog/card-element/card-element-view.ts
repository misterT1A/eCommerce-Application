import BaseComponent from '@utils/base-component';
import { div, h2, p } from '@utils/elements';

import styles from './_style.scss';

export default class Card extends BaseComponent {
  constructor(props: ICardProps) {
    super({ className: styles.wrapper });

    this.setContent(props);
  }

  private setContent(props: ICardProps) {
    // console.log(props);

    const img = new BaseComponent<HTMLImageElement>({ tag: 'img', src: props.img[0].url });

    if (img.getNode().width > img.getNode().height) {
      img.addClass(styles.img_Height);
    } else {
      img.addClass(styles.img_Width);
    }
    const imgWrapper = div([styles.img_wrapper], img);

    const title = h2([styles.title], props.title);
    const description = p([styles.description], props.description);
    const price = p([styles.price], props.price ? `${props.price / 100} EUR` : '0 EUR');
    this.appendChildren([imgWrapper, title, description, price]);
  }
}
