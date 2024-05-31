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

    this.appendChildren([button([styles['toggle-filters-btn']], ''), span([styles.span], 'Filters')]);
  }
}
