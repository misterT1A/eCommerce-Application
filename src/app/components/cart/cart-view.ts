import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';

import styles from './_cart.scss';

export default class CartView extends BaseComponent {
  constructor(protected router: Router) {
    super({ className: styles.cart });
    this.router = router;
  }
}
