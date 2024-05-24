import type { ProductProjection } from '@commercetools/platform-sdk';

import BaseComponent from '@utils/base-component';

import styles from './_product-style.scss';
import Card from '../card-element/card-element-view';

export default class ProductCards extends BaseComponent {
  constructor() {
    super({ className: styles.product_wrapper });
  }

  public setProducts(products: ProductProjection[]) {
    this.destroyChildren();
    if (!products) {
      return;
    }

    products.forEach((product) => {
      const price = product.masterVariant.prices?.[0];

      const props: ICardProps = {
        img: product.masterVariant.images as IImgCard[],
        title: product.name.en,
        description: product.description?.en as string,
        price,
      };

      const card = new Card(props);
      this.append(card);
    });
  }
}
