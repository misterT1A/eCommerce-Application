import Controller from '@components/controller';
import AuthService from '@services/auth-service';

import style from './_login-form.scss';
import LoginView from './login-view';

export interface IFormValidatorResult {
  success: boolean;
  errors: string[];
}

export default class LoginController extends Controller<LoginView> {
  constructor() {
    super(new LoginView());
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

  public validateInput(input: HTMLInputElement): boolean {
    const errorSpan = input.parentNode?.querySelector(`.${style['error-container']}`) as HTMLElement;
    let result: IFormValidatorResult = {
      success: true,
      errors: [],
    };

    switch (input.name) {
      case 'email':
        result = this.validateEmail(input.value);
        break;
      case 'password':
        result = this.validatePassword(input.value);
        break;
      default:
        break;
    }
    errorSpan.innerHTML = result.errors.join('<br>');

    return result.success;
  }

  protected validateEmail(email: string): IFormValidatorResult {
    const result: IFormValidatorResult = {
      success: true,
      errors: [],
    };

    const emailRegex = /^\s*[\w-.]+@([\w-]+\.)+[\w-]{2,4}\s*$/g;
    if (!emailRegex.test(email)) {
      result.errors.push('Email address must be properly formatted (e.g., user@example.com)');
    }

    if (email !== email.trim()) {
      result.errors.push('Email address must not contain leading or trailing whitespace');
    }

    result.success = result.errors.length < 1;
    return result;
  }

  protected validatePassword(password: string): IFormValidatorResult {
    const result: IFormValidatorResult = {
      success: true,
      errors: [],
    };
    if (password.length < 8) {
      result.errors.push('Password must be at least 8 characters long');
    }
    if (password.toLocaleLowerCase() === password) {
      result.errors.push('Password must contain at least one uppercase letter');
    }
    if (password.toUpperCase() === password) {
      result.errors.push('Password must contain at least one lowercase letter');
    }
    if (!/\d/.test(password)) {
      result.errors.push('Password must contain at least one digit');
    }
    if (password !== password.trim()) {
      result.errors.push('Password must not contain leading or trailing whitespace');
    }

    result.success = result.errors.length < 1;
    return result;
  }

  protected submit(): void {
    const userEmail = this.getView.getNode().elements[0] as HTMLInputElement;
    const userPass = this.getView.getNode().elements[1] as HTMLInputElement;

    // AuthService call
    AuthService.login(userEmail.value, userPass.value);
  }
}
