import Controller from '@components/controller';
import RegistrationValidator from '@services/registrationValidationService/registrationValidator';

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
    let isValid = true;
    if (!errorsObject) {
      return false;
    }
    Object.values(errorsObject).forEach((value) => {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          // TODO clear errors container for associated field
          isValid = false;
          // TODO emit errors
        }
      } else if (typeof value === 'object') {
        if (!this.isValidForm(value)) {
          isValid = false;
        }
      } else if (typeof value !== 'boolean') {
        isValid = false;
      }
    });
    return isValid;
  }

  private validateForm() {
    this.getView.disableButton();
    const formData = this.getView.getValues();
    const errorsObj = RegistrationValidator.processFormData(formData);
    if (this.isValidForm(errorsObj)) {
      this.getView.unlockButton();
    }
    console.log('is valid?', this.isValidForm(errorsObj));
  }

  private submitForm() {
    // TODO process valid data via AuthService
    console.log('submit form');
  }
}

export default RegistrationController;
