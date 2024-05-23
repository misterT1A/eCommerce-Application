import Toggler from '@components/form-ui-elements/formToggler';
import BaseComponent from '@utils/base-component';

import styles from './_filters.scss';

export default class FilterBlock extends BaseComponent {
  private salesFilter: Toggler;

  private veganFilter: Toggler;

  private forKidsFilter: Toggler;

  constructor() {
    super({ tag: 'section', className: styles.filterBlock });
    this.salesFilter = new Toggler('On sale');
    this.veganFilter = new Toggler('Vegan');
    this.forKidsFilter = new Toggler('For kids');
    this.appendChildren([this.salesFilter, this.veganFilter, this.forKidsFilter]);
  }
}
