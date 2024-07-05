import Controller from '@components/controller';
import type HeaderController from '@components/header/header_controller';
import notificationEmitter from '@components/notifications/notifications-controller';
import AuthService from '@services/auth-service';
import MyCustomer from '@services/customer-service/myCustomer';
import LoginValidator from '@services/loginValidationService/loginValidator';
import Pages from '@src/app/router/pages';
import type Router from '@src/app/router/router';

import style from './_login-form.scss';
import LoginView from './login-view';

export default class LoginController extends Controller<LoginView> {
  private loginData: ILoginData | null = null;

  constructor(
    private router: Router,
    private headerController: HeaderController
  ) {
    super(new LoginView(router));
    this.router = router;
    this.headerController = headerController;
    this.initListeners();
  }

  protected initListeners(): void {
    this.getView.addListener('keyup', (e) => {
      const input = e.target as HTMLInputElement;
      this.validateInput(input);
    });
    this.getView.addListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      this.getView
        .getNode()
        .querySelectorAll('input')
        .forEach((input) => {
          if (!this.validateInput(input)) {
            isValid = false;
          }
        });

      if (isValid) {
        this.submit();
      }
    });
  }

  protected validateInput(input: HTMLInputElement): boolean {
    const errorSpan = input.parentNode?.querySelector(`.${style['error-container']}`) as HTMLElement;
    let result: IFormValidatorResult = {
      success: true,
      errors: [],
    };

    switch (input.name) {
      case 'email':
        result = LoginValidator.validateEmail(input.value);
        break;
      case 'password':
        result = LoginValidator.validatePassword(input.value);
        break;
      default:
        break;
    }
    errorSpan.innerHTML = result.errors.join('<br>');

    return result.success;
  }

  protected submit(): void {
    this.loginData = this.getView.getFormValues();
    if (!this.loginData) {
      return;
    }

    this.getView.disableButton();
    AuthService.login(this.loginData.email, this.loginData.password).then(async (res) => {
      if (res.success) {
        notificationEmitter.showMessage({ messageType: 'success', text: 'You successfully Logged in!' });
        MyCustomer.setCustomer(res.customer);
        this.router.navigate(Pages.MAIN);
        this.headerController.changeTextLoggined(MyCustomer.fullNameShort);
        if (res.cartCount) {
          this.headerController.setCartCount(res.cartCount);
        }
      } else {
        notificationEmitter.showMessage({
          messageType: 'error',
          text: `Invalid email or password! ${res.message}`,
        });
        this.getView.enableButton();
      }
    });
  }
}
