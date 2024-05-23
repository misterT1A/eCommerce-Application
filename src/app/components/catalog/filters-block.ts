import FormField from '@components/form-ui-elements/formField';
import BaseComponent from '@utils/base-component';

import styles from './_filters.scss';

export default class FilterBlock extends BaseComponent {
  private searchInput: FormField;

  constructor() {
    super({ tag: 'section', className: styles.filterBlock });
    this.searchInput = new FormField('search', 'search');
    this.append(this.searchInput);
  }
}
