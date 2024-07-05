import Pages from '@src/app/router/pages';
import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';
import { a, button, div, h2, p, span } from '@utils/elements';
import isNotNullable from '@utils/is-non-nullable';

import style from './_login-form.scss';

export default class LoginView extends BaseComponent<HTMLFormElement> {
  private linkContainer: BaseComponent;

  private button: BaseComponent<HTMLButtonElement>;

  constructor(private router: Router) {
    super({ tag: 'form', noValidate: true, className: style['login-form'], action: '#' });
    this.linkContainer = div(
      [style['link-container']],
      span([style.plug], "Don't have an account?"),
      a([style['form-link']], {
        href: './registration',
        text: 'Register',
        navigate: () => this.router.navigate(Pages.REG),
      })
    );
    this.appendChildren([
      h2([style['form-title']], 'Login'),
      p([style['form-text']], 'Please, enter your email and password'),
    ]);
    this.renderFormContent();
    this.button = button([style.button], 'LOGIN', { type: 'submit' });
    this.appendChildren([this.button, this.linkContainer]);
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

  public disableButton(): void {
    this.button.getNode().disabled = true;
  }

  public enableButton(): void {
    this.button.getNode().disabled = false;
  }

  public getFormValues(): ILoginData | null {
    const userEmail = this.getNode().querySelector('input[name="email"]') as HTMLInputElement;
    const userPass = this.getNode().querySelector('input[name="password"]') as HTMLInputElement;

    if (isNotNullable(userEmail) && isNotNullable(userPass)) {
      return {
        email: userEmail.value,
        password: userPass.value,
      } as ILoginData;
    }
    return null;
  }
}
