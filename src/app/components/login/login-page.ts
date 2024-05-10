import LoginFormComponent from '@components/login/login-form-component';
import BaseComponent from '@utils/base-component';

import style from './_login.scss';
import loginFormValidator from './utils/form-validator';

export default class LoginPage extends BaseComponent {
  private loginFormValidator = loginFormValidator;

  constructor() {
    super(
      { className: style['login-block'] },
      new BaseComponent<HTMLParagraphElement>({
        tag: 'p',
        className: 'login-title',
        textContent: 'Enter your email and password',
      })
    );
    this.render();
  }

  protected render() {
    const formComponent = new LoginFormComponent();
    this.append(formComponent);
    formComponent.addListener('keyup', this.handleKeyUp);
    // formComponent.addEventListener('submit', () => {
    //   this.handleSubmit();
    // });
  }

  protected handleKeyUp(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input || !input.form) {
      return;
    }

    if (input.name === 'email') {
      const validationRes = loginFormValidator.validateEmail(input.value);
      if (validationRes.errors.length > 0) {
        input.className = style.invalid;
      } else {
        input.className = style.valid;
      }

      console.log(validationRes);
    }
    if (input.name === 'password') {
      const validationRes = loginFormValidator.validatePassword(input.value);
      if (validationRes.errors.length > 0) {
        input.className = style.invalid;
      } else {
        input.className = style.valid;
      }
      console.log(validationRes);
    }
  }

  // protected handleSubmit() {}
}
