import BaseComponent from '@utils/base-component';
import { input, span } from '@utils/elements';

import styles from './_form-ui-elements.scss';

class Checkbox extends BaseComponent {
  private input: BaseComponent<HTMLInputElement>;

  constructor(labelText: string) {
    super({ tag: 'label' });
    this.addClass(styles.form__checkbox);
    this.input = input([styles.form__inputCheckbox], { type: 'checkbox' });
    this.appendChildren([this.input, span([styles.form__inputCheckmark], ''), span(['form__input-label'], labelText)]);
  }

  public getValue() {
    return this.input.getNode().checked;
  }

  public setValue(isChecked: boolean) {
    this.input.getNode().checked = isChecked;
  }
}

export default Checkbox;
