import Controller from '@components/controller';

import RegistrationView from './registration-view/registration-view';

class RegistrationController extends Controller<RegistrationView> {
  constructor() {
    super(new RegistrationView());
    this.getView.fields.addresses.addressesToggler.addListener('click', () => {
      this.getView.toggleAddress();
    });
  }

  // public validateForm() {
  //   // TODO check if formData has issues
  // }

  // public submitForm() {
  //   // TODO process valid data via AuthService
  // }}
}

export default RegistrationController;
