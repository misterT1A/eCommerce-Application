import BaseComponent from '@utils/base-component';
import { input, label, span } from '@utils/elements';

import styles from './_form-ui-elements.scss';

/**
 * Represents a Checkbox component.
 * @extends BaseComponent
 */
class Toggler extends BaseComponent {
  private input: BaseComponent<HTMLInputElement>;

  constructor(labelText: string) {
    super({ tag: 'div' });
    this.addClass(styles.form__toggler);
    this.input = input([styles.form__inputToggler], { type: 'checkbox' });
    this.appendChildren([
      span([styles.form__togglerLabel], labelText),
      label(
        [styles.form__inputTogglerContainer],
        '',
        this.input,
        span([styles.form__inputTogglerBase], '', span([styles.form__inputTogglerMark], ''))
      ),
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

export default Toggler;
