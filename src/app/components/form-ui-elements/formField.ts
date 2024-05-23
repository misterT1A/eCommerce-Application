import AirDatepicker from 'air-datepicker';
import localeEn from 'air-datepicker/locale/en';

import BaseComponent from '@utils/base-component';
import { button, div, input, label, p } from '@utils/elements';
import 'air-datepicker/air-datepicker.css';
import isMobile from '@utils/is-mobile-device';

import styles from './_form-ui-elements.scss';

/**
 * Represents a form field component.
 * @extends BaseComponent
 */
class FormField extends BaseComponent {
  private input: BaseComponent<HTMLInputElement>;

  private errors: BaseComponent<HTMLElement>;

  private inputWrapper: BaseComponent<HTMLElement>;

  private datePicker: AirDatepicker | null = null;

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
      this.input.getNode().type = 'text';
      this.input.getNode().placeholder = 'MM/DD/YYYY';
      this.input.getNode().setAttribute('inputmode', 'none');
      this.input.getNode().onkeydown = () => false;
      this.datePicker = new AirDatepicker(this.input.getNode(), {
        selectedDates: [new Date()],
        locale: localeEn,
        dateFormat: 'MM/dd/yyyy',
        isMobile: isMobile(),
        autoClose: true,
        onSelect: () => {
          this.input.getNode().dispatchEvent(new Event('input', { bubbles: true }));
        },
      });
      this.inputWrapper.addClass(styles.form__inputWrapper_date);
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

  public destroy(): void {
    this.datePicker?.destroy();
    super.destroy();
  }
}

export default FormField;
