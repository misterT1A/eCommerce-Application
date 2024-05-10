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
      defaultAddress: new Checkbox('default'),
      commonAddress: new Checkbox('common'),
      city: new FormField('City', 'text', ''),
      street: new FormField('Street', 'text', ''),
      country: new FormSelection('Country', [...VALID_COUNTRIES]),
      zipCode: new FormField('Postal Code', 'text', ''),
    };
    this.appendChildren([
      this.fields.defaultAddress,
      this.fields.commonAddress,
      this.fields.city,
      this.fields.street,
      div([styles.form__inputsWrapperSmall], this.fields.country, this.fields.zipCode),
    ]);
  }
}

export default AddressField;
