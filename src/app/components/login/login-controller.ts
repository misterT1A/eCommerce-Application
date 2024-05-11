import Controller from '@components/controller';

import LoginPage from './login-page';

export default class LoginController extends Controller<LoginPage> {
  constructor() {
    super(new LoginPage());
  }
}
