import RegistrationView from './registration-view/registration-view';

class RegistrationController {
  private view: RegistrationView;

  constructor() {
    this.view = new RegistrationView();
  }

  public validateForm() {
    // TODO check if formData has issues
  }

  public render() {
    this.view.render();
  }

  public submitForm() {
    // TODO process valid data via AuthService
  }
}

export default RegistrationController;
