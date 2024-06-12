import Controller from '@components/controller';
import type Router from '@src/app/router/router';
import type BaseComponent from '@utils/base-component';

import AboutUsView from './about_us-view';

export default class Controller404 extends Controller<BaseComponent> {
  constructor(router: Router) {
    super(new AboutUsView(router));
  }
}
