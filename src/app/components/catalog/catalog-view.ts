import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';

import styles from './_style.scss';
import FilterBlock from './filter-block';

export default class CatalogView extends BaseComponent {
  protected router: Router;

  protected filterBlock: FilterBlock;

  constructor(router: Router) {
    super({ tag: 'section', className: styles.wrapper });
    this.router = router;

    this.filterBlock = new FilterBlock();
    // this.productCardsBlock = new ProductCardsBlock()

    this.append(this.filterBlock);
    // this.appendChildren([this.filterBlock, this.productCardsBlock]);
  }
}
