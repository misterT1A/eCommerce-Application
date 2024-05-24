import type { ProductProjection } from '@commercetools/platform-sdk';

import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';

import styles from './_product-styles.scss';

export default class ProductView extends BaseComponent {
  protected router: Router;

  constructor(router: Router) {
    super({ tag: 'section', className: styles.wrapper });
    this.router = router;
  }

  public setContent(data: ProductProjection) {
    console.log(data);
  }
}
