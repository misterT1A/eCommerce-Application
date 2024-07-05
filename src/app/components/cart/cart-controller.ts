import Controller from '@components/controller';
import type HeaderController from '@components/header/header_controller';
import type Router from '@src/app/router/router';

import CartView from './cart-view';

export default class CartController extends Controller<CartView> {
  constructor(router: Router, headerController: HeaderController) {
    super(new CartView(router, headerController));
  }
}
