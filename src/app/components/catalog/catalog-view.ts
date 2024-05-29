import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';
import { div } from '@utils/elements';

import styles from './_catalog_style.scss';
import Breadcrumbs from './breadcrumbs/breadcrumbs';
import FilterBlock from './filters/filter-block';
import ProductCards from './product-cards/product-cards';

export default class CatalogView extends BaseComponent {
  protected productCardsBlock: ProductCards;

  protected filterBlock: FilterBlock;

  private breadCrumbsBlock: Breadcrumbs;

  constructor(protected router: Router) {
    super({ tag: 'section', className: styles.wrapper });

    this.breadCrumbsBlock = new Breadcrumbs();
    this.productCardsBlock = new ProductCards(this.router);
    this.filterBlock = new FilterBlock(this.productCardsBlock, this.breadCrumbsBlock);

    const mainContent = div([styles.mainContent], this.filterBlock, this.productCardsBlock);

    this.appendChildren([this.breadCrumbsBlock, mainContent]);
  }

  public get getProductCardView() {
    return this.productCardsBlock;
  }

  public get getFilterBlockView() {
    return this.filterBlock;
  }
}
