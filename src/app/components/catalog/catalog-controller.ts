import Controller from '@components/controller';
import type Router from '@src/app/router/router';

import CatalogView from './catalog-view';

export default class CatalogController extends Controller<CatalogView> {
  constructor(router: Router) {
    super(new CatalogView(router));
  }
}
