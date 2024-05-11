import { VALID_COUNTRIES } from '@services/registrationValidationService/validCountries';
import BaseComponent from '@utils/base-component';
import { div } from '@utils/elements';

import styles from './_form-ui-elements.scss';
import Checkbox from './formCheckbox';
import FormField from './formField';
import FormSelection from './formSelection';

class AddressField extends BaseComponent {
  public fields: {
    defaultAddress: Checkbox;
    commonAddress: Checkbox;
    city: FormField;
    street: FormField;
    country: FormSelection;
    zipCode: FormField;
  };

  constructor() {
    super({ tag: 'div' });
    this.addClass(styles.form__address);
    this.fields = {
      defaultAddress: new Checkbox('Set as default address.'),
      commonAddress: new Checkbox('Set this address as billing and shipping.'),
      city: new FormField('City', 'text'),
      street: new FormField('Street', 'text'),
      country: new FormSelection('Country', [...VALID_COUNTRIES]),
      zipCode: new FormField('Postal Code', 'text'),
    };
    this.appendChildren([
      this.fields.defaultAddress,
      this.fields.commonAddress,
      div([styles.form__inputsWrapperSmall], this.fields.country, this.fields.zipCode),
      this.fields.city,
      this.fields.street,
    ]);
  }

  public getValue() {
    const values = new Map(Object.entries(this.fields).map(([key, field]) => [key, field.getValue()]));
    return Object.fromEntries(values);
  }
}

export default AddressField;
