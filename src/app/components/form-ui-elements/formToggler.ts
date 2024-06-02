import BaseComponent from '@utils/base-component';
import { input, label, span } from '@utils/elements';

import styles from './_form-ui-elements.scss';

/**
 * Represents a Toggler component.
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

  /**
   * Binds the current toggler with another toggler.
   *
   * @param {Toggler} toggler - The toggler to bind with.
   * @param {boolean} [isInverse=true] - If true, the bound toggler will have the opposite value.
   * @param {boolean} [isDependent=false] - If true, the bound toggler will be checked if the current toggler is checked.
   */
  public bindWith(toggler: Toggler, isInverse = true, isDependent = false) {
    const bindToggler = toggler;
    this.addListener('input', () => {
      if (isDependent) {
        if (this.getValue()) {
          bindToggler?.setValue(true);
        }
      } else if (!this.getValue()) {
        bindToggler?.setValue(isInverse);
      }
    });
  }
}

export default Toggler;
