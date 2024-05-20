import Controller from '@components/controller';
import type Router from '@src/app/router/router';

import FooterView from './footer-view';

export default class FooterController extends Controller<FooterView> {
  constructor(router: Router) {
    super(new FooterView(router));
  }
}
