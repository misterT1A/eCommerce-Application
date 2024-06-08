import Controller from '@components/controller';
import type Router from '@src/app/router/router';

import CartView from './cart-view';

export default class CartController extends Controller<CartView> {
  constructor(router: Router) {
    super(new CartView(router));
  }
}
