import type { ClientResponse, ProductProjectionPagedQueryResponse } from '@commercetools/platform-sdk';

import BaseComponent from '@utils/base-component';

import styles from './_product-style.scss';
import Card from '../card-element/card-element-view';

export default class ProductCards extends BaseComponent {
  constructor() {
    super({ className: styles.product_wrapper });
  }

  public setContent(data: ClientResponse<ProductProjectionPagedQueryResponse>) {
    const products = data.body.results;

    products.forEach((product) => {
      const price = product.masterVariant.prices?.[0];

      const props: ICardProps = {
        img: product.masterVariant.images as IImgCard[],
        title: product.name.en,
        description: product.description?.en as string,
        price: price ? price.value.centAmount : 0,
      };

      const card = new Card(props);
      this.append(card);
    });
  }
}
