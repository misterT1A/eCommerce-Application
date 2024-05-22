import type { ClientResponse, ProductPagedQueryResponse } from '@commercetools/platform-sdk';

import BaseComponent from '@utils/base-component';

import styles from './_style.scss';
import Card from '../card-element/card-element-view';

export default class ProductCards extends BaseComponent {
  constructor() {
    super({ className: styles.product_wrapper });
  }

  public setContent(data: ClientResponse<ProductPagedQueryResponse>) {
    console.log(data);
    const products = data.body.results;

    products.forEach((product) => {
      const price = product.masterData.current.masterVariant.prices?.[0];

      const props: ICardProps = {
        img: product.masterData.current.masterVariant.images as IImgCard[],
        title: product.masterData.current.name.en,
        description: product.masterData.current.description?.en as string,
        price: price ? price.value.centAmount : 0,
      };

      const card = new Card(props);
      this.append(card);
    });
  }
}
