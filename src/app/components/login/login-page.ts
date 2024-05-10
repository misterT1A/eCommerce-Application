import LoginFormComponent from '@components/login/login-form-component';
import BaseComponent from '@utils/base-component';

import style from './_login.scss';

export default class LoginPage extends BaseComponent {
  constructor() {
    super(
      { className: style['login-block'] },
      new BaseComponent<HTMLParagraphElement>({
        tag: 'p',
        textContent: 'Please enter your email and password',
      })
    );
    this.render();
  }

  protected render() {
    const formComponent = new LoginFormComponent();
    this.append(formComponent);
  }
}
