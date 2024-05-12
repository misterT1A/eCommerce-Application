import Controller from '@components/controller';
import FormField from '@components/form-ui-elements/formField';
import RegistrationValidator from '@services/registrationValidationService/registrationValidator';
import type BaseComponent from '@utils/base-component';
import { assertsArrayOfStrings } from '@utils/is-array-of-strings';

import RegistrationView from './registration-view/registration-view';

class RegistrationController extends Controller<RegistrationView> {
  constructor() {
    super(new RegistrationView());
    this.setListeners();
  }

  private setListeners() {
    this.getView.fields.addresses.addressesToggler.addListener('click', () => {
      this.getView.toggleAddress();
    });
    this.getView.addListener('submit', (event) => {
      event.preventDefault();
      this.getView.button.getNode().click();
    });
    this.getView.button.addListener('click', () => this.submitForm());
    this.getView.addListener('input', () => this.validateForm());
  }

  private isValidForm(errorsObject: IRegistrationErrors | object) {
    const { fields } = this.getView;
    const validate = (errorsObj: IRegistrationErrors | object, fs: Record<string, BaseComponent>) => {
      let inputs = fs;
      let isValid = true;
      if (!errorsObj) {
        return false;
      }
      Object.entries(errorsObj).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            isValid = false;
          }
          const field = fs[key];
          if (field instanceof FormField) {
            assertsArrayOfStrings(value);
            field.updateErrors(value);
          }
        } else if (typeof value === 'object') {
          if (key === 'shippingAddress' || key === 'billingAddress') {
            inputs = fields.addresses[key].fields;
          }
          if (!validate(value, inputs)) {
            isValid = false;
          }
        }
      });
      return isValid;
    };
    return validate(errorsObject, fields);
  }

  private validateForm() {
    this.getView.disableButton();
    const formData = this.getView.getValues();
    const errorsObj = RegistrationValidator.processFormData(formData);
    if (this.isValidForm(errorsObj)) {
      this.getView.unlockButton();
    }
  }

  private submitForm() {
    // TODO process valid data via AuthService
    console.log('submit form');
  }
}

export default RegistrationController;
