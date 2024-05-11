import AuthService from '@services/auth-service';
import BaseComponent from '@utils/base-component';

import style from './_login.scss';

export interface IFormValidatorResult {
  success: boolean;
  errors: string[];
}

export default class LoginFormComponent extends BaseComponent<HTMLFormElement> {
  public constructor() {
    super({ tag: 'form', noValidate: true, className: style['login-form'], action: '#' });

    this.renderFormContain();
    this.initListeners();
  }

  protected renderFormContain() {
    const emailInput = new BaseComponent<HTMLInputElement>({
      tag: 'input',
      type: 'text',
      name: 'email',
      autocomplete: 'email',
      placeholder: 'john.doe@example.com',
      required: true,
    });
    this.append(this.createInputContainer('Email', emailInput));

    const passwordInput = new BaseComponent<HTMLInputElement>({
      tag: 'input',
      type: 'password',
      name: 'password',
      autocomplete: 'current-password',
      placeholder: '******',
      required: true,
    });
    const passwordEye = new BaseComponent<HTMLSpanElement>({
      tag: 'span',
      className: `${style['toggle-password-visibility']}`,
      onclick: () => {
        passwordInput.getNode().type = passwordInput.getNode().type === 'password' ? 'text' : 'password';
      },
    });

    this.append(this.createInputContainer('Password', passwordInput, passwordEye));

    this.append(
      new BaseComponent<HTMLButtonElement>({
        tag: 'button',
        type: 'submit',
        textContent: 'Login',
      })
    );
  }

  protected createInputContainer(title: string, ...elements: BaseComponent[]): BaseComponent<HTMLLabelElement> {
    return new BaseComponent<HTMLLabelElement>(
      { tag: 'label', className: style['input-container'] },
      new BaseComponent<HTMLSpanElement>({
        tag: 'span',
        textContent: title,
      }),
      ...elements,
      new BaseComponent<HTMLSpanElement>({
        tag: 'span',
        className: style['error-container'],
      })
    );
  }

  protected initListeners() {
    this.addListener('keyup', (e) => {
      const input = e.target as HTMLInputElement;
      this.validateInput(input);
    });
    this.addListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      this.getNode()
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

  protected submit() {
    const userEmail = this.getNode().elements[0] as HTMLInputElement;
    const userPass = this.getNode().elements[1] as HTMLInputElement;
    AuthService.login(userEmail.value, userPass.value);
  }
}
