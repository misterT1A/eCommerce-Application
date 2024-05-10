import Controller from '@components/controller';
import type BaseComponent from '@utils/base-component';

import LoginPage from './login-page';

export default class LoginController extends Controller<LoginPage> {
  constructor() {
    super(new LoginPage());
  }

  public get getView() {
    return this.view;
  }

  public showContent(parent: BaseComponent) {
    parent.appendChildren([this.view]);
  }
}
