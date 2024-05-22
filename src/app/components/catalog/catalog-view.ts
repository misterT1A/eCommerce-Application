import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';

import styles from './_style.scss';
import ProductCards from './product-cards/product-cards';

export default class CatalogView extends BaseComponent {
  protected router: Router;

  protected productCardsBlock: ProductCards;

  constructor(router: Router) {
    super({ tag: 'section', className: styles.wrapper });
    this.router = router;

    // this.filterBlock = new FilterBlock()
    this.productCardsBlock = new ProductCards();

    this.appendChildren([this.productCardsBlock]);
  }

  public get getProductCardView() {
    return this.productCardsBlock;
  }
}
