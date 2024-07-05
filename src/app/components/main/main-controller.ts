import Controller from '@components/controller';
import type Router from '@src/app/router/router';

import MainView from './main-view';

export default class MainController extends Controller<MainView> {
  constructor(router: Router) {
    super(new MainView(router));
  }
}
