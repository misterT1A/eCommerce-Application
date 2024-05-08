import BaseComponent from '@components/base-component';
import formComponent from '@components/login/login-form';

import './login.scss';

export default class LoginPage extends BaseComponent {
  constructor() {
    super({ className: 'wrapper' });
    this.render();
  }

  protected render() {
    const loginPage = new BaseComponent(
      { className: 'login-block' },
      new BaseComponent<HTMLParagraphElement>({
        tag: 'p',
        className: 'login-title',
        textContent: 'Enter your name and password',
      }),
      formComponent
    );
    formComponent.addListener('keyup', () => this.handleKeyUp);
    // formComponent.addEventListener('submit', () => {
    //   this.handleSubmit();
    // });
    this.appendChildren([loginPage]);
  }

  protected handleKeyUp(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input || !input.form) {
      return;
    }

    const { form } = input;
    if (!input.checkValidity()) {
      input.classList.remove('valid');
      input.classList.add('invalid');
    } else {
      input.classList.remove('invalid');
      input.classList.add('valid');
    }

    const button = form.querySelector('button');
    if (!form.checkValidity()) {
      button?.setAttribute('disabled', 'disabled');
    } else {
      button?.removeAttribute('disabled');
    }
  }

  protected handleSubmit() {}
}
