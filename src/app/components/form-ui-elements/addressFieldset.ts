import BaseComponent from '@utils/base-component';
import { button, div, h2, span } from '@utils/elements';

import styles from './_form-ui-elements.scss';
import AddressField from './addressField';

class AddressesFieldset extends BaseComponent {
  private state: 'shipping' | 'billing' | 'common' = 'shipping';

  public addressesToggler: BaseComponent<HTMLElement>;

  public shippingAddress: AddressField;

  public billingAddress: AddressField;

  constructor() {
    super({ tag: 'div' }, h2([styles.form__addressesTitle], 'Addresses'));
    this.addressesToggler = button([styles.form__addressesToggler], '');
    this.addressesToggler.appendChildren([
      span([styles.form__addressesTogglerBar], ''),
      span([styles.form__addressesTogglerLabelRight], 'BILLING ADDRESS'),
      span([styles.form__addressesTogglerLabelLeft], 'SHIPPING ADDRESS'),
    ]);
    this.shippingAddress = new AddressField();
    this.billingAddress = new AddressField();
    this.appendChildren([
      div(
        [styles.form__addresses],
        this.addressesToggler,
        div([styles.form__addressesBar], this.shippingAddress, this.billingAddress)
      ),
    ]);
    this.setStatus(this.state);
  }

  private clearTogglerStatus() {
    this.addressesToggler.removeClass(styles.form__addressesToggler_shipping);
    this.addressesToggler.removeClass(styles.form__addressesToggler_billing);
    this.addressesToggler.removeClass(styles.form__addressesToggler_common);
  }

  public setStatus(status: 'shipping' | 'billing' | 'common') {
    this.state = status;
    this.clearTogglerStatus();
    this.addressesToggler.addClass(styles[`form__addressesToggler_${status}`]);
  }
}

export default AddressesFieldset;
