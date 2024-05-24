import Controller from '@components/controller';
import AuthService from '@services/auth-service';
import type Router from '@src/app/router/router';

import HeaderView from './header_view';

export default class HeaderController extends Controller<HeaderView> {
  constructor(router: Router) {
    super(new HeaderView(router));
  }

  public changeTextLoggined(name?: string) {
    this.view.changeTextLoggined(name);
  }

  public updateTextLoggined(name?: string) {
    if (AuthService.isAuthorized()) {
      this.changeTextLoggined(name);
    }
  }
}
