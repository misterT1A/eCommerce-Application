import BaseComponent from '@utils/base-component';

import style from './_login.scss';

export default class LoginFormComponent extends BaseComponent<HTMLFormElement> {
  public constructor() {
    super({ tag: 'form', className: style['login-form'], action: '#' });

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
        className: 'error-container',
      })
    );
  }
}
