import BaseComponent from '@utils/base-component';
import { button, div, input, label, p, span } from '@utils/elements';

import styles from './_form-ui-elements.scss';

/**
 * Represents a form field component.
 * @extends BaseComponent
 */
class FormField extends BaseComponent {
  private input: BaseComponent<HTMLInputElement>;

  private errors: BaseComponent<HTMLElement>;

  private inputWrapper: BaseComponent<HTMLElement>;

  /**
   * Creates an instance of FormField.
   * @param {string} name - The name of the form field.
   * @param {string} type - The type of input (e.g., 'text', 'password', 'date').
   * @param {boolean} [required=true] - Whether the input is required or not (default is true).
   */
  constructor(name: string, type: string, required = true) {
    super({ tag: 'div', className: styles.form__field }, label([styles.form__inputLabel], name));
    this.input = input([styles.form__input], { type, value: '', required, autocomplete: undefined });
    this.errors = div([styles.form__errors]);
    this.inputWrapper = div([styles.form__inputWrapper], this.input);
    if (type === 'password') {
      const togglerPasswordVisibility = button([styles.form__inputPasswordToggler], '', { type: 'button' });
      togglerPasswordVisibility.addListener('click', () => this.toggleFieldType());
      this.inputWrapper.appendChildren([togglerPasswordVisibility]);
    }
    if (type === 'date') {
      this.inputWrapper.addClass(styles.form__inputWrapper_date);
      const currentDate = `${new Date().toLocaleDateString()}`;
      const dateLabel = span([styles.form__inputDateLabel], currentDate);
      this.input.getNode().value = currentDate;
      this.input.addListener('input', () =>
        dateLabel.setTextContent(`${new Date(this.getValue()).toLocaleDateString()}`)
      );
      this.inputWrapper.append(dateLabel);
    }
    this.appendChildren([this.inputWrapper, this.errors]);
  }

  /**
   * Gets the value of the form field input.
   * @returns {string} - The value of the input.
   */
  public getValue(): string {
    return this.input.getNode().value;
  }

  private toggleFieldType() {
    const inputType = this.input.getNode().type;
    this.inputWrapper.getNode().classList.toggle(styles.form__inputWrapper_visible);
    this.input.getNode().type = inputType === 'text' ? 'password' : 'text';
  }

  /**
   * Updates the errors displayed for the form field.
   * @param {...string[]} errors - The error messages to display.
   */
  public updateErrors(errors: string[]): void {
    this.errors.destroyChildren();
    if (this.getValue()) {
      [...errors].forEach((error) => this.errors.appendChildren([p([styles.form__inputError], error)]));
    } else {
      this.errors.append(p([styles.form__inputError], 'Required'));
    }
  }
}

export default FormField;
