import BaseComponent from '@utils/base-component';
import { button, span } from '@utils/elements';

import styles from './_filters.scss';
import type FilterBlock from './filter-block';

export default class ToggleFiltersBlock extends BaseComponent {
  constructor(
    private filtersBlock: FilterBlock,
    private scrollController: IScrollController
  ) {
    super({ className: styles['toggle-filters'] });
    this.addListener('click', () => {
      this.filtersBlock.addClass(styles['overlay--visible']);
      this.filtersBlock.filters.addClass(styles['filterBlock--visible']);
      this.scrollController.lock();
    });
    window.addEventListener('resize', () => this.resizeHandler());

    this.appendChildren([button([styles['toggle-filters-btn']], ''), span([styles.span], 'Filters')]);
  }

  private resizeHandler() {
    const width = window.innerWidth;
    const isFiltersBlockVisible = this.filtersBlock.filters
      .getNode()
      .classList.contains(styles['filterBlock--visible']);

    if (isFiltersBlockVisible) {
      if (width > 1100) {
        this.filtersBlock.removeClass(styles['overlay--visible']);
        this.scrollController.unlock();
      } else {
        this.filtersBlock.addClass(styles['overlay--visible']);
        this.scrollController.lock();
      }
    }
  }
}
