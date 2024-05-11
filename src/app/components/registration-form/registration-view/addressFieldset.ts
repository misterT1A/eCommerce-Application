import BaseComponent from '@utils/base-component';
import { button, div, h2, span } from '@utils/elements';

import styles from './_registrationForm.scss';
import AddressField from '../../form-ui-elements/addressField';

class AddressesFieldset extends BaseComponent {
  private state: 'shipping' | 'billing' = 'shipping';

  public addressesToggler: BaseComponent<HTMLElement>;

  public shippingAddress: AddressField;

  public billingAddress: AddressField;

  constructor() {
    super({ tag: 'div', classList: styles.form__addresses }, h2([styles.form__addressesTitle], 'Addresses'));
    this.addressesToggler = button([styles.form__addressesToggler], '');
    this.addressesToggler.appendChildren([
      span([styles.form__addressesTogglerBar], ''),
      span([styles.form__addressesTogglerLabelRight], 'BILLING ADDRESS'),
      span([styles.form__addressesTogglerLabelLeft], 'SHIPPING ADDRESS'),
    ]);
    this.shippingAddress = new AddressField();
    this.billingAddress = new AddressField();
    this.appendChildren([
      this.addressesToggler,
      div(
        [styles.form__addressesContainer],
        div([styles.form__addressesBar], this.shippingAddress, this.billingAddress)
      ),
    ]);
    this.setStatus(this.state);
  }

  private clearTogglerStatus() {
    this.removeClass(styles.form__addresses_shipping);
    this.removeClass(styles.form__addresses_billing);
    this.removeClass(styles.form__addresses_common);
  }

  public setStatus(status: 'shipping' | 'billing') {
    this.state = status;
    this.clearTogglerStatus();
    this.addClass(styles[`form__addresses_${status}`]);
  }

  public toggleAddress() {
    this.setStatus(this.state === 'shipping' ? 'billing' : 'shipping');
  }

  public getValue() {
    return {
      shippingAddress: this.shippingAddress.getValue(),
      billingAddress: this.billingAddress.getValue(),
    };
  }
}

export default AddressesFieldset;
