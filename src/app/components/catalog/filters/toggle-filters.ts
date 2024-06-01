import BaseComponent from '@utils/base-component';
import { button, span } from '@utils/elements';

import styles from './_filters.scss';
import type FilterBlock from './filter-block';

export default class ToggleFiltersBlock extends BaseComponent {
  constructor(private filtersBlock: FilterBlock) {
    super({ className: styles['toggle-filters'] });
    this.addListener('click', () => {
      this.filtersBlock.addClass(styles['filterBlock--visible']);
      document.body.style.overflow = 'hidden';
    });
    window.addEventListener('resize', () => this.resizeHandler());

    this.appendChildren([button([styles['toggle-filters-btn']], ''), span([styles.span], 'Filters')]);
  }

  private resizeHandler() {
    const width = window.innerWidth;
    const isFiltersBlockVisible = this.filtersBlock.getNode().classList.contains(styles['filterBlock--visible']);

    if (isFiltersBlockVisible) {
      if (width > 1100) {
        document.body.style.overflow = '';
      } else {
        document.body.style.overflow = 'hidden';
      }
    }
  }
}
