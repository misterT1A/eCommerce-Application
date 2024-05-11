import BaseComponent from '@utils/base-component';
import { input, span } from '@utils/elements';

import styles from './_form-ui-elements.scss';

/**
 * Represents a Checkbox component.
 * @extends BaseComponent
 */
class Checkbox extends BaseComponent {
  private input: BaseComponent<HTMLInputElement>;

  /**
   * Creates an instance of Checkbox.
   * @param {string} labelText - The label text for the checkbox.
   */
  constructor(labelText: string) {
    super({ tag: 'label' });
    this.addClass(styles.form__checkbox);
    this.input = input([styles.form__inputCheckbox], { type: 'checkbox' });
    this.appendChildren([
      this.input,
      span([styles.form__inputCheckmark], ''),
      span([styles.form__checkmarkLabel], labelText),
    ]);
  }

  /**
   * Gets the value of the checkbox.
   * @returns {boolean} - The value of the checkbox (true if checked, false otherwise).
   */
  public getValue(): boolean {
    return this.input.getNode().checked;
  }

  /**
   * Sets the value of the checkbox.
   * @param {boolean} isChecked - The value to set (true to check, false to uncheck).
   */
  public setValue(isChecked: boolean) {
    this.input.getNode().checked = isChecked;
  }
}

export default Checkbox;
