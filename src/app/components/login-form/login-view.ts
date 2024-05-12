import BaseComponent from '@utils/base-component';
import { h2, p } from '@utils/elements';

import style from './_login-form.scss';

export default class LoginView extends BaseComponent<HTMLFormElement> {
  public constructor() {
    super({ tag: 'form', noValidate: true, className: style['login-form'], action: '#' });
    this.appendChildren([h2([style['form-title']], 'Login'), p([style['form-text']], 'Please, enter your email and password')]);
    this.renderFormContent();
  }

  protected renderFormContent(): void {
    const emailInput = new BaseComponent<HTMLInputElement>({
      tag: 'input',
      type: 'text',
      name: 'email',
      className: style['form-input'],
      autocomplete: 'email',
      placeholder: 'john.doe@example.com',
      required: true,
    });
    this.append(this.createInputContainer('Email', emailInput));

    const passwordInput = new BaseComponent<HTMLInputElement>({
      tag: 'input',
      type: 'password',
      name: 'password',
      className: style['form-input'],
      autocomplete: 'current-password',
      placeholder: '******',
      required: true,
    });
    const passwordEye = new BaseComponent<HTMLSpanElement>({
      tag: 'span',
      className: `${style['input-password-toggler']}`,
      onclick: () => {
        passwordInput.getNode().type = passwordInput.getNode().type === 'password' ? 'text' : 'password';
      },
    });

    this.append(this.createInputContainer('Password', passwordInput, passwordEye));

    this.append(
      new BaseComponent<HTMLButtonElement>({
        tag: 'button',
        className: style.button,
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
}
