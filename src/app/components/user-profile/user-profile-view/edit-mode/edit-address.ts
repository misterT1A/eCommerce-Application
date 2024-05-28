import FormField from '@components/form-ui-elements/formField';
import FormSelection from '@components/form-ui-elements/formSelection';
import Toggler from '@components/form-ui-elements/formToggler';
import { VALID_COUNTRIES } from '@services/registrationValidationService/validCountries';
import BaseComponent from '@utils/base-component';
import { button } from '@utils/elements';

import styles from '../_user-profile.scss';

interface IUserInfoFormFields {
  city: FormField;
  street: FormField;
  country: FormSelection;
  zipCode: FormField;
  isBilling: Toggler;
  isShipping: Toggler;
  isDefault: Toggler;
}

class UserAddressEdit extends BaseComponent {
  public fields: IUserInfoFormFields = {
    city: new FormField('City', 'text'),
    street: new FormField('Street', 'text'),
    country: new FormSelection('Country', [...VALID_COUNTRIES]),
    zipCode: new FormField('Postal Code', 'text', false),
    isBilling: new Toggler('Set as billing address'),
    isShipping: new Toggler('Set as shipping address'),
    isDefault: new Toggler('Set as default address'),
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
      this.fields.isDefault,
      this.applyButton,
    ]);
    this.fields.isShipping.setValue(true);
    this.fields.isBilling.bindWith(this.fields.isShipping);
    this.fields.isShipping.bindWith(this.fields.isBilling);
  }

  public getValues(): ProfileAddressValues {
    return {
      country: this.fields.country.getValue() as 'UK' | 'France' | 'Belgium',
      zipCode: this.fields.zipCode.getValue(),
      street: this.fields.street.getValue(),
      city: this.fields.city.getValue(),
      isBilling: this.fields.isBilling.getValue(),
      isShipping: this.fields.isShipping.getValue(),
      isDefault: this.fields.isDefault.getValue(),
    };
  }
}

export default UserAddressEdit;
