import type { LineItem } from '@commercetools/platform-sdk';

import { setPrice } from '@components/catalog/card-element/card-model';
import BaseComponent from '@utils/base-component';
import { div, span } from '@utils/elements';
import setLoader from '@utils/loader/loader-view';

import styles from './_styles.scss';

export default class Card extends BaseComponent {
  constructor(protected props: LineItem) {
    super({ className: styles.card_element });

    this.setContent();
  }

  private setContent() {
    this.appendChildren([this.setCardImg((this.props.variant.images as IImgCard[])[0].url), this.setDescription()]);
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
    return div([styles.description_wrapper], title, price);
  }
}
