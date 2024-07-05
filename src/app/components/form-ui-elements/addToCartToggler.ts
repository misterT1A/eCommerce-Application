import BaseComponent from '@utils/base-component';
import { input, span, svg } from '@utils/elements';

import styles from './_form-ui-elements.scss';

class AddToCart extends BaseComponent {
  private input: BaseComponent<HTMLInputElement>;

  private button: BaseComponent<HTMLSpanElement>;

  constructor() {
    super({ tag: 'label', className: styles.form__addToCartButton });
    this.input = input([styles.form__inputAddToCart], { type: 'radio' });

    this.button = span(
      [styles.form__addToCartIcons],
      '',
      svg('/assets/img/cart-active-1.svg#icon', styles.form__addToCartIconActive),
      svg('/assets/img/cart-checked.svg#icon', styles.form__addToCartIconInactive)
    );
    this.button.getNode().setAttribute('data-name', 'add-to-cart');
    this.input.getNode().setAttribute('data-name', 'add-to-cart-input');
    this.appendChildren([this.input, this.button]);
  }

  public select() {
    this.input.getNode().checked = true;
  }

  public unselect() {
    this.input.getNode().checked = false;
  }

  public getValue() {
    return this.input.getNode().checked;
  }
}

export default AddToCart;
