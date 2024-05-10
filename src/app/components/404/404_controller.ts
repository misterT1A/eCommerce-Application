import Controller from '@components/controller';
import type Router from '@src/app/router/router';
import type BaseComponent from '@utils/base-component';

import View404 from './404_view';

export default class Controller404 extends Controller<BaseComponent> {
  constructor(router: Router) {
    super(new View404(router));
  }
}
