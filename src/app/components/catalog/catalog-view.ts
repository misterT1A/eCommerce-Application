import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';
import { div } from '@utils/elements';

import styles from './_catalog_style.scss';
import Breadcrumbs from './breadcrumbs/breadcrumbs';
import FiltersBlock from './filters/filter-block';
import ProductCards from './product-cards/product-cards';

export default class CatalogView extends BaseComponent {
  protected productCardsBlock: ProductCards;

  protected filtersBlock: FiltersBlock;

  private breadCrumbsBlock: Breadcrumbs;

  constructor(protected router: Router) {
    super({ tag: 'section', className: styles.wrapper });
    this.productCardsBlock = new ProductCards(this.router);
    this.breadCrumbsBlock = new Breadcrumbs(this);
    this.filtersBlock = new FiltersBlock(this.productCardsBlock, this.breadCrumbsBlock, this.router);
    const mainContent = div([styles.mainContent], this.filtersBlock, this.productCardsBlock);

    this.appendChildren([this.breadCrumbsBlock, mainContent]);
  }

  public get getProductCardView() {
    return this.productCardsBlock;
  }

  public get getFilterBlockView() {
    return this.filtersBlock;
  }

  public get getRouter() {
    return this.router;
  }
}
