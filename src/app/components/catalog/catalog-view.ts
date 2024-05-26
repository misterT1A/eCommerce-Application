import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';

import styles from './_catalog_style.scss';
import FilterBlock from './filters/filter-block';
import ProductCards from './product-cards/product-cards';

export default class CatalogView extends BaseComponent {
  protected productCardsBlock: ProductCards;

  protected filterBlock: FilterBlock;

  constructor(protected router: Router) {
    super({ tag: 'section', className: styles.wrapper });

    this.productCardsBlock = new ProductCards(this.router);
    this.filterBlock = new FilterBlock(this.productCardsBlock);

    this.appendChildren([this.filterBlock, this.productCardsBlock]);
  }

  public get getProductCardView() {
    return this.productCardsBlock;
  }

  public get getFilterBlockView() {
    return this.filterBlock;
  }
}
