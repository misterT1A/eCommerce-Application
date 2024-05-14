import Controller from '@components/controller';
import type Router from '@src/app/router/router';

import HeaderView from './header_view';

export default class HeaderController extends Controller<HeaderView> {
  constructor(router: Router) {
    super(new HeaderView(router));
  }

  public changeTextLoggined() {
    this.view.changeTextLoggined();
  }
}
