import type { CustomerDraft } from '@commercetools/platform-sdk';

import Controller from '@components/controller';
import FormField from '@components/form-ui-elements/formField';
import type HeaderController from '@components/header/header_controller';
import notificationEmitter from '@components/notifications/notifications-controller';
import AuthService from '@services/auth-service';
import RegistrationValidator from '@services/registrationValidationService/registrationValidator';
import Pages from '@src/app/router/pages';
import type Router from '@src/app/router/router';
import type BaseComponent from '@utils/base-component';
import { assertsArrayOfStrings } from '@utils/is-array-of-strings';

import { prepareCustomerDraft } from './registration-adapters';
import RegistrationView from './registration-view/registration-view';

class RegistrationController extends Controller<RegistrationView> {
  private formData: IRegistrationFormData | null = null;

  constructor(
    private router: Router,
    private headerController: HeaderController
  ) {
    super(new RegistrationView(router));
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

  // TODO isolate address checks from main registration fields
  // move validate function to helpers

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
    this.formData = this.getView.getValues();
    this.view.fields.addresses.offCommon();
    if (
      this.formData.addresses.billingAddress?.commonAddress ||
      this.formData.addresses.shippingAddress?.commonAddress
    ) {
      this.view.fields.addresses.setCommon();
    }
    const errorsObj = RegistrationValidator.processFormData(this.formData);
    if (this.isValidForm(errorsObj)) {
      this.getView.unlockButton();
    }
  }

  public submitForm() {
    if (!this.formData) {
      return;
    }
    const customerDraft = prepareCustomerDraft(this.formData);
    if (customerDraft) {
      this.sendRequest(customerDraft);
    }
  }

  private async sendRequest(customerDraft: CustomerDraft) {
    this.getView.disableButton();
    AuthService.signUp(customerDraft).then((response) => {
      if (response.success) {
        notificationEmitter.showMessage({
          messageType: 'success',
          title: 'Account created!',
          text: 'Access your profile to control your personal information and preferences.',
        });
        this.router.navigate(Pages.MAIN);
        this.headerController.changeTextLoggined();
      } else {
        const errors = response.errors ? response.errors : [response.message];
        errors.forEach((text) => notificationEmitter.showMessage({ messageType: 'error', text }));
        this.getView.unlockButton();
      }
    });
  }
}

export default RegistrationController;
