import type { ProductProjection } from '@commercetools/platform-sdk';

import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';
import { h2 } from '@utils/elements';

import styles from './_product-style.scss';
import Card from '../card-element/card-element-view';

export default class ProductCards extends BaseComponent {
  constructor(protected router: Router) {
    super({ className: styles.product_wrapper });
  }

  public setProducts(products: ProductProjection[]) {
    if (!products) {
      return;
    }

    this.hideBlock().then(() => {
      this.showBlock();

      if (!products.length) {
        this.showNotFoundTitle();
        return;
      }

      products.forEach((product, index) => {
        const price = product.masterVariant.prices?.[0];

        const props: ICardProps = {
          key: product.key as string,
          img: product.masterVariant.images as IImgCard[],
          title: product.name.en,
          description: product.description?.en as string,
          price,
        };

        const card = new Card(props, this.router);
        card.setAnimDelay(index);
        this.append(card);
      });
    });
  }

  public showNotFoundTitle() {
    const title = h2([styles.title_noFound], 'No products were found according to applied filters');
    this.append(title);
  }

  private async hideBlock() {
    this.addClass(styles.hide);
    await new Promise((res) => {
      setTimeout(() => res(true), 200);
    });
  }

  private showBlock() {
    this.removeClass(styles.hide);
    this.destroyChildren();
  }
}
