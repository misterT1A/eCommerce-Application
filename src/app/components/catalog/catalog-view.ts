import scrollControl from '@components/modal/body-lock';
import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';
import { div } from '@utils/elements';
// import setLazyLoader from '@utils/lazy loader/lazy-loader';

import styles from './_catalog_style.scss';
import Breadcrumbs from './breadcrumbs/breadcrumbs';
import FiltersBlock from './filters/filter-block';
import ToggleFiltersBlock from './filters/toggle-filters';
import ProductCards from './product-cards/product-cards';

export default class CatalogView extends BaseComponent {
  protected productCardsBlock: ProductCards;

  protected filtersBlock: FiltersBlock;

  private breadCrumbsBlock: Breadcrumbs;

  private toggleFiltersBlock: ToggleFiltersBlock;

  private scrollControl = scrollControl();

  constructor(protected router: Router) {
    super({ tag: 'section', className: styles.wrapper });
    this.productCardsBlock = new ProductCards(this.router, this);
    this.breadCrumbsBlock = new Breadcrumbs(this);
    this.filtersBlock = new FiltersBlock(
      this.productCardsBlock,
      this.breadCrumbsBlock,
      this.router,
      this.scrollControl
    );
    this.toggleFiltersBlock = new ToggleFiltersBlock(this.filtersBlock, this.scrollControl);
    const mainContent = div([styles.mainContent], this.filtersBlock, this.productCardsBlock);

    this.appendChildren([this.breadCrumbsBlock, this.toggleFiltersBlock, mainContent]);
  }

  public get getProductCardView() {
    return this.productCardsBlock;
  }

  public get getFilterBlock() {
    return this.filtersBlock;
  }

  public get getRouter() {
    return this.router;
  }
}
