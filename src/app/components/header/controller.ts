import Controller from '@components/controller';
import type Router from '@src/app/router/router';
import type BaseComponent from '@utils/base-component';

import HeaderView from './view';

export default class HeaderController extends Controller<BaseComponent> {
  // protected router: Router;

  constructor(router: Router) {
    super(new HeaderView(router));
    // this.router = router;
  }
}
