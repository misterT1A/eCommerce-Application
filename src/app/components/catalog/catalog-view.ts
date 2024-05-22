import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';

import styles from './_style.scss';

export default class CatalogView extends BaseComponent {
  protected router: Router;

  constructor(router: Router) {
    super({ tag: 'section', className: styles.wrapper });
    this.router = router;

    // this.filterBlock = new FilterBlock()
    // this.productCardsBlock = new ProductCardsBlock()

    // this.appendChildren([this.filterBlock, this.productCardsBlock]);
  }
}
