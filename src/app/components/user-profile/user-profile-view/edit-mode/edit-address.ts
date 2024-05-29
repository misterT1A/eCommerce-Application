import FormField from '@components/form-ui-elements/formField';
import FormSelection from '@components/form-ui-elements/formSelection';
import Toggler from '@components/form-ui-elements/formToggler';
import { VALID_COUNTRIES } from '@services/registrationValidationService/validCountries';
import BaseComponent from '@utils/base-component';
import { button, p } from '@utils/elements';

import styles from '../_user-profile.scss';

interface IUserInfoFormFields {
  city: FormField;
  street: FormField;
  country: FormSelection;
  zipCode: FormField;
  isBilling: Toggler;
  isShipping: Toggler;
  isDefaultBilling: Toggler;
  isDefaultShipping: Toggler;
}

class UserAddressEdit extends BaseComponent {
  public fields: IUserInfoFormFields = {
    city: new FormField('City', 'text'),
    street: new FormField('Street', 'text'),
    country: new FormSelection('Country', [...VALID_COUNTRIES]),
    zipCode: new FormField('Postal Code', 'text', false),
    isBilling: new Toggler('Set as billing address'),
    isShipping: new Toggler('Set as shipping address'),
    isDefaultBilling: new Toggler('Set as default billing address'),
    isDefaultShipping: new Toggler('Set as default shipping address'),
  } as const;

  public applyButton: BaseComponent<HTMLButtonElement>;

  constructor() {
    super({ tag: 'div', className: styles.profile__editUserInfoForm });
    this.applyButton = button([styles.profile__button], 'SAVE');
    this.appendChildren([
      this.fields.country,
      this.fields.zipCode,
      this.fields.street,
      this.fields.city,
      this.fields.isShipping,
      this.fields.isBilling,
      this.fields.isDefaultShipping,
      this.fields.isDefaultBilling,
      this.applyButton,
    ]);
    this.fields.isShipping.setValue(true);
    this.fields.isBilling.bindWith(this.fields.isShipping);
    this.fields.isShipping.bindWith(this.fields.isBilling);
    this.fields.isShipping.bindWith(this.fields.isDefaultShipping, false);
    this.fields.isDefaultShipping.bindWith(this.fields.isShipping, false, true);
    this.fields.isBilling.bindWith(this.fields.isDefaultBilling, false);
    this.fields.isDefaultBilling.bindWith(this.fields.isBilling, false, true);
  }

  public setValues(values: ProfileAddressValues) {
    this.fields.country.setValue(values.country);
    this.fields.zipCode.setValue(values.zipCode);
    this.fields.street.setValue(values.street);
    this.fields.city.setValue(values.city);
    this.fields.isBilling.setValue(values.isBilling);
    this.fields.isShipping.setValue(values.isShipping);
    this.fields.isDefaultShipping.setValue(values.isDefaultShipping);
    this.fields.isDefaultBilling.setValue(values.isDefaultBilling);
    if (this.fields.isDefaultBilling.getValue()) {
      this.fields.isDefaultBilling.getNode().remove();
      this.fields.isBilling.getNode().remove();
      this.append(p([], 'This address is default billing address.'));
    }
    if (this.fields.isDefaultShipping.getValue()) {
      this.fields.isDefaultShipping.getNode().remove();
      this.fields.isShipping.getNode().remove();
      this.append(p([], 'This address is default shipping address.'));
    }
  }

  public getValues(): ProfileAddressValues {
    return {
      country: this.fields.country.getValue() as 'UK' | 'France' | 'Belgium',
      zipCode: this.fields.zipCode.getValue(),
      street: this.fields.street.getValue(),
      city: this.fields.city.getValue(),
      isBilling: this.fields.isBilling.getValue(),
      isShipping: this.fields.isShipping.getValue(),
      isDefaultBilling: this.fields.isDefaultBilling.getValue(),
      isDefaultShipping: this.fields.isDefaultShipping.getValue(),
    };
  }
}

export default UserAddressEdit;
